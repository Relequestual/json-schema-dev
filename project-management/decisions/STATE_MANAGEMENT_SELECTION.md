# State Management Selection - Decision Document

**Decision**: State Management for jsonschema.dev v2 (Nuxt 4 + Cloudflare Workers)
**Date**: August 5, 2025
**Status**: ✅ **DECIDED**

## Final Decision

**✅ DECIDED: Pinia + XState** (August 5, 2025)

**Rationale**:

- **Pinia** for global application state management (data)
- **XState** for workflow logic and state machines (behavior)
- These solutions serve different purposes and complement each other perfectly

## Decision Context

Building a JSON Schema validation playground with:

- **Framework**: Nuxt 4 + TypeScript + Nuxt UI
- **Deployment**: Cloudflare Workers
- **Core Features**: JSON/Schema editors, validation workflow, file operations, settings, URL sharing
- **Complexity**: Moderate state complexity with validation workflow logic

## State Management Needs Analysis

### Application State Categories

1. **Editor State**
   - JSON instance content
   - JSON Schema content
   - Editor preferences (theme, font size, etc.)
   - Syntax highlighting and error markers

2. **Validation State**
   - Validation results and errors
   - Validation status (idle, validating, complete, error)
   - Validator configuration options
   - Performance metrics

3. **UI State**
   - Active editor panel
   - Settings panel visibility
   - Theme mode (light/dark)
   - Layout preferences

4. **Sharing State**
   - URL generation status
   - Share modal visibility
   - Generated share links
   - Share history (optional)

5. **File Operations State**
   - Import/export status
   - File upload progress
   - Recent files (optional)

### Workflow Complexity

**JSON Schema Validation Workflow**:

```
idle → loading_data → parsing → validating → displaying_results → sharing
  ↑                                ↓
  ←----- error_handling ←----------┘
```

## State Management vs Workflow Logic

**Important Distinction**:

- **State Management** = Global application data (Pinia, Zustand, Valtio)
- **Workflow Logic** = State machines and complex behavioral logic (XState)

XState is not a replacement for global state management - it's a complementary tool for managing complex workflows and preventing impossible states in application logic.

## Global State Management Options Research

### 1. Nuxt's Built-in `useState()`

**Research Status**: ✅ Complete

**Overview**: Nuxt 4's built-in composable for reactive state management with SSR support.

**Key Features**:

- **SSR Compatible**: Automatically serialized between server and client
- **Reactive**: Vue 3 reactivity system integration
- **Simple API**: `useState(key, () => defaultValue)`
- **Global State**: Shared across components automatically
- **TypeScript**: Full type safety support

**Example Usage**:

```typescript
// composables/useEditorState.ts
export const useEditorState = () => {
  const jsonContent = useState('json-content', () => '');
  const schemaContent = useState('schema-content', () => '');
  const validationResults = useState('validation-results', () => null);

  return {
    jsonContent,
    schemaContent,
    validationResults,
  };
};
```

**Pros**:

- Zero configuration - built into Nuxt
- Perfect SSR integration
- Excellent TypeScript support
- Minimal bundle size impact
- Simple mental model
- Auto-persisted during navigation

**Cons**:

- Limited to simple reactive state
- No built-in actions or mutations pattern
- No time-travel debugging
- Limited state organization for complex apps
- No built-in state persistence

### 2. Pinia

**Research Status**: ✅ Complete

**Overview**: Vue's official state management library, successor to Vuex with excellent TypeScript support.

**Key Features**:

- **TypeScript First**: Built with TypeScript, excellent type inference
- **Modular**: Store composition and organization
- **DevTools**: Vue DevTools integration with time-travel
- **SSR Support**: Works seamlessly with Nuxt
- **Actions**: Async action support with automatic loading states
- **Plugins**: Extensible plugin system

**Example Usage**:

```typescript
// stores/editor.ts
export const useEditorStore = defineStore('editor', () => {
  const jsonContent = ref('');
  const schemaContent = ref('');
  const validationResults = ref(null);
  const isValidating = ref(false);

  const validateSchema = async () => {
    isValidating.value = true;
    try {
      // validation logic
      validationResults.value = await validate(
        jsonContent.value,
        schemaContent.value
      );
    } catch (error) {
      // error handling
    } finally {
      isValidating.value = false;
    }
  };

  return {
    jsonContent,
    schemaContent,
    validationResults,
    isValidating,
    validateSchema,
  };
});
```

**Pros**:

- Official Vue recommendation
- Excellent TypeScript support and type inference
- Modular store organization
- Built-in async action handling
- Vue DevTools integration
- Plugin ecosystem (persistence, etc.)
- Good documentation and community

**Cons**:

- Additional dependency and bundle size
- Learning curve for store patterns
- May be overkill for simple state needs
- Requires more boilerplate than useState

### 3. XState (Workflow Logic - Separate Category)

**Research Status**: ✅ Complete

**Overview**: State machines and statecharts library for managing complex workflow logic.

**Key Features**:

- **State Machines**: Finite state machines with explicit state transitions
- **Statecharts**: Hierarchical and parallel states
- **TypeScript**: Excellent TypeScript support with type-safe states
- **Visualization**: Visual state machine editor and debugging
- **Testing**: Predictable state transitions make testing easier
- **Framework Agnostic**: Works with any framework

**Use Case**: JSON Schema validation workflow, file operations, share workflows

**Note**: XState complements global state management rather than replacing it.

### 4. Zustand

**Research Status**: ✅ Complete

**Overview**: Small, fast, and scalable state management solution with minimal boilerplate.

**Key Features**:

- **Minimal**: Small bundle size (2.9kb gzipped)
- **Simple API**: No providers, reducers, or boilerplate
- **TypeScript**: Excellent TypeScript support
- **React/Vue Agnostic**: Works with Vue 3 composition API
- **Middleware**: Plugin system for persistence, devtools, etc.

**Example Usage**:

```typescript
// stores/editorStore.ts
import { create } from 'zustand';

interface EditorState {
  jsonContent: string;
  schemaContent: string;
  validationResults: any;
  isValidating: boolean;
  setJsonContent: (content: string) => void;
  setSchemaContent: (content: string) => void;
  validateSchema: () => Promise<void>;
}

export const useEditorStore = create<EditorState>((set, get) => ({
  jsonContent: '',
  schemaContent: '',
  validationResults: null,
  isValidating: false,

  setJsonContent: (content) => set({ jsonContent: content }),
  setSchemaContent: (content) => set({ schemaContent: content }),

  validateSchema: async () => {
    set({ isValidating: true });
    try {
      const { jsonContent, schemaContent } = get();
      const results = await validate(jsonContent, schemaContent);
      set({ validationResults: results, isValidating: false });
    } catch (error) {
      set({ isValidating: false });
    }
  },
}));
```

**Pros**:

- Very small bundle size
- Simple, intuitive API
- Excellent TypeScript support
- No providers or boilerplate
- Good performance
- Middleware support

**Cons**:

- Less Vue-native (originally React-focused)
- Smaller ecosystem compared to Pinia
- No official Vue DevTools integration
- Less documentation for Vue usage
- May not fit Nuxt SSR patterns as well

### 5. Valtio

**Research Status**: ✅ Complete

**Overview**: Proxy-based state management that makes state mutations directly reactive.

**Key Features**:

- **Proxy-based**: Direct state mutations become reactive
- **Minimal**: Small bundle size and simple API
- **TypeScript**: Good TypeScript support
- **Immutable**: Immutable updates under the hood
- **Vue Support**: Works with Vue 3 composition API

**Example Usage**:

```typescript
// stores/editorState.ts
import { proxy } from 'valtio';

export const editorState = proxy({
  jsonContent: '',
  schemaContent: '',
  validationResults: null,
  isValidating: false,
});

// Direct mutations
export const setJsonContent = (content: string) => {
  editorState.jsonContent = content;
};

export const validateSchema = async () => {
  editorState.isValidating = true;
  try {
    editorState.validationResults = await validate(
      editorState.jsonContent,
      editorState.schemaContent
    );
  } finally {
    editorState.isValidating = false;
  }
};
```

**Pros**:

- Very intuitive API (direct mutations)
- Small bundle size
- Good TypeScript support
- Minimal boilerplate
- Immutable updates automatically

**Cons**:

- Less mature ecosystem
- Proxy-based approach may have edge cases
- Less Vue-specific optimizations
- Limited debugging tools
- May not integrate as well with Nuxt SSR

## Comparison Matrix (Global State Management Only)

| Solution   | Bundle Size | Learning Curve | TypeScript   | SSR Support  | DevTools   | Vue Integration | Nuxt Integration |
| ---------- | ----------- | -------------- | ------------ | ------------ | ---------- | --------------- | ---------------- |
| useState() | ✅ None     | ✅ Minimal     | ✅ Excellent | ✅ Native    | 🟡 Basic   | ✅ Native       | ✅ Built-in      |
| Pinia      | 🟢 Small    | 🟢 Moderate    | ✅ Excellent | ✅ Excellent | ✅ Full    | ✅ Official     | ✅ Official      |
| Zustand    | ✅ Tiny     | 🟢 Easy        | ✅ Excellent | 🟡 Manual    | 🟡 Limited | 🟡 Unofficial   | 🟡 Manual        |
| Valtio     | ✅ Tiny     | 🟢 Easy        | 🟢 Good      | 🟡 Manual    | 🟡 Limited | 🟡 Unofficial   | 🟡 Manual        |

**Rating Scale**: ✅ Excellent | 🟢 Good | 🟡 Fair | 🔴 Poor

**Note**: XState excluded from comparison as it serves a different purpose (workflow logic vs global state)

## JSON Schema Playground Specific Analysis

### State Complexity Assessment

**Simple State** (good for useState):

- Editor content
- UI preferences
- Theme settings

**Complex State** (needs organized approach):

- Validation workflow
- File operations
- Share state management

**Workflow Logic** (perfect for XState):

- JSON Schema validation process
- Error handling workflows
- File import/export processes

### Recommended Architecture

Based on the analysis, the optimal approach is:

1. **Pinia** for global application state management
2. **XState** for workflow logic and state machines

These serve different purposes and complement each other perfectly.

## Implementation Plan

### ✅ **Chosen Architecture: Pinia + XState**

**Pinia for Global State**:

- Editor content (JSON, Schema)
- Validation results and status
- Application settings and preferences
- File operations state
- Share functionality state
- UI state (theme, layout preferences)

**XState for Workflow Logic**:

- JSON Schema validation state machine
- File import/export workflows
- Share workflow logic
- Error handling flows

**Implementation Details**:

```bash
# Install Pinia
npx nuxi@latest module add pinia

# Install XState
npm install xstate @xstate/vue
```

**Pinia Store Example**:

```typescript
// stores/editor.ts
export const useEditorStore = defineStore('editor', () => {
  const jsonContent = ref('');
  const schemaContent = ref('');
  const validationResults = ref(null);
  const isValidating = ref(false);

  return {
    jsonContent,
    schemaContent,
    validationResults,
    isValidating,
  };
});
```

**XState Machine Example**:

```typescript
// machines/validation.ts
export const validationMachine = createMachine({
  id: 'validation',
  initial: 'idle',
  states: {
    idle: { on: { VALIDATE: 'validating' } },
    validating: {
      invoke: {
        src: 'validateSchema',
        onDone: { target: 'success', actions: 'setResults' },
        onError: { target: 'failure', actions: 'setError' },
      },
    },
    success: { on: { VALIDATE: 'validating', RESET: 'idle' } },
    failure: { on: { VALIDATE: 'validating', RESET: 'idle' } },
  },
});
```

**Benefits of This Approach**:

- **Clear separation of concerns**: Data vs behavior
- **Official ecosystem**: Pinia is Vue's official state management
- **State machine benefits**: XState prevents impossible states and provides clear workflow logic
- **Excellent tooling**: Both have great DevTools support
- **TypeScript support**: Both libraries have excellent TypeScript integration

## Final Recommendation

### 🎯 **DECIDED: Pinia + XState**

**Rationale**:

1. **Pinia for global application state** - Official Vue ecosystem, excellent TypeScript, perfect Nuxt integration
2. **XState for workflow logic** - State machines for validation, file operations, and share workflows
3. **Clear separation of concerns** - Data management vs behavioral logic
4. **Best of both worlds** - Robust state management + powerful workflow control

**Why this approach**:

- **Proper tool separation** - Each tool serves its intended purpose
- **Official ecosystem** - Pinia is Vue's official state management solution
- **State machine benefits** - XState prevents impossible states and provides visual workflow debugging
- **Excellent TypeScript** - Both libraries have first-class TypeScript support
- **Perfect Nuxt 4 integration** - Pinia has official @pinia/nuxt module

**Setup Process**:

1. Install Pinia: `pnpm dlx nuxi@latest module add pinia`
2. Install XState: `pnpm add xstate @xstate/vue`
3. Create Pinia stores in `stores/` directory (auto-imported)
4. Create XState machines in `machines/` directory
5. Use Pinia for data, XState for workflows

## Next Steps

- [x] Complete research for state management options
- [x] Clarify distinction between state management vs workflow logic
- [x] Make final decision: Pinia + XState
- [x] Install and configure Pinia and XState
- [x] Update PLANNING.md and copilot instructions
