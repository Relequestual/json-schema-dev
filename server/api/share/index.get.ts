/**
 * GET /api/share
 * Handle requests without a short ID parameter
 */

export default defineEventHandler(() => {
  throw createError({
    statusCode: 400,
    statusMessage: 'Short ID is required',
  });
});
