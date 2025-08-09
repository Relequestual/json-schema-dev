# jsonschema.dev v2 - Planning Notes

## Project Overview

**Goal**: Rebuild jsonschema.dev from Vue 2 + Vue CLI to Nuxt 4 + Cloudflare Workers
**Purpose**: Browser-based JSON Schema validation playground with shareable URLs

## Technical Foundation ✅

- **Framework**: Nuxt 4 with TypeScript
- **Deployment**: Cloudflare Workers (modern approach)
- **Package Manager**: pnpm 9.15.3+
- **Node.js**: 22.12.0 LTS (Volta compatible)
- **Build System**: Nitro with cloudflare-module preset

## Architecture Decisions

### State Management Strategy ✅

**Selected**: **Pinia + XState** (August 5, 2025)

**Rationale**:

- **Pinia** for global application state management (data)
- **XState** for workflow logic and state machines (behavior)
- Clear separation of concerns between data and behavioral logic
- Official Vue ecosystem integration with excellent TypeScript support

**Documentation**: See `decisions/STATE_MANAGEMENT_SELECTION.md` for complete evaluation

### Validator Architecture

- **Phase 1**: Latest AJV for rapid development
- **Phase 2**: Design pluggable validator interface
- **Future**: WASM validators support
- **Tradeoff**: Balance speed vs. future flexibility

### Backend Services Strategy

- **Phase 1**: Client-side URL encoding (existing approach for MVP)
- **Phase 2**: Dedicated schema sharing service on Cloudflare Workers
- **Storage**: TBD - evaluate Cloudflare database options (D1, KV, R2, Durable Objects)
- **Benefits**: Better UX, analytics, permalink stability, shorter URLs

### UI Framework ✅

**Selected**: **Nuxt UI** (August 5, 2025)

**Rationale**:

- Official Nuxt ecosystem integration (zero configuration)
- Modern Tailwind CSS v4 support for future-proofing
- Optimal bundle balance with Monaco Editor
- Excellent TypeScript support and auto-completion
- Growing community with official backing

**JSON Editor**: Monaco Editor (VS Code editor with excellent TypeScript support)

**Documentation**: See `decisions/UI_FRAMEWORK_SELECTION.md` for complete evaluation

## Core Features (from legacy app)

- **JSON Editor**: Syntax highlighting, validation feedback
- **Schema Editor**: JSON Schema editing with validation
- **Results Display**: Clear validation results and error messages
- **URL Sharing**: Shareable links with compressed data
- **File Operations**: Import/export JSON and schema files
- **Settings**: Validator options and preferences

## Development Workflow

```bash
pnpm dev          # Full-stack development server
pnpm build        # Cloudflare Workers build
pnpm deploy       # Deploy to production
pnpm deploy:preview # Local Wrangler preview
```

## Legacy Reference

- **Location**: `previous/` directory
- **Key Components**: `JSONEditor.vue`, `Results.vue`, `Settings.vue`
- **Dependencies**: AJV 6.x, CodeMirror, Bootstrap Vue, LZ-string compression
- **Approach**: Selective lifting, not wholesale migration

## Questions to Resolve

1. **State management** - What's the best approach for application data in Nuxt 4?
2. **UI Framework selection** - Which provides best balance of features vs. complexity?
3. **Editor component** - CodeMirror vs. Monaco vs. custom solution?
4. **Compression strategy** - LZ-string compatibility vs. modern alternatives?
5. **Theme support** - Light/dark mode implementation approach?
6. **Validator interface** - How to design for future pluggability?
7. **Cloudflare database** - D1 (SQL), KV (key-value), R2 (object storage), or Durable Objects?

## Backend Service: Schema Sharing

### Current Approach (Legacy)

1. Client encodes schema + instance data into URL-safe string
2. URL is added to browser URL (long URLs)
3. Third-party URL shortener service stores/retrieves full URLs
4. Client decodes data from retrieved URL

### Proposed Cloudflare Workers Approach

1. Client sends schema + instance data to Workers API
2. Workers service stores data in Cloudflare database
3. Returns short ID for sharing
4. Retrieval via Workers API using short ID
5. Better analytics, permalink stability, custom domain

### Cloudflare Database Options to Evaluate

- **D1 (SQLite)**: Relational database, good for structured data with relationships
- **KV (Key-Value)**: Simple key-value store, excellent performance, global replication
- **R2 (Object Storage)**: For larger payloads, S3-compatible API
- **Durable Objects**: Stateful objects with strong consistency, more complex but powerful

### Implementation Priority

- **Phase 1**: Complete frontend rebuild with client-side URL encoding (exact legacy approach)
- **Phase 2**: Build dedicated Workers API for schema sharing
- **Phase 3**: Hybrid approach - support loading from both systems, save only to Cloudflare
- **Phase 4**: Migrate existing URL shortener data to Cloudflare storage
- **Benefits**: Shorter URLs, better UX, usage analytics, permalink reliability, seamless transition

## Next Steps

- [x] UI framework evaluation and selection ✅ **Nuxt UI selected**
- [x] State management approach research and decision ✅ **Pinia + XState selected**
- [x] **Review plan and copilot instructions**
- [x] Project structure design ✅ **Complete** - See `decisions/PROJECT_STRUCTURE.md`
- [x] **Review plan and copilot instructions**
- [ ] Core component identification 📍 **CURRENT CHECKPOINT**
- [ ] **Review plan and copilot instructions**
- [ ] State machine workflow design
- [ ] **Review plan and copilot instructions**
- [ ] Frontend development (Phase 1) - exact legacy URL encoding
- [ ] **Review plan and copilot instructions**
- [ ] Cloudflare database evaluation for schema sharing
- [ ] **Review plan and copilot instructions**
- [ ] Backend Workers API development (Phase 2)
- [ ] **Review plan and copilot instructions**
- [ ] Hybrid loading system (Phase 3) - support both old and new
- [ ] **Review plan and copilot instructions**
- [ ] Data migration strategy (Phase 4) - move URL shortener data
- [ ] **Review plan and copilot instructions**
- [ ] Development timeline planning
