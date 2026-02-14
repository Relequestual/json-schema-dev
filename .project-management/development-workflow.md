# Development Workflow

## Core Commands

```bash
pnpm dev          # Full-stack development server
pnpm build        # Cloudflare Workers build
pnpm deploy       # Deploy to production
pnpm deploy:preview # Local Wrangler preview
```

## Development Server

```bash
pnpm dev
```

- Starts Nuxt development server with hot reload
- Includes static file serving and API routes
- Available at `http://localhost:3000`

## Building for Production

```bash
pnpm build
```

- Creates optimized build for Cloudflare Workers
- Outputs to `.output/` directory
- Uses Nitro preset `cloudflare-module`

## Deployment

```bash
pnpm deploy
```

- Builds and deploys to Cloudflare Workers
- Requires Cloudflare API tokens configured
- Uses `wrangler.toml` configuration

## Local Preview

```bash
pnpm deploy:preview
```

- Uses Wrangler to preview deployment locally
- Simulates Cloudflare Workers environment
- Useful for testing deployment before production

## Prerequisites

- Node.js 22.12.0 LTS (see `.nvmrc`)
- pnpm 9.15.3+
- Cloudflare account and API tokens (for deployment)

## Environment Setup

1. Install dependencies: `pnpm install`
2. Start development: `pnpm dev`
3. Configure Cloudflare tokens for deployment (see deployment setup in `current-tasks.md`)
