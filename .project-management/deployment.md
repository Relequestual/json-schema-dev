# Deployment Guide

## Environment Configuration

The project uses Cloudflare Workers for production deployment:

- **Development**: Local dev server (`pnpm dev`) - for development
- **Preview**: Local preview (`pnpm deploy:preview`) - for testing Workers runtime locally
- **Production**: `json-schema-dev.hello-c4b.workers.dev` (or `jsonschema.dev` when custom domain is ready)

## Environment Variables

The project uses a single production configuration with environment variables set during build:

- **ENVIRONMENT**: Set to "production" during build process
- **NITRO_PRESET**: Set to "cloudflare-module" for Workers compatibility
- Build-time variables available via `process.env.ENVIRONMENT` in application code

## Deployment Commands

### Deploy to Production

```bash
pnpm deploy
```

This runs:

1. `ENVIRONMENT=production nuxt build` - Builds app with production environment
2. `wrangler deploy` - Deploys to `json-schema-dev` worker (no environment suffix)

### Local Preview

```bash
pnpm deploy:preview
```

This runs `wrangler dev` for local testing with Workers runtime.

## Managing Secrets

For sensitive values like API keys, use Wrangler secrets (not environment variables):

### Set Secrets

```bash
# Interactive prompt (recommended)
pnpm wrangler secret put SENTRY_DSN

# Or from command line
echo "your-secret-value" | pnpm wrangler secret put SECRET_NAME
```

### List Secrets

```bash
pnpm wrangler secret list
```

### Delete Secrets

```bash
pnpm wrangler secret delete SECRET_NAME
```

## Common Secrets to Configure

When ready for production, set these secrets:

```bash
# Error tracking (optional)
pnpm wrangler secret put SENTRY_DSN

# Analytics (optional)
pnpm wrangler secret put GOOGLE_ANALYTICS_ID
```

## Deployment Status

- ✅ **Production**: `json-schema-dev.hello-c4b.workers.dev`
  - Clean worker name (no environment suffix)
  - Deploy with: `pnpm deploy`
  - Can be switched to custom domain (`jsonschema.dev`) by updating routes in `wrangler.toml`

## Next Steps

1. Test production deployment: `pnpm deploy`
2. When ready for custom domain: Update routes in `wrangler.toml` to point to `jsonschema.dev`
3. Add secrets as needed for monitoring and analytics
