/**
 * GET /api/share/[id]
 * Retrieve shared data by short ID
 */

import { isValidShortId, retrieveSharedContent } from '~/utils/sharing';
import type { ShareResponse } from '~/utils/sharing';

export default defineEventHandler(async (event) => {
  try {
    // Get the short ID from route parameters
    const shortId = getRouterParam(event, 'id');

    if (!shortId) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Short ID is required',
      });
    }

    // Validate short ID format
    if (!isValidShortId(shortId)) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Invalid short ID format',
        data: { shortId },
      });
    }

    // Access D1 database binding
    const db = event.context.cloudflare?.env?.DB;
    if (!db) {
      throw createError({
        statusCode: 500,
        statusMessage: 'Database not available',
      });
    }

    // Retrieve the shared content
    const storedShare = await retrieveSharedContent(db, shortId);

    if (!storedShare) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Shared URL not found',
        data: { shortId },
      });
    }

    // Return public response (omits internalMetadata)
    const response: ShareResponse = {
      version: storedShare.version,
      schema: storedShare.schema,
      instance: storedShare.instance,
      implementations: storedShare.implementations,
    };

    return response;
  } catch (error: unknown) {
    // Re-throw HTTP errors
    if (error && typeof error === 'object' && 'statusCode' in error) {
      throw error;
    }

    // Handle unexpected errors
    console.error('Retrieve endpoint error:', error);
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to retrieve shared URL',
      data: { error: String(error) },
    });
  }
});
