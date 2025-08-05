# JSON Schema Playground - AI Agent Instructions

## Project Context

This is **jsonschema.dev** - a browser-based JSON Schema validation playground. Currently undergoing migration from Vue 2 + Vue CLI (in `previous/`) to **Nuxt 4** + Cloudflare Workers architecture.

## Architecture Overview

- **Current**: Nuxt 4 app with Cloudflare Workers deployment preset
- **Legacy**: Vue 2 + Bootstrap Vue + Vue CLI app (preserved in `previous/`)
- **Core Purpose**: Client-side JSON Schema validation with pluggable validator support (WASM, etc.)
- **Deployment**: Cloudflare Workers (modern approach, not Pages)

## Key Project Patterns

### Development Workflow

```bash
pnpm dev          # Development server (full-stack: static + API routes)
pnpm build        # Build for Cloudflare Workers
pnpm deploy       # Build + deploy to Cloudflare
pnpm deploy:preview # Local Wrangler preview
```

### Configuration Standards

- **Node.js**: Pinned to 22.12.0 LTS via `.nvmrc` (Volta compatible)
- **Package Manager**: pnpm 9.15.3+ (specified in package.json)
- **Compatibility Dates**: Always set to current date (follow Cloudflare best practice)
- **ESLint**: Uses flat config (`eslint.useFlatConfig: true`)

### Nuxt 4 Specifics

- **Structure**: Uses `app/` directory (not `pages/` or `src/`)
- **Modules**: @nuxt/eslint, @nuxt/fonts, @nuxt/icon, @nuxt/image, @nuxt/scripts
- **Build Target**: `nitro.preset: 'cloudflare-module'` with Node.js compatibility
- **TypeScript**: Built-in, no separate configuration needed

### Cloudflare Workers Setup

- **Runtime**: Modern Workers (not legacy Pages)
- **Config**: `wrangler.toml` + auto-generated `.output/server/wrangler.json`
- **Assets**: Static files served via ASSETS binding
- **Compatibility**: Node.js compatibility enabled (`nodeCompat: true`)

## Migration Context

- **previous/**: Complete Vue 2 app with components like `JSONEditor.vue`, `Results.vue`
- **Approach**: Building new app from scratch, lifting old code selectively as needed
- **Legacy Dependencies**: AJV (being replaced), CodeMirror for editing, Bootstrap Vue for UI
- **Core Features**: JSON validation, schema validation, shareable URLs, file I/O

## Planning Context

- **Validator Strategy**: Start with latest AJV for rapid development, design pluggable interface for eventual WASM validators
- **UI Framework**: TBD - considering Headless UI + Tailwind, Nuxt UI, PrimeVue, Radix Vue, or Quasar
- **State Management**: TBD - need to evaluate options (Nuxt's built-in `useState()`, Pinia, others); XState for validation workflow state machines
- **Architecture**: XState perfect for JSON Schema validation workflow (parse → validate → display → share)

## Implementation Strategy

### Phased Development Approach

- **Phase 1**: Frontend rebuild with exact legacy URL encoding approach
- **Phase 2**: Dedicated Cloudflare Workers API for schema sharing
- **Phase 3**: Hybrid loading (both systems) + save only to Cloudflare
- **Phase 4**: Migrate existing URL shortener data to Cloudflare storage

### Backend Service Planning

- **Current**: Client-side URL encoding + third-party URL shortener
- **Future**: Cloudflare Workers API + database (D1, KV, R2, or Durable Objects TBD)
- **Migration**: Seamless transition preserving all existing shared URLs

### Decision Process

- **Review checkpoints**: Plan and instructions reviewed between each major step
- **Iterative refinement**: Continuous improvement based on learnings
- **Documentation**: Capture patterns and decisions for future reference

## Development Notes

- **VS Code**: ESLint flat config enabled. Prettier also enabled
- **Version Management**: Use `.nvmrc` for Node version consistency
- **Build Output**: `.output/` contains Cloudflare Workers-ready build
- **Local Development**: Nuxt dev server handles both static and API routes seamlessly

## Critical Files

- `nuxt.config.ts` - Main app configuration with Cloudflare preset
- `wrangler.toml` - Cloudflare Workers deployment configuration
- `previous/src/components/` - Reference implementation for migration
- `package.json` - Defines deployment scripts and module versions
- `PLANNING.md` - Comprehensive project roadmap and decision documentation

## Open Decisions (TBD)

1. **State management** - Evaluate Nuxt's `useState()`, Pinia, others
2. **UI Framework** - Headless UI+Tailwind, Nuxt UI, PrimeVue, Radix Vue, Quasar
3. **Editor component** - CodeMirror vs Monaco vs custom
4. **Cloudflare database** - D1, KV, R2, or Durable Objects for schema sharing
5. **Theme support** - Light/dark mode implementation
6. **Compression strategy** - LZ-string compatibility vs alternatives

## Context Reminder

Always check `PLANNING.md` for current project status and detailed context before making architectural suggestions.
