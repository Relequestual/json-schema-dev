// Basic health check endpoint
// GET /api/health

export default defineEventHandler(async () => {
  return {
    status: 'ok',
    message: 'Server is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'unknown',
  };
});
