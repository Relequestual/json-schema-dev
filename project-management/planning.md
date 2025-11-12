# jsonschema.dev v2 - Planning Notes

## Status Legend

| Symbol | Meaning              |
| ------ | -------------------- |
| ✅     | Implemented/Complete |
| 🔄     | In Progress          |

## Project Overview

**Goal**: Rebuild jsonschema.dev from Vue 2 + Vue CLI to Nuxt 4 + Cloudflare Workers
**Purpose**: Browser-based JSON Schema validation playground with shareable URLs

## References

- **Development Workflow**: See `development-workflow.md`
- **Current Tasks**: See `current-tasks.md`
- **Backend Services Research**: See `backend-services-research.md`
- **Multi-Schema Strategy**: See `multi-schema-strategy.md`
- **Missing Details**: See `missing-phase-details.md`

## Technical Foundation

- **Framework**: Nuxt 4 with TypeScript
- **Build System**: Cloudflare Workers
- **Package Manager**: pnpm 9.15.3+
- **Node.js**: 22.12.0 LTS (Volta compatible)
- **Build Target**: Nitro with cloudflare-module preset

## Architecture Decisions

### State Management Strategy ✅

**Selected**: Pinia + XState

**Implementation Status**:

- ✅ **Pinia Store**: `app/stores/playground.ts` - manages UI state and data
- ✅ **XState Machine**: `app/machines/validationMachine.ts` - complete validation workflow
- ✅ **Vue Composable**: `app/composables/useValidation.ts` - bridges XState to Vue reactivity
- ✅ **Type Safety**: Full TypeScript integration with proper context and event typing

**Rationale**:

- **Pinia** for global application state management (data)
- **XState** for workflow logic and state machines (behavior)
- Clear separation of concerns between data and behavioral logic
- Official Vue ecosystem integration with excellent TypeScript support

**Documentation**: See `project-management/decisions/STATE_MANAGEMENT_SELECTION.md` and `project-management/decisions/VALIDATION_MACHINE_DESIGN.md`

### Validator Architecture ✅

- ✅ **AJV 8.17.1**: Integrated in validation machine with complete error handling
- ✅ **XState Integration**: AJV wrapped in XState actors for reliable async validation
- ✅ **Type Safety**: Proper TypeScript integration with ErrorObject types
- **Pluggable Interface**: Design for future validator support
- **WASM Validators**: Future support planned

**Tradeoff**: Balance speed vs. future flexibility

### UI and UI Framework 🔄

**Selected**: Nuxt UI

**Implementation Status**:

- ✅ **Nuxt UI**: Installed and configured with Tailwind CSS
- ✅ **Basic Components**: UCard, UButton, UTextarea, UAlert implemented in PlaygroundView
- ✅ **Layout Structure**: AppHeader, AppFooter components created
- 🔄 **Monaco Editor**: Planned but not yet implemented (currently using UTextarea placeholders)

**Rationale**:

- Official Nuxt ecosystem integration (zero configuration)
- Modern Tailwind CSS v4 support for future-proofing
- Optimal bundle balance with Monaco Editor
- Excellent TypeScript support and auto-completion
- Growing community with official backing

**JSON Editor**: Monaco Editor (VS Code editor) - Pending Implementation

**Documentation**: See `project-management/decisions/UI_FRAMEWORK_SELECTION.md` for complete evaluation

## Development Phases

### Phase 1: Foundation ✅

- ✅ UI framework evaluation and selection
- ✅ State management approach research and decision
- ✅ Project structure design
- ✅ Core component identification
- ✅ State machine workflow design
- ✅ Basic frontend structure (Nuxt 4 + TypeScript + Pinia + XState)

### Phase 2: Editor Integration & Validation UI 🔄

- ✅ Monaco Editor integration - Replace textarea placeholders with Monaco
- ✅ Connect validation machine to UI reactivity - Complete Pinia store integration with reactive validation results display
- ✅ Real-time validation feedback implementation - Debounced validation with race condition prevention
- 🔄 Cloudflare Workers deployment setup - Complete production deployment configuration

### Phase 3: Backend Services

- Client-side URL encoding (legacy compatibility)
- Cloudflare database evaluation for schema sharing
- Backend Workers API development
- URL Sharing: Shareable links with compressed data (legacy functionality to restore)

### Phase 4: Hybrid System

- Hybrid loading system - support both old and new systems
- Save only to Cloudflare (new system)

### Phase 5: Data Migration

- Migrate existing URL shortener data to Cloudflare storage

### Phase 6: Advanced Features

- Multi-Schema Support using XState Actor Model
- Custom Validators with pluggable validation engine
- Advanced Editor Features (code folding, autocomplete, schema-aware suggestions)
- File Operations: Import/export JSON and schema files
- Settings Panel: Validator options and user preferences
- **Bundle Optimization Review**: Evaluate further bundling of framework chunks to reduce worker invocations beyond current optimization level

## Current Implementation Status

### Features Implemented ✅

- ✅ **JSON Schema Validation**: AJV-based validation with complete error handling
- ✅ **State Management**: Pinia + XState architecture for reliable workflow management
- ✅ **Basic UI Structure**: Nuxt UI layout with placeholder editors
- ✅ **Type Safety**: Full TypeScript integration across state machine and composables
- ✅ **Project Foundation**: Nuxt 4 + basic Cloudflare Workers build configuration

### Features In Progress 🔄

- 🔄 **JSON Editor**: Currently basic textareas, Monaco Editor integration planned
- 🔄 **Schema Editor**: Currently basic textareas, Monaco Editor integration planned
- ✅ **Results Display**: State machine provides data, UI connection needed
- ✅ **Real-time Validation**: Show live validation feedback as users type

## Legacy Reference

- **Location**: `previous/` directory
- **Key Components**: `JSONEditor.vue`, `Results.vue`, `Settings.vue`
- **Dependencies**: AJV 6.x, CodeMirror, Bootstrap Vue, LZ-string compression
- **Approach**: Selective lifting, not wholesale migration
- **Purpose**: Reference implementation for feature parity verification

## Open Questions

1. **Compression Strategy**: LZ-string compatibility vs. modern alternatives
2. **Theme Support**: Light/dark mode implementation approach
3. **Cloudflare Database**: D1 vs. KV vs. R2 vs. Durable Objects (see `backend-services-research.md`)
