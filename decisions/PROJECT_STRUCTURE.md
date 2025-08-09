# Project Structure Design

**Date**: August 5, 2025
**Status**: Proposed
**Context**: Nuxt 4 app structure for JSON Schema playground with future extensibility

## Nuxt 4 Directory Structure

```
app/
├── app.vue                     # Main app wrapper (UApp + NuxtPage)
├── assets/
│   └── css/
│       └── main.css            # Tailwind + Nuxt UI imports
├── components/
│   ├── layout/
│   │   ├── AppHeader.vue       # Main navigation header
│   │   ├── AppFooter.vue       # Footer with links/credits
│   │   └── AppSidebar.vue      # Future: collapsible sidebar nav
│   ├── editor/
│   │   ├── JsonEditor.vue      # Monaco-based JSON editor
│   │   ├── SchemaEditor.vue    # Monaco-based schema editor
│   │   └── EditorToolbar.vue   # Format/lint/theme controls
│   ├── validation/
│   │   ├── ValidationResults.vue  # Results display panel
│   │   ├── ValidationStatus.vue   # Status indicators/alerts
│   │   └── ErrorMessage.vue    # Error display component
│   ├── sharing/
│   │   ├── ShareButton.vue     # URL sharing functionality
│   │   └── LoadFromUrl.vue     # URL loading handler
│   ├── settings/
│   │   ├── SettingsPanel.vue   # Settings overlay/modal
│   │   └── ThemeSelector.vue   # Editor theme selection
│   └── ui/
│       ├── LoadingSpinner.vue  # Loading states
│       └── FeaturesList.vue    # Features information
├── pages/
│   ├── index.vue               # Main playground component (handles both / and /s routes via config)
│   └── [...future tools]      # Future: individual tool pages
├── stores/
│   ├── playground.ts           # Main playground state (Pinia)
│   ├── editor.ts               # Editor settings/preferences (Pinia)
│   ├── validation.ts           # Validation results/status (Pinia)
│   └── sharing.ts              # URL sharing state (Pinia)
├── machines/
│   ├── validation.ts           # Validation workflow (XState)
│   ├── sharing.ts              # Share/load workflow (XState)
│   └── editor.ts               # Editor interaction flow (XState)
├── composables/
│   ├── useValidation.ts        # Validation logic composable
│   ├── useSharing.ts           # URL encoding/decoding
│   ├── useLocalStorage.ts      # Local storage persistence
│   └── useFileOperations.ts    # Import/export functionality
├── utils/
│   ├── validation/
│   │   ├── ajv.ts              # AJV validator setup
│   │   └── validators.ts       # Future: pluggable validators
│   ├── compression/
│   │   ├── lz-string.ts        # LZ-string compatibility
│   │   └── encoding.ts         # URL encoding utilities
│   └── constants.ts            # App constants/defaults
├── types/
│   ├── validation.ts           # Validation types
│   ├── editor.ts               # Editor configuration types
│   └── sharing.ts              # Sharing/URL types
└── server/
    └── api/
        └── [...].ts            # Future: Cloudflare Workers API routes
```

## Architecture Principles

### 1. **Component Organization**

- **Feature-based grouping**: Components grouped by functionality (editor, validation, sharing)
- **Layout separation**: Header/footer/sidebar isolated for reuse across future pages
- **Atomic design**: Small, focused components that compose into larger features

### 2. **State Management Separation**

- **Pinia stores**: Domain-specific data stores (playground, editor, validation, sharing)
- **XState machines**: Workflow logic and state transitions
- **Clear boundaries**: Data vs. behavior separation maintained consistently

### 3. **Future Extensibility**

- **Page structure**: Ready for additional tools via new pages
- **Shared components**: Reusable editor/validation components
- **Modular utilities**: Pluggable validation and compression systems
- **Direct routing**: Each route handled by its own page component (no catch-all routing)

### 4. **Cloudflare Workers Integration**

- **Server directory**: API routes for future Workers endpoints
- **Composables**: Abstracted sharing logic for easy backend swapping
- **Type safety**: Shared types between client and server

## Key Design Decisions

### Component Strategy

- **Monaco Editor integration**: Separate JsonEditor/SchemaEditor components
- **Nuxt UI components**: Leverage UCard, UButton, UModal, etc.
- **Composition API**: All components use `<script setup>` pattern
- **TypeScript first**: Full type safety throughout

### State Management Pattern

```typescript
// Example: playground.ts (Pinia store)
export const usePlaygroundStore = defineStore('playground', () => {
  const schema = ref('');
  const instance = ref('');
  const isLoading = ref(false);

  return { schema, instance, isLoading };
});

// Example: validation.ts (XState machine)
export const validationMachine = createMachine({
  id: 'validation',
  initial: 'idle',
  states: {
    idle: { on: { VALIDATE: 'validating' } },
    validating: { on: { SUCCESS: 'valid', ERROR: 'invalid' } },
    valid: { on: { VALIDATE: 'validating' } },
    invalid: { on: { VALIDATE: 'validating' } },
  },
});
```

### Route Planning

- **Main playground**: `/` - Core validation interface for new sessions
- **Shared URLs**: `/s/[data]` - Same playground component, loads data from URL path (NO redirects, NO query parameters)
- **Future tools**: `/[tool-name]` - e.g., `/linter`, `/generator`, `/tester`

**IMPORTANT**: We do NOT use query parameters (`?shared=`) or catch-all routing. Each route is handled by its own page component that renders the same playground interface.

## Architectural Constraints (Hard Decisions)

### Routing Strategy
- **NO catch-all pages**: Route configuration handles multiple paths to same component
- **NO query parameters**: Shared URLs use path parameters only (`/s/{data}`)
- **NO redirects**: URLs remain intact for SEO and user experience
- **SINGLE component**: Both `/` and `/s/[data]` routes use the SAME component via Nuxt route rules
- **Config-based routing**: `nuxt.config.ts` handles route aliasing (NO separate page files needed)
- **Route-aware logic**: Component detects route and handles data loading accordingly

### URL Handling
- **Main playground**: `/` renders playground component with empty state
- **Shared URLs**: `/s/{data}` renders same playground component with decoded data from path
- **Route configuration**: Nuxt config maps `/s/**` patterns to index component
- **No file duplication**: Only `pages/index.vue` exists, config handles routing

## Implementation Priority

1. **Core structure**: Set up directories and base files
2. **Main page**: Implement index.vue with basic layout
3. **Editor components**: Monaco-based JsonEditor and SchemaEditor
4. **Validation flow**: XState workflow managing AJV validation states
5. **Sharing system**: URL encoding/decoding with legacy compatibility
6. **Settings/preferences**: Theme selection and editor options

## Benefits

- **Maintainable**: Clear separation of concerns and consistent patterns
- **Scalable**: Easy to add new tools/pages without architectural changes
- **Type-safe**: Full TypeScript integration with excellent DX
- **Future-ready**: Designed for Cloudflare Workers backend integration
- **Performance**: Leverages Nuxt 4 optimizations and selective imports
