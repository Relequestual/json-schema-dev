import type { D1Database } from '@cloudflare/workers-types/experimental';

interface D1Migration {
  name: string;
  queries: string[];
}

declare module 'cloudflare:test' {
  // Controls the type of `import("cloudflare:test").env`
  interface ProvidedEnv {
    DB: D1Database; // D1 database binding
    TEST_MIGRATIONS: D1Migration[]; // D1 migrations
  }
}
