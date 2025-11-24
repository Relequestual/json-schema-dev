/**
 * D1 Database Smoke Tests
 *
 * Tests D1 database functionality using @cloudflare/vitest-pool-workers.
 * Migrations are applied in the setup file (apply-migrations.ts).
 *
 * @see https://developers.cloudflare.com/d1/best-practices/local-development/#test-programmatically
 */

import { describe, it, expect } from 'vitest';
import { env } from 'cloudflare:test';

describe('D1 Database Smoke Tests', () => {
  it('should connect to D1 database', async () => {
    expect(env.DB).toBeDefined();

    // Simple connection test
    const result = await env.DB.prepare('SELECT 1 as test').first<{ test: number }>();
    expect(result?.test).toBe(1);
  });

  it('should have expected database schema', async () => {
    // Check that our expected tables exist
    const tablesQuery = await env.DB.prepare(
      `SELECT name FROM sqlite_master WHERE type='table' ORDER BY name`
    ).all<{ name: string }>();

    const tableNames = tablesQuery.results.map((table) => table.name);
    expect(tableNames).toContain('shared_urls');
    expect(tableNames).toContain('url_metadata');
  });
});
