# JSON Schema Playground

Browser-based JSON Schema validation playground built with Nuxt 4 and deployed on Cloudflare Workers with D1 database support.

## Setup

Make sure to install dependencies:

```bash
pnpm install
```

## Development

Start the development server with D1 database support:

```bash
pnpm dev
```

This runs `wrangler dev` which provides:

- Local development server on `http://localhost:8787`
- Automatic D1 database bindings
- Hot reload and file watching
- Production-like environment

### Database Setup

First-time database setup:

```bash
pnpm db:setup
```

Apply new migrations:

```bash
pnpm db:migrate
```

## Production

Build and deploy to Cloudflare Workers:

```bash
pnpm deploy:prod
```

Apply migrations to production database:

```bash
pnpm db:migrate:prod
```

## Available Scripts

- `pnpm dev` - Start development server with D1 support
- `pnpm dev:nuxt` - Start Nuxt-only development (no D1)
- `pnpm build` - Build for production
- `pnpm clean` - Clean build artifacts
- `pnpm db:setup` - Apply database migrations
- `pnpm db:migrate` - Apply migrations (local)
- `pnpm db:migrate:prod` - Apply migrations (production)
- `pnpm deploy:prod` - Build and deploy to production
