/**
 * Share API Tests
 * Tests for share content and retrieval functionality
 * Run with: pnpm test tests/share-api.test.ts
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { env } from 'cloudflare:test';
import type { D1Database } from '@cloudflare/workers-types/experimental';
import type { ShareRequest } from '../app/utils/sharing';
import { shareContent, retrieveSharedContent, createStoredShare } from '../app/utils/sharing';

// Helper to create test payloads
function createTestPayload(overrides?: Partial<ShareRequest>): ShareRequest {
  return {
    schema: JSON.stringify({ type: 'object' }),
    instance: JSON.stringify({ name: 'test' }),
    implementations: {
      validators: ['ajv'],
      configs: {},
    },
    ...overrides,
  };
}

// Helper to create large payloads for chunking tests
function createLargePayload(sizeInMB: number): ShareRequest {
  const targetSize = sizeInMB * 1024 * 1024;
  const largeString = 'x'.repeat(Math.floor(targetSize / 2)); // Divide by 2 for schema and instance

  return {
    schema: JSON.stringify({ type: 'string', description: largeString }),
    instance: JSON.stringify({ data: largeString }),
    implementations: {
      validators: ['ajv'],
      configs: {},
    },
  };
}

describe('Share API - Database Operations', () => {
  let db: D1Database;

  beforeEach(() => {
    db = env.DB;
  });

  describe('Creating Shared URLs', () => {
    it('should create a new shared URL successfully', async () => {
      const payload = createTestPayload();
      const shareData = createStoredShare(
        payload.schema,
        payload.instance,
        payload.implementations
      );

      const result = await shareContent(db, shareData);

      expect(result.shortId).toBeDefined();
      expect(typeof result.shortId).toBe('string');
      expect(result.shortId.length).toBeGreaterThan(0);
      expect(result.contentHash).toBeDefined();
      expect(result.wasExisting).toBe(false);
      expect(result.wasChunked).toBe(false);
    });

    it('should deduplicate identical content', async () => {
      const payload = createTestPayload({
        schema: '{"type": "string", "minLength": 5}',
        instance: '"hello world"',
      });

      const shareData = createStoredShare(
        payload.schema,
        payload.instance,
        payload.implementations
      );

      // First request
      const result1 = await shareContent(db, shareData);

      // Second request with same content
      const result2 = await shareContent(db, shareData);

      // Should return same short ID
      expect(result2.shortId).toBe(result1.shortId);
      expect(result2.contentHash).toBe(result1.contentHash);
      expect(result2.wasExisting).toBe(true);
    });

    it('should create different IDs for different content', async () => {
      const payload1 = createTestPayload({
        schema: '{"type": "string"}',
        instance: '"first"',
      });

      const payload2 = createTestPayload({
        schema: '{"type": "string"}',
        instance: '"second"',
      });

      const shareData1 = createStoredShare(
        payload1.schema,
        payload1.instance,
        payload1.implementations
      );

      const shareData2 = createStoredShare(
        payload2.schema,
        payload2.instance,
        payload2.implementations
      );

      const result1 = await shareContent(db, shareData1);
      const result2 = await shareContent(db, shareData2);

      expect(result1.shortId).not.toBe(result2.shortId);
      expect(result1.contentHash).not.toBe(result2.contentHash);
    });

    it('should handle large payloads with chunking', async () => {
      // Create payload slightly larger than 1.5MB to trigger chunking
      const largePayload = createLargePayload(2);
      const shareData = createStoredShare(
        largePayload.schema,
        largePayload.instance,
        largePayload.implementations
      );

      const result = await shareContent(db, shareData);

      expect(result.shortId).toBeDefined();
      expect(result.wasChunked).toBe(true);
      expect(result.contentHash).toBeDefined();
    });

    it('should not chunk small payloads', async () => {
      const smallPayload = createTestPayload();
      const shareData = createStoredShare(
        smallPayload.schema,
        smallPayload.instance,
        smallPayload.implementations
      );

      const result = await shareContent(db, shareData);

      expect(result.wasChunked).toBe(false);
    });

    it('should handle different validator configurations', async () => {
      const payload = createTestPayload({
        implementations: {
          validators: ['ajv', 'custom-validator'],
          configs: {
            ajv: { strict: true },
          },
        },
      });

      const shareData = createStoredShare(
        payload.schema,
        payload.instance,
        payload.implementations
      );

      const result = await shareContent(db, shareData);

      expect(result.shortId).toBeDefined();
    });

    it('should store metadata when provided', async () => {
      const payload = createTestPayload();
      const shareData = createStoredShare(
        payload.schema,
        payload.instance,
        payload.implementations
      );

      const metadata = {
        userAgent: 'Test/1.0',
        ipAddress: '127.0.0.1',
      };

      const result = await shareContent(db, shareData, metadata);

      expect(result.shortId).toBeDefined();
      expect(result.wasExisting).toBe(false);

      // Verify metadata was actually stored in database
      const storedMetadata = await db
        .prepare('SELECT user_agent, ip_address FROM url_metadata WHERE short_id = ?')
        .bind(result.shortId)
        .first<{ user_agent: string | null; ip_address: string | null }>();

      expect(storedMetadata).toBeDefined();
      expect(storedMetadata?.user_agent).toBe('Test/1.0');
      expect(storedMetadata?.ip_address).toBe('127.0.0.1');
    });
  });

  describe('Retrieving Shared URLs', () => {
    let testShortId: string;

    beforeEach(async () => {
      // Create a shared URL for retrieval tests
      const payload = createTestPayload({
        schema: '{"type": "number", "minimum": 0}',
        instance: '42',
      });

      const shareData = createStoredShare(
        payload.schema,
        payload.instance,
        payload.implementations
      );

      const result = await shareContent(db, shareData);
      testShortId = result.shortId;
    });

    it('should retrieve existing shared content', async () => {
      const data = await retrieveSharedContent(db, testShortId);

      expect(data).not.toBeNull();
      expect(data?.version).toBe('1.0');
      expect(data?.schema).toBeDefined();
      expect(data?.instance).toBeDefined();
      expect(data?.implementations).toBeDefined();
      expect(data?.implementations.validators).toContain('ajv');
    });

    it('should return null for non-existent short ID', async () => {
      const fakeId = 'nonexistent123';
      const data = await retrieveSharedContent(db, fakeId);

      expect(data).toBeNull();
    });

    it('should retrieve chunked content correctly', async () => {
      // Create large payload that will be chunked
      const largePayload = createLargePayload(2);
      const shareData = createStoredShare(
        largePayload.schema,
        largePayload.instance,
        largePayload.implementations
      );

      const createResult = await shareContent(db, shareData);
      expect(createResult.wasChunked).toBe(true);

      // Retrieve the chunked content
      const data = await retrieveSharedContent(db, createResult.shortId);

      // Should reconstruct correctly
      expect(data).not.toBeNull();
      expect(data?.version).toBe('1.0');
      expect(data?.schema).toBeDefined();
      expect(data?.instance).toBeDefined();
    });

    it('should round-trip data correctly', async () => {
      const originalPayload = createTestPayload({
        schema: '{"type": "array", "items": {"type": "string"}}',
        instance: '["a", "b", "c"]',
        implementations: {
          validators: ['ajv', 'custom'],
          configs: {
            ajv: { allErrors: true },
          },
        },
      });

      const shareData = createStoredShare(
        originalPayload.schema,
        originalPayload.instance,
        originalPayload.implementations
      );

      // Create
      const createResult = await shareContent(db, shareData);

      // Retrieve
      const retrievedData = await retrieveSharedContent(db, createResult.shortId);

      // Verify data matches
      expect(retrievedData).not.toBeNull();
      expect(retrievedData?.schema).toBe(originalPayload.schema);
      expect(retrievedData?.instance).toBe(originalPayload.instance);
      expect(retrievedData?.implementations.validators).toEqual(
        originalPayload.implementations?.validators
      );
      expect(retrievedData?.implementations.configs).toEqual(
        originalPayload.implementations?.configs
      );
    });

    it('should handle multiple creates and retrieves', async () => {
      const payloads = [
        createTestPayload({ instance: '"first"' }),
        createTestPayload({ instance: '"second"' }),
        createTestPayload({ instance: '"third"' }),
      ];

      const shortIds: string[] = [];

      // Create all
      for (const payload of payloads) {
        const shareData = createStoredShare(
          payload.schema,
          payload.instance,
          payload.implementations
        );
        const result = await shareContent(db, shareData);
        shortIds.push(result.shortId);
      }

      // Retrieve all
      for (let i = 0; i < shortIds.length; i++) {
        const data = await retrieveSharedContent(db, shortIds[i]!);
        expect(data).not.toBeNull();
        expect(data?.instance).toBe(payloads[i]?.instance);
      }
    });
  });
});
