/**
 * Sharing Utilities - Main Export
 * Centralized exports for URL sharing functionality
 */

// Imports needed for helper functions below
import type { D1Database } from '@cloudflare/workers-types/experimental';
import { insertSharedUrl, getSharedUrl, type ShareResult } from './databaseOperations';
import type { StoredShare } from './payloadTypes';

// ID Generation
export {
  generateRandomId,
  generateShortId,
  isValidShortId,
  DEFAULT_ID_CONFIG,
  type IdGenerationConfig,
} from './idGeneration';

// Content Hashing
export { createContentHash, verifyContentMatch, createShortHash } from './contentHashing';

// Share Data Types
export {
  type ShareDataCore,
  type ShareRequest,
  type StoredShare,
  type StoredShareV1,
  type ShareResponse,
  type AnyStoredShare,
  isStoredShareV1,
  createStoredShare,
} from './payloadTypes';

// Payload Chunking
export {
  chunkPayload,
  reconstructPayload,
  validateChunks,
  calculateByteSize,
  DEFAULT_CHUNKING_CONFIG,
  type PayloadChunk,
  type ChunkingResult,
  type ChunkingConfig,
} from './payloadChunking';

// Database Operations
export {
  insertSharedUrl,
  getSharedUrl,
  deleteSharedUrl,
  checkExistingContent,
  checkIdExists,
  type SharedUrlRow,
  type UrlMetadataRow,
  type ShareResult,
} from './databaseOperations';

/**
 * Complete sharing workflow - high-level API
 */
export async function shareContent(
  db: D1Database,
  payload: StoredShare,
  metadata?: {
    userAgent?: string;
    ipAddress?: string;
  }
): Promise<ShareResult> {
  return insertSharedUrl(db, payload, metadata);
}

/**
 * Complete retrieval workflow - high-level API
 */
export async function retrieveSharedContent(
  db: D1Database,
  shortId: string
): Promise<StoredShare | null> {
  return getSharedUrl(db, shortId);
}
