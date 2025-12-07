/**
 * Sharing Utilities - Main Export
 * Centralized exports for URL sharing functionality
 */

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

// Payload Types
export {
  type ShareablePayload,
  type ShareablePayloadV1,
  type AnyShareablePayload,
  isShareablePayloadV1,
  createShareablePayload,
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
  getUrlMetadata,
  deleteSharedUrl,
  checkExistingContent,
  checkIdExists,
  type SharedUrlRow,
  type UrlMetadataRow,
  type ShareResult,
} from './databaseOperations';

// Import for function implementations
import type { D1Database } from '@cloudflare/workers-types/experimental';
import { insertSharedUrl, getSharedUrl } from './databaseOperations';
import type { ShareablePayload } from './payloadTypes';
import type { ShareResult } from './databaseOperations';

/**
 * Complete sharing workflow - high-level API
 */
export async function shareContent(
  db: D1Database,
  payload: ShareablePayload,
  metadata?: {
    userAgent?: string;
    ipAddress?: string;
  }
): Promise<ShareResult> {
  return await insertSharedUrl(db, payload, metadata);
}

/**
 * Complete retrieval workflow - high-level API
 */
export async function retrieveSharedContent(
  db: D1Database,
  shortId: string
): Promise<ShareablePayload | null> {
  return await getSharedUrl(db, shortId);
}
