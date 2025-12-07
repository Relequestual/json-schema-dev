/**
 * Payload Chunking Utilities
 * Handles splitting large payloads for D1's 2MB row limit and reconstruction
 */

import type { ShareablePayload } from './payloadTypes';

/**
 * Configuration for payload chunking
 */
export type ChunkingConfig = {
  /** Maximum chunk size in bytes (default: 1.5MB for safety margin) */
  maxChunkSize: number;
  /** Text encoding to use */
  encoding: 'utf-8';
};

/**
 * Default chunking configuration
 */
export const DEFAULT_CHUNKING_CONFIG: ChunkingConfig = {
  maxChunkSize: 1.5 * 1024 * 1024, // 1.5MB safety margin below D1's 2MB limit
  encoding: 'utf-8',
};

/**
 * Represents a chunk of data for storage
 */
export type PayloadChunk = {
  /** The actual data content for this chunk */
  data: string;
  /** Position in the sequence (0, 1, 2, etc.) - null for single parts */
  partIndex: number | null;
  /** Total number of parts in this payload */
  totalParts: number;
  /** Whether this payload is split across multiple parts */
  isMultipart: boolean;
};

/**
 * Result of chunking operation
 */
export type ChunkingResult = {
  /** Array of chunks ready for database storage */
  chunks: PayloadChunk[];
  /** Total size of original payload in bytes */
  originalSize: number;
  /** Whether chunking was necessary */
  wasChunked: boolean;
};

/**
 * Calculate the byte size of a string using UTF-8 encoding
 */
export function calculateByteSize(str: string): number {
  return new TextEncoder().encode(str).length;
}

/**
 * Split a large payload into chunks for D1 storage
 */
export function chunkPayload(
  payload: ShareablePayload,
  config: ChunkingConfig = DEFAULT_CHUNKING_CONFIG
): ChunkingResult {
  // Serialize the payload to JSON
  const jsonString = JSON.stringify(payload);
  const originalSize = calculateByteSize(jsonString);

  // If payload fits in one chunk, return single chunk
  if (originalSize <= config.maxChunkSize) {
    return {
      chunks: [
        {
          data: jsonString,
          partIndex: null,
          totalParts: 1,
          isMultipart: false,
        },
      ],
      originalSize,
      wasChunked: false,
    };
  }

  // Split into multiple chunks
  const chunks: PayloadChunk[] = [];
  let offset = 0;
  let partIndex = 0;

  while (offset < jsonString.length) {
    // Calculate simple chunk size based on character limit
    const remainingChars = jsonString.length - offset;
    const chunkSize = Math.min(config.maxChunkSize, remainingChars);
    const chunkData = jsonString.substring(offset, offset + chunkSize);

    chunks.push({
      data: chunkData,
      partIndex,
      totalParts: 0, // Will be set after we know total count
      isMultipart: true,
    });

    offset += chunkData.length;
    partIndex++;
  }

  // Update total parts count for all chunks
  const totalParts = chunks.length;

  // This should never happen - if we're in the chunking path, we should have multiple chunks
  if (totalParts === 1) {
    throw new Error('Logic error: single chunk created in multi-chunk path');
  }

  chunks.forEach((chunk) => {
    chunk.totalParts = totalParts;
  });

  return {
    chunks,
    originalSize,
    wasChunked: true,
  };
}

/**
 * Reconstruct a payload from chunks
 */
export function reconstructPayload(chunks: PayloadChunk[]): ShareablePayload {
  // Handle single chunk case
  if (chunks.length === 1 && chunks[0] && !chunks[0].isMultipart) {
    return JSON.parse(chunks[0].data);
  }

  // Handle multi-part case
  if (chunks.length === 0) {
    throw new Error('No chunks provided for reconstruction');
  }

  // Validate chunk integrity
  const validation = validateChunks(chunks);
  if (!validation.isValid) {
    throw new Error(`Chunk validation failed: ${validation.errors.join(', ')}`);
  }

  // Sort chunks by part index
  const sortedChunks = chunks.sort((a, b) => a.partIndex! - b.partIndex!);
  const reconstructedJson = sortedChunks.map((chunk) => chunk.data).join('');

  // Parse and return the payload
  try {
    return JSON.parse(reconstructedJson);
  } catch (error) {
    throw new Error(`Failed to parse reconstructed payload: ${error}`);
  }
}

/**
 * Validate chunk integrity before reconstruction
 */
export function validateChunks(chunks: PayloadChunk[]): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (chunks.length === 0) {
    errors.push('No chunks provided');
    return { isValid: false, errors };
  }

  // Single chunk validation
  if (chunks.length === 1) {
    const chunk = chunks[0]!;
    if (chunk.isMultipart) {
      errors.push('Single chunk marked as multipart');
    }
    if (chunk.partIndex !== null) {
      errors.push('Single chunk should have null part index');
    }
    if (chunk.totalParts !== 1) {
      errors.push('Single chunk has incorrect total parts count');
    }
    return { isValid: errors.length === 0, errors };
  }

  // Multi-part validation
  const totalParts = chunks[0]?.totalParts;
  if (!totalParts) {
    errors.push('Missing total parts information');
    return { isValid: false, errors };
  }

  // Check all chunks have same total parts
  for (const chunk of chunks) {
    if (chunk.totalParts !== totalParts) {
      errors.push(`Inconsistent total parts: expected ${totalParts}, got ${chunk.totalParts}`);
    }
    if (!chunk.isMultipart) {
      errors.push(`Chunk ${chunk.partIndex} not marked as multipart`);
    }
  }

  // Check for missing or duplicate part indexes
  const partIndexes = new Set(chunks.map((c) => c.partIndex));
  if (partIndexes.size !== totalParts) {
    errors.push('Missing or duplicate part indexes found');
  }

  return { isValid: errors.length === 0, errors };
}
