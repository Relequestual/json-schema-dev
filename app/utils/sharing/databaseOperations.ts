/**
 * Database Operations for Shared URLs
 * Handles all database interactions for URL sharing with chunking support
 */

import type { D1Database, D1PreparedStatement } from '@cloudflare/workers-types/experimental';
import type { StoredShare } from './payloadTypes';
import type { PayloadChunk } from './payloadChunking';
import { createContentHash } from './contentHashing';
import { chunkPayload, reconstructPayload, validateChunks } from './payloadChunking';
import { generateShortId } from './idGeneration';

/**
 * Database row structure for shared_urls table
 */
export type SharedUrlRow = {
  short_id: string;
  data_blob: string;
  created_at: string;
  is_multipart: boolean;
  part_index: number | null;
  total_parts: number | null;
  primary_part: string | null;
};

/**
 * Metadata row structure for url_metadata table
 */
export type UrlMetadataRow = {
  id: number;
  short_id: string;
  content_hash: string;
  user_agent: string | null;
  ip_address: string | null;
  created_at: string;
  access_count: number;
  last_accessed_at: string | null;
};

/**
 * Result of sharing operation
 */
export type ShareResult = {
  /** The short ID for the shared URL */
  shortId: string;
  /** Whether this was a new creation or existing content */
  wasExisting: boolean;
  /** Content hash used for deduplication */
  contentHash: string;
  /** Whether the payload was chunked */
  wasChunked: boolean;
};

/**
 * Check if content with the given hash already exists
 */
export async function checkExistingContent(
  db: D1Database,
  contentHash: string
): Promise<string | null> {
  const result = await db
    .prepare('SELECT short_id FROM url_metadata WHERE content_hash = ? LIMIT 1')
    .bind(contentHash)
    .first<{ short_id: string }>();

  return result?.short_id || null;
}

/**
 * Check if a short ID already exists (for collision detection)
 */
export async function checkIdExists(db: D1Database, shortId: string): Promise<boolean> {
  const result = await db
    .prepare('SELECT 1 FROM shared_urls WHERE short_id = ?')
    .bind(shortId)
    .first();

  return result !== null;
}

/**
 * Insert a new shared URL with chunking support
 */
export async function insertSharedUrl(
  db: D1Database,
  payload: StoredShare,
  metadata?: {
    userAgent?: string;
    ipAddress?: string;
  }
): Promise<ShareResult> {
  // Create content hash for deduplication
  const contentHash = await createContentHash(payload);

  // Check if content already exists
  const existingId = await checkExistingContent(db, contentHash);
  if (existingId) {
    // Update access count for existing URL
    await db
      .prepare(
        'UPDATE url_metadata SET access_count = access_count + 1, last_accessed_at = CURRENT_TIMESTAMP WHERE short_id = ?'
      )
      .bind(existingId)
      .run();

    return {
      shortId: existingId,
      wasExisting: true,
      contentHash,
      wasChunked: false, // We don't know, but it doesn't matter for existing content
    };
  }

  // Chunk the payload
  const chunkingResult = chunkPayload(payload);
  const { chunks, wasChunked } = chunkingResult;

  // Generate unique IDs for all chunks
  const collisionChecker = (id: string) => checkIdExists(db, id);
  const shortIds: string[] = [];
  for (let i = 0; i < chunks.length; i++) {
    const id = await generateShortId(collisionChecker);
    shortIds.push(id);
  }

  // Primary short ID is the first one
  const primaryShortId = shortIds[0];
  if (!primaryShortId) {
    throw new Error('Failed to generate primary short ID');
  }

  try {
    // Begin transaction
    const statements: D1PreparedStatement[] = [];

    // Insert all chunks
    for (let i = 0; i < chunks.length; i++) {
      const chunk = chunks[i];
      const shortId = shortIds[i];

      if (!chunk || !shortId) {
        throw new Error(`Missing chunk or ID at index ${i}`);
      }

      const stmt = db
        .prepare(
          `
          INSERT INTO shared_urls (
            short_id, data_blob, is_multipart,
            part_index, total_parts, primary_part
          ) VALUES (?, ?, ?, ?, ?, ?)
        `
        )
        .bind(
          shortId,
          chunk.data,
          chunk.isMultipart,
          chunk.isMultipart ? chunk.partIndex : null,
          chunk.isMultipart ? chunk.totalParts : null,
          chunk.isMultipart ? primaryShortId : null
        );

      statements.push(stmt);
    }

    // Insert metadata for primary URL
    const metadataStmt = db
      .prepare(
        `
        INSERT INTO url_metadata (
          short_id, content_hash, user_agent, ip_address, access_count
        ) VALUES (?, ?, ?, ?, 1)
      `
      )
      .bind(primaryShortId, contentHash, metadata?.userAgent || null, metadata?.ipAddress || null);

    statements.push(metadataStmt);

    // Execute all statements
    await db.batch(statements);

    return {
      shortId: primaryShortId,
      wasExisting: false,
      contentHash,
      wasChunked,
    };
  } catch (error) {
    throw new Error(`Failed to insert shared URL: ${error}`);
  }
}

/**
 * Retrieve a shared URL by short ID
 */
export async function getSharedUrl(db: D1Database, shortId: string): Promise<StoredShare | null> {
  // First, get the primary row to check if it's multipart
  const primaryRow = await db
    .prepare('SELECT * FROM shared_urls WHERE short_id = ?')
    .bind(shortId)
    .first<SharedUrlRow>();

  if (!primaryRow) {
    return null;
  }

  // Update access tracking
  await db
    .prepare(
      'UPDATE url_metadata SET access_count = access_count + 1, last_accessed_at = CURRENT_TIMESTAMP WHERE short_id = ?'
    )
    .bind(shortId)
    .run();

  // Handle single part
  if (!primaryRow.is_multipart) {
    try {
      return JSON.parse(primaryRow.data_blob);
    } catch (error) {
      throw new Error(`Failed to parse single-part payload: ${error}`);
    }
  }

  // Handle multipart - get all chunks
  const primaryPartId = primaryRow.primary_part || shortId;
  const allChunksResult = await db
    .prepare(
      'SELECT * FROM shared_urls WHERE primary_part = ? OR (short_id = ? AND is_multipart = FALSE) ORDER BY part_index'
    )
    .bind(primaryPartId, primaryPartId)
    .all<SharedUrlRow>();

  if (!allChunksResult.results || allChunksResult.results.length === 0) {
    throw new Error(`No chunks found for multipart URL: ${shortId}`);
  }

  // Convert database rows to PayloadChunk format
  const chunks: PayloadChunk[] = allChunksResult.results.map((row: SharedUrlRow) => ({
    data: row.data_blob,
    partIndex: row.part_index!,
    totalParts: row.total_parts!,
    isMultipart: row.is_multipart,
  }));

  // Validate chunks before reconstruction
  const validation = validateChunks(chunks);
  if (!validation.isValid) {
    throw new Error(`Chunk validation failed: ${validation.errors.join(', ')}`);
  }

  // Reconstruct and return payload
  return reconstructPayload(chunks);
}

/**
 * Get metadata for a shared URL
 */
export async function getUrlMetadata(
  db: D1Database,
  shortId: string
): Promise<UrlMetadataRow | null> {
  const result = await db
    .prepare('SELECT * FROM url_metadata WHERE short_id = ?')
    .bind(shortId)
    .first<UrlMetadataRow>();

  return result || null;
}

/**
 * Delete a shared URL and all its chunks
 */
export async function deleteSharedUrl(db: D1Database, shortId: string): Promise<boolean> {
  // Get the primary row to check if it's multipart
  const primaryRow = await db
    .prepare('SELECT primary_part, is_multipart FROM shared_urls WHERE short_id = ?')
    .bind(shortId)
    .first<{ primary_part: string | null; is_multipart: boolean }>();

  if (!primaryRow) {
    return false;
  }

  try {
    const statements: D1PreparedStatement[] = [];

    // Delete all chunks (including the primary)
    if (primaryRow.is_multipart && primaryRow.primary_part) {
      // Delete all chunks for this multipart URL
      statements.push(
        db.prepare('DELETE FROM shared_urls WHERE primary_part = ?').bind(primaryRow.primary_part)
      );
      statements.push(
        db.prepare('DELETE FROM url_metadata WHERE short_id = ?').bind(primaryRow.primary_part)
      );
    } else {
      // Delete single part
      statements.push(db.prepare('DELETE FROM shared_urls WHERE short_id = ?').bind(shortId));
      statements.push(db.prepare('DELETE FROM url_metadata WHERE short_id = ?').bind(shortId));
    }

    await db.batch(statements);
    return true;
  } catch (error) {
    throw new Error(`Failed to delete shared URL: ${error}`);
  }
}
