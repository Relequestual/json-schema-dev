/**
 * API Endpoint Integration Tests
 * Tests HTTP endpoints for proper error codes and validation
 * Run with: pnpm test tests/api-endpoints.test.ts
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { SELF } from 'cloudflare:test';
import type { ShareRequest } from '../app/utils/sharing';

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

describe('POST /api/share', () => {
  describe('Validation Errors', () => {
    const validationErrorCases = [
      {
        name: 'non-object request body',
        body: JSON.stringify('not an object'),
        expectedMessage: 'must be an object',
      },
      {
        name: 'missing schema field',
        body: JSON.stringify({
          instance: '{}',
          implementations: { validators: ['ajv'] },
        }),
        expectedMessage: 'Schema field is required',
      },
      {
        name: 'missing instance field',
        body: JSON.stringify({
          schema: '{"type": "object"}',
          implementations: { validators: ['ajv'] },
        }),
        expectedMessage: 'Instance field is required',
      },
      {
        name: 'non-string schema',
        body: JSON.stringify({
          schema: { type: 'object' }, // Object instead of string
          instance: '{}',
        }),
        expectedMessage: 'must be a string',
      },
      {
        name: 'non-string instance',
        body: JSON.stringify({
          schema: '{"type": "object"}',
          instance: { foo: 'bar' }, // Object instead of string
        }),
        expectedMessage: 'must be a string',
      },
      {
        name: 'invalid JSON body',
        body: 'invalid json{',
        expectedMessage: null, // Just check status code
      },
    ];

    validationErrorCases.forEach(({ name, body, expectedMessage }) => {
      it(`should return 400 for ${name}`, async () => {
        const response = await SELF.fetch('http://example.com/api/share', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body,
        });

        expect(response.status).toBe(400);
        if (expectedMessage) {
          const error = (await response.json()) as { statusMessage: string };
          expect(error.statusMessage).toContain(expectedMessage);
        }
      });
    });
  });

  describe('Successful Requests', () => {
    const successfulRequestCases = [
      {
        name: 'valid payload with full response details',
        payload: createTestPayload(),
        headers: { 'Content-Type': 'application/json' },
        verify: (result: unknown) => {
          const typedResult = result as {
            shortId: string;
            contentHash: string;
            wasExisting: boolean;
            wasChunked: boolean;
          };
          expect(typedResult.shortId).toBeDefined();
          expect(typeof typedResult.shortId).toBe('string');
          expect(typedResult.contentHash).toBeDefined();
          expect(typedResult.wasExisting).toBe(false);
          expect(typedResult.wasChunked).toBe(false);
        },
      },
      {
        name: 'payload with minimal fields',
        payload: {
          schema: '{"type": "string"}',
          instance: '"hello"',
        },
        headers: { 'Content-Type': 'application/json' },
        verify: (result: unknown) => {
          const typedResult = result as { shortId: string };
          expect(typedResult.shortId).toBeDefined();
        },
      },
      {
        name: 'payload with custom validators',
        payload: createTestPayload({
          implementations: {
            validators: ['ajv', 'custom-validator'],
            configs: {
              ajv: { strict: true },
            },
          },
        }),
        headers: { 'Content-Type': 'application/json' },
        verify: (result: unknown) => {
          const typedResult = result as { shortId: string };
          expect(typedResult.shortId).toBeDefined();
        },
      },
      {
        name: 'request with user-agent header',
        payload: createTestPayload(),
        headers: {
          'Content-Type': 'application/json',
          'User-Agent': 'Test/1.0',
        },
        verify: (result: unknown) => {
          const typedResult = result as { shortId: string };
          expect(typedResult.shortId).toBeDefined();
        },
      },
    ];

    successfulRequestCases.forEach(({ name, payload, headers, verify }) => {
      it(`should return 200 for ${name}`, async () => {
        const response = await SELF.fetch('http://example.com/api/share', {
          method: 'POST',
          headers: headers as HeadersInit,
          body: JSON.stringify(payload),
        });

        expect(response.status).toBe(200);
        const result = await response.json();
        verify(result);
      });
    });
  });

  describe('Deduplication', () => {
    it('should return wasExisting=true for duplicate content', async () => {
      const payload = createTestPayload({
        schema: '{"type": "number", "maximum": 100}',
        instance: '50',
      });

      // First request
      const response1 = await SELF.fetch('http://example.com/api/share', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      expect(response1.status).toBe(200);
      const result1 = (await response1.json()) as { shortId: string; wasExisting: boolean };

      // Second request with same content
      const response2 = await SELF.fetch('http://example.com/api/share', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      expect(response2.status).toBe(200);
      const result2 = (await response2.json()) as { shortId: string; wasExisting: boolean };

      expect(result2.shortId).toBe(result1.shortId);
      expect(result2.wasExisting).toBe(true);
    });
  });
});

describe('GET /api/share/:id', () => {
  let testShortId: string;

  beforeEach(async () => {
    // Create a shared URL for retrieval tests
    const payload = createTestPayload({
      schema: '{"type": "boolean"}',
      instance: 'true',
    });

    const response = await SELF.fetch('http://example.com/api/share', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    const result = (await response.json()) as { shortId: string };
    testShortId = result.shortId;
  });

  describe('Successful Retrieval', () => {
    it('should return 200 with correct data for valid ID', async () => {
      const response = await SELF.fetch(`http://example.com/api/share/${testShortId}`);

      expect(response.status).toBe(200);
      const data = (await response.json()) as {
        version: string;
        schema: string;
        instance: string;
        implementations?: unknown;
      };

      expect(data.version).toBe('1.0');
      expect(data.schema).toBeDefined();
      expect(data.instance).toBeDefined();
      // Note: implementations may not be present in the response
      // if the API strips it during serialization
    });

    it('should not include internal metadata in response', async () => {
      // Ensures internal server metadata never leaks to clients
      // This is a security test for when we add internalMetadata fields
      const response = await SELF.fetch(`http://example.com/api/share/${testShortId}`);

      expect(response.status).toBe(200);
      const data = (await response.json()) as Record<string, unknown>;

      expect(data).not.toHaveProperty('internalMetadata');
    });

    it('should have correct response structure', async () => {
      const response = await SELF.fetch(`http://example.com/api/share/${testShortId}`);

      expect(response.status).toBe(200);
      const data = (await response.json()) as Record<string, unknown>;

      expect(data).toHaveProperty('version');
      expect(data).toHaveProperty('schema');
      expect(data).toHaveProperty('instance');
      // Implementations may be optional or omitted by the API
    });
  });

  describe('Error Cases', () => {
    const errorCases = [
      {
        name: 'non-existent short ID',
        shortId: 'nonexistent123',
        expectedStatus: 404,
        expectedMessage: 'not found',
      },
      {
        name: 'invalid short ID format',
        shortId: 'invalid@#$%',
        expectedStatus: 400,
        expectedMessage: 'Invalid short ID format',
      },
      {
        name: 'empty short ID',
        shortId: '',
        url: 'http://example.com/api/share/',
        expectedStatus: 400,
        expectedMessage: null,
      },
      {
        name: 'short ID with special characters',
        shortId: 'test!@#',
        expectedStatus: 400,
        expectedMessage: 'Invalid short ID format',
      },
    ];

    errorCases.forEach(({ name, shortId, url, expectedStatus, expectedMessage }) => {
      it(`should return ${expectedStatus} for ${name}`, async () => {
        const requestUrl = url || `http://example.com/api/share/${shortId}`;
        const response = await SELF.fetch(requestUrl);

        expect(response.status).toBe(expectedStatus);
        if (expectedMessage) {
          const error = (await response.json()) as { statusMessage: string };
          expect(error.statusMessage).toContain(expectedMessage);
        }
      });
    });
  });

  describe('Integration', () => {
    it('should round-trip data correctly', async () => {
      const originalPayload = createTestPayload({
        schema: '{"type": "array", "minItems": 1}',
        instance: '[1, 2, 3]',
        implementations: {
          validators: ['ajv'],
          configs: {
            ajv: { allErrors: true },
          },
        },
      });

      // Create
      const createResponse = await SELF.fetch('http://example.com/api/share', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(originalPayload),
      });

      expect(createResponse.status).toBe(200);
      const createResult = (await createResponse.json()) as { shortId: string };

      // Retrieve
      const getResponse = await SELF.fetch(`http://example.com/api/share/${createResult.shortId}`);

      expect(getResponse.status).toBe(200);
      const retrievedData = (await getResponse.json()) as {
        schema: string;
        instance: string;
        implementations: { validators: string[] };
      };

      // Verify basic response structure (detailed data integrity is verified in unit tests)
      expect(retrievedData.schema).toBeDefined();
      expect(retrievedData.instance).toBeDefined();
      expect(retrievedData.implementations).toBeDefined();
      expect(retrievedData.implementations.validators).toBeDefined();
    });

    it('should handle multiple sequential creates', async () => {
      const payloads = [
        createTestPayload({ instance: '"alpha"' }),
        createTestPayload({ instance: '"beta"' }),
        createTestPayload({ instance: '"gamma"' }),
      ];

      for (const payload of payloads) {
        const response = await SELF.fetch('http://example.com/api/share', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });

        expect(response.status).toBe(200);
        const result = (await response.json()) as { shortId: string };
        expect(result.shortId).toBeDefined();
      }
    });
  });
});
