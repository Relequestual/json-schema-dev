# JSON Schema Playground - AI Agent Instructions

## Project Context

This is **jsonschema.dev** - a browser-based JSON Schema validation playground. Currently undergoing migration from Vue 2 + Vue CLI (in `previous/`) to **Nuxt 4** + Cloudflare Workers architecture.

**CRITICAL**: Phase 1 foundation is **COMPLETE** as of August 9, 2025. Routing, base components, and styling are working. Ready for Phase 2 development.

## Absolute Requirements for Ways of Working

- **Always check official documentation** - Don't assume installation commands, verify from official sources
- **When uncertain, say so** - If you don't know something, say "I'm not sure" and suggest relevant docs to check
- **Never make assumptions** - It's FAR better to admit uncertainty than to present incorrect information as fact
- **Prefer documentation over assumptions** - Always suggest checking official sources rather than guessing

## User Preferences & Patterns

### Development Approach

- **Documentation-first**: Create/update architectural documentation before major implementations
- **Checkpoint-driven**: Explicit plan reviews between phases, mark tasks complete as progress
- **TypeScript-first**: Prefer strong typing and composition API patterns throughout
- **Compatibility-focused**: Preserve existing shared URLs during migration (critical user requirement)

### Development Workflow Guidelines

- **Check PLANNING.md first** - Always review current project status and next steps before writing code
- **Follow the defined phases** - Don't jump ahead to later phases without completing current tasks
- **Update planning documents** - Mark tasks complete and update status as work progresses
- **Respect review checkpoints** - Pause for plan review between major milestones

### Implementation Patterns Discovered

- **SPA routing**: Use `app/router.options.ts` for complex routing (both `/` and `/s/:data` → same component)
- **CSS imports**: May need dual import pattern: Tailwind in `nuxt.config.ts` + `@/assets/css/main.css`
- **Vue 3 syntax**: All components use `<script setup>` with Composition API, avoid Options API
- **No redirects**: Shared URLs (`/s/:data`) load directly without redirects or query parameters

### Project-Specific Context

- **This is a migration**: Users have existing shared URLs that MUST continue working
- **Legacy reference**: `previous/` contains working Vue 2 app for feature reference, but build from scratch
- **Validation focus**: Core feature is JSON Schema validation with pluggable validator architecture planned

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
- **Package Manager**: pnpm 9.15.3+ (specified in package.json) - **ALWAYS use pnpm commands, never npm/npx**
- **ESLint**: Uses flat config (`eslint.useFlatConfig: true`)

### Installation Best Practices

- **Nuxt modules**: Use `pnpm add @nuxt/<module>` then add to `nuxt.config.ts` modules array
- **Regular packages**: Use `pnpm add <package>` for dependencies
- **CLI tools**: Use `pnpm dlx <command>` for one-time executions
- **Compatibility Dates**: Always set to current date (follow Cloudflare best practice)

### Nuxt 4 Specifics

- **Structure**: Uses `app/` directory (not `pages/` or `src/`)
- **Modules**: @nuxt/eslint, @nuxt/fonts, @nuxt/icon, @nuxt/image, @nuxt/scripts
- **Build Target**: `nitro.preset: 'cloudflare-module'` with Node.js compatibility
- **TypeScript**: Built-in, no separate configuration needed
- **Routing**: SPA-style routing via `app/router.options.ts` (both `/` and `/s/:data` → same component)

### Cloudflare Workers Setup

- **Runtime**: Modern Workers (not legacy Pages)
- **Config**: `wrangler.toml` + auto-generated `.output/server/wrangler.json`
- **Assets**: Static files served via ASSETS binding
- **Compatibility**: Node.js compatibility enabled (`nodeCompat: true`)

## Planning Context

- **Validator Strategy**: Start with latest AJV for rapid development, design pluggable interface for eventual WASM validators
- **UI Framework**: ✅ **Nuxt UI** - Official Nuxt component library with Tailwind CSS v4, Monaco Editor for JSON editing
- **State Management**: ✅ **Pinia + XState selected** - Pinia for data, XState for workflow logic
- **Architecture**: XState perfect for JSON Schema validation workflow (parse → validate → display → share)
- **Project Structure**: See `decisions/PROJECT_STRUCTURE.md` for full implementation

## Implementation Strategy

### Phased Development Approach

- **Phase 1**: ✅ Frontend foundation with routing, components, styling
- **Phase 2**: Monaco editors + AJV validation system
- **Phase 3**: Cloudflare Workers API for schema sharing
- **Phase 4**: Hybrid loading (both systems) + save only to Cloudflare
- **Phase 5**: Migrate existing URL shortener data to Cloudflare storage

### Backend Service Planning

- **Current**: Client-side URL encoding + third-party URL shortener
- **Future**: Cloudflare Workers API + database (D1, KV, R2, or Durable Objects TBD)
- **Migration**: Seamless transition preserving all existing shared URLs

### Decision Process

- **Review checkpoints**: Plan and instructions reviewed between each major step
- **Iterative refinement**: Continuous improvement based on learnings
- **Documentation**: Capture patterns and decisions for future reference

## Open Decisions (TBD)

1. **Cloudflare database** - D1, KV, R2, or Durable Objects for schema sharing
2. **Theme support** - Light/dark mode implementation
3. **Compression strategy** - LZ-string compatibility vs alternatives

## Context Reminder

Always check `PLANNING.md` for current project status and detailed context before making architectural suggestions.
