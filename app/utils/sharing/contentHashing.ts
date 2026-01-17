/**
 * Content Hashing Utilities
 * Provides consistent hashing for deduplication of JSON Schema + instance data
 */

import type { StoredShare } from './payloadTypes';

/**
 * Create content hash for deduplication
 * Hash is calculated on complete payload content (preserving user formatting)
 * Includes all fields: schema, instance, metadata, version, and any future additions
 */
export async function createContentHash(payload: StoredShare): Promise<string> {
  // Hash the complete payload (all fields, all versions)
  const jsonContent = JSON.stringify(payload);

  // Create SHA-256 hash
  const encoder = new TextEncoder();
  const data = encoder.encode(jsonContent);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);

  // Convert to hex string
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');

  return hashHex;
}

/**
 * Verify that two payloads have the same content hash
 * Useful for validation and testing
 */
export async function verifyContentMatch(
  payload1: StoredShare,
  payload2: StoredShare
): Promise<boolean> {
  const hash1 = await createContentHash(payload1);
  const hash2 = await createContentHash(payload2);
  return hash1 === hash2;
}

/**
 * Create a shorter hash for display purposes (first 12 characters)
 * Note: This is for display only, use full hash for deduplication
 */
export function createShortHash(fullHash: string): string {
  return fullHash.substring(0, 12);
}
