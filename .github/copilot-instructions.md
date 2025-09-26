# JSON Schema Playground - AI Agent Instructions

## 📋 Project Context

**Project**: jsonschema.dev - Browser-based JSON Schema validation playground
**Status**: Migration from Vue 2 + Vue CLI (`previous/`) → Nuxt 4 + Cloudflare Workers
**Current Phase**: Phase 1 COMPLETE (Aug 9, 2025) → Phase 2 in progress
**Phase 1 Achievements**: Routing, base components, styling, state management
**Phase 2 Focus**: Monaco editor integration, validation UI connection

## 🚨 CRITICAL: Always Check PLANNING.md First

**PLANNING.md is the source of truth for all project work. Check it when:**

- **Starting work on a new feature or component**
- **Moving between project phases**
- **Implementing architecture-level changes**
- **Questions arise about project status or priorities**
- **Making decisions that impact multiple components**

PLANNING.md contains detailed implementation status tracking, technical specifications, and phase-specific requirements. Not every minor change requires consulting it.

## ⚠️ Absolute Requirements for Ways of Working

- **Always check official documentation** - Don't assume installation commands, verify from official sources
- **When uncertain, say so** - If you don't know something, say "I'm not sure" and suggest relevant docs to check
- **Never make assumptions** - It's FAR better to admit uncertainty than to present incorrect information as fact
- **Prefer documentation over assumptions** - Always suggest checking official sources rather than guessing
- **Preserve critical planning information** - When updating documentation, NEVER remove existing sections without explicit confirmation. Instead, enhance sections with status updates, add new sections, or ask before removing anything that tracks features, requirements, or user-facing functionality

## 👤 User Preferences & Patterns

### Development Workflow Guidelines

- **Documentation-first**: Create/update architectural documentation before major implementations
- **Checkpoint-driven**: Explicit plan reviews between phases, mark tasks complete as progress
- **TypeScript-first**: Prefer strong typing and composition API patterns throughout
- **Compatibility-focused**: Preserve existing shared URLs during migration (critical user requirement)

### Documentation Preservation Principle

- **ENHANCE existing feature tracking with minimal implementation details**
- **ASK before removing any section that tracks user features, requirements, or legacy app parity**
- **Remember: "Core Features" tracks what users expect, "Implementation Status" tracks what code exists**

### Implementation Patterns Discovered

- **SPA routing**: Use `app/router.options.ts` for complex routing (both `/` and `/s/:data` → same component)
- **CSS imports**: May need dual import pattern: Tailwind in `nuxt.config.ts` + `@/assets/css/main.css`
- **Vue 3 syntax**: All components use `<script setup>` with Composition API, avoid Options API
- **No redirects**: Shared URLs (`/s/:data`) load directly without redirects or query parameters

### Project-Specific Context

- **This is a migration**: Users have existing shared URLs that MUST continue working
- **Legacy reference**: `previous/` contains working Vue 2 app for feature reference, but build from scratch
- **Validation focus**: Core feature is JSON Schema validation with pluggable validator architecture planned

## 🏗️ Architecture Overview

- **Current**: Nuxt 4 app with Cloudflare Workers deployment preset
- **Legacy**: Vue 2 + Bootstrap Vue + Vue CLI app (preserved in `previous/`)
- **Core Purpose**: Client-side JSON Schema validation with pluggable validator support (WASM, etc.)
- **Deployment**: Cloudflare Workers (modern approach, not Pages)

## 🧩 Key Project Patterns

## Utility Libraries

- **@vueuse/core** is installed and available. It provides many useful Vue/Nuxt composable utilities (e.g., `useDebounceFn`, `useThrottleFn`, etc.).
- **Treeshaking is supported**: Only imported utilities are included in the bundle, so prefer direct imports for optimal bundle size.
- **Guideline**: When writing or refactoring Vue/Nuxt code, always check if a VueUse composable can simplify or reduce code. Prefer VueUse utilities over custom implementations for common patterns (debounce, throttle, clipboard, etc.).

### Technical Stack Configuration

| Component           | Specification                   | Command/Config                       |
| ------------------- | ------------------------------- | ------------------------------------ |
| **Node.js**         | 22.12.0 LTS (`.nvmrc`)          | Volta compatible                     |
| **Package Manager** | pnpm 9.15.3+                    | **ALWAYS use `pnpm`, never npm/npx** |
| **ESLint**          | Flat config                     | `eslint.useFlatConfig: true`         |
| **Structure**       | Nuxt 4 `app/` directory         | Not `pages/` or `src/`               |
| **Build Target**    | Cloudflare Workers              | `nitro.preset: 'cloudflare-module'`  |
| **Runtime**         | Modern Workers                  | Not legacy Pages                     |
| **Routing**         | SPA via `app/router.options.ts` | `/` and `/s/:data` → same component  |

### Installation Commands Reference

| Task             | Command                   | Notes                                 |
| ---------------- | ------------------------- | ------------------------------------- |
| **Nuxt modules** | `pnpm add @nuxt/<module>` | Add to `nuxt.config.ts` modules array |
| **Dependencies** | `pnpm add <package>`      | Regular packages                      |
| **CLI tools**    | `pnpm dlx <command>`      | One-time executions                   |
| **Dev server**   | `pnpm dev`                | Full-stack: static + API routes       |
| **Build**        | `pnpm build`              | For Cloudflare Workers                |
| **Deploy**       | `pnpm deploy`             | Build + deploy to Cloudflare          |

## 📝 Planning Context

- **Validator Strategy**: Start with latest AJV for rapid development, design pluggable interface for eventual WASM validators
- **UI Framework**: ✅ **Nuxt UI** - Official Nuxt component library with Tailwind CSS v4, Monaco Editor for JSON editing
- **State Management**: ✅ **Pinia + XState selected** - Pinia for data, XState for workflow logic
- **Architecture**: XState perfect for JSON Schema validation workflow (parse → validate → display → share)
- **Project Structure**: See `project-management/decisions/PROJECT_STRUCTURE.md` for full implementation

## 🔄 Implementation Strategy

**Phased Development Approach**: This project follows a carefully structured phased development approach. See PLANNING.md for detailed implementation status tracking and specific tasks within each phase.

**Backend Service Planning**: The project is migrating from client-side URL encoding to a Cloudflare Workers API solution. See PLANNING.md for detailed backend architecture decisions.

**Decision Process**:

- **Review checkpoints**: Plan and instructions reviewed between each major step
- **Iterative refinement**: Continuous improvement based on learnings
- **Documentation**: Capture patterns and decisions for future reference

## ❓ Open Decisions (TBD)

1. **Cloudflare database** - D1, KV, R2, or Durable Objects for schema sharing
2. **Theme support** - Light/dark mode implementation
3. **Compression strategy** - LZ-string compatibility vs alternatives

## Context Reminder

Check `PLANNING.md` for current project status and detailed context when making architectural suggestions or beginning significant new work. For routine code changes or isolated fixes, referencing this instruction document may be sufficient.
