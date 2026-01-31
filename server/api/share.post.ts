/**
 * POST /api/share
 * Create a new shared URL from JSON Schema and instance data
 */

import { isPlainObject } from 'lodash';
import { shareContent, createStoredShare } from '~/utils/sharing';
import type { ShareDataCore } from '~/utils/sharing';

// Type guards
function isHttpError(error: unknown): error is { statusCode: number; statusMessage?: string } {
  return (
    typeof error === 'object' &&
    error !== null &&
    'statusCode' in error &&
    typeof (error as { statusCode?: unknown }).statusCode === 'number'
  );
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return isPlainObject(value);
}

// Validation helpers
function validateRequestBody(body: unknown): ShareDataCore {
  if (!isRecord(body)) {
    throw new Error('Request body must be an object');
  }

  if (typeof body.schema !== 'string') {
    throw new Error('Schema field is required and must be a string');
  }

  if (typeof body.instance !== 'string') {
    throw new Error('Instance field is required and must be a string');
  }

  const implementations = isRecord(body.implementations) ? body.implementations : {};
  const validators = Array.isArray(implementations.validators)
    ? implementations.validators
    : ['ajv'];
  const configs = isRecord(implementations.configs) ? implementations.configs : {};

  return {
    schema: body.schema,
    instance: body.instance,
    implementations: {
      validators,
      configs,
    },
  };
}

export default defineEventHandler(async (event) => {
  try {
    // Access D1 database binding
    const db = event.context.cloudflare?.env?.DB;

    if (!db) {
      throw createError({
        statusCode: 503,
        statusMessage: 'Database not available',
      });
    }

    // Get and validate request body
    const body = await readBody<unknown>(event);
    let validated;

    try {
      validated = validateRequestBody(body);
    } catch (error: unknown) {
      throw createError({
        statusCode: 400,
        statusMessage: String(error),
      });
    }

    // Create stored share data
    const shareData = createStoredShare(
      validated.schema,
      validated.instance,
      validated.implementations
    );

    // Extract metadata from request
    const userAgent = getHeader(event, 'user-agent');
    const ipAddress = getHeader(event, 'cf-connecting-ip') || getHeader(event, 'x-forwarded-for');

    const metadata = {
      ...(userAgent && { userAgent }),
      ...(ipAddress && { ipAddress }),
    };

    // Share the content
    const result = await shareContent(db, shareData, metadata);

    // Return result
    return {
      shortId: result.shortId,
      contentHash: result.contentHash,
      wasExisting: result.wasExisting,
      wasChunked: result.wasChunked,
    };
  } catch (error: unknown) {
    // Re-throw HTTP errors
    if (isHttpError(error)) {
      throw error;
    }

    // Handle unexpected errors
    console.error('Share error:', error);
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to create shared URL',
      data: { error: String(error) },
    });
  }
});
