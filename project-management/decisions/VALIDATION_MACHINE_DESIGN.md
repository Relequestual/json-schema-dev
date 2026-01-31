# XState Validation Machine Design

This document describes the XState-based validation machine implementation for the JSON Schema Playground, designed based on the logic from the previous Vue 2 implementation.

## Overview

The validation machine manages the complete JSON Schema validation workflow:

1. **JSON Parsing** - Parse schema and instance text into JSON objects
2. **Schema Validation** - Validate that the schema is a valid JSON Schema
3. **Instance Validation** - Validate the instance against the schema
4. **Results Display** - Provide validation results and error messages

## State Machine States

### Core States

- **`idle`** - Waiting for input or validation trigger
- **`parsingSchema`** - Parsing schema JSON text
- **`parsingInstance`** - Parsing instance JSON text
- **`parsingBoth`** - Parallel parsing of both schema and instance
- **`checkingBothParsed`** - Check if both JSON objects are ready
- **`validatingSchema`** - Validating schema with AJV's validateSchema
- **`validatingInstance`** - Validating instance against schema
- **`validationComplete`** - Validation finished (success or with errors)

### Error States

- **`schemaParseError`** - Schema text is invalid JSON
- **`instanceParseError`** - Instance text is invalid JSON
- **`jsonParseErrors`** - One or both texts have parse errors
- **`schemaValidationError`** - Schema is not a valid JSON Schema
- **`validationError`** - Unexpected validation error

## Events

The machine responds to these events:

- **`UPDATE_SCHEMA`** - Update schema text and trigger parsing
- **`UPDATE_INSTANCE`** - Update instance text and trigger parsing
- **`VALIDATE`** - Manually trigger validation of current content
- **`CLEAR_ERRORS`** - Clear current errors and return to idle
- **`RESET`** - Reset all state to initial values

## Context Data

The machine context contains:

```typescript
interface ValidationContext {
  // Input text
  schemaText: string;
  instanceText: string;

  // Parsed JSON objects
  parsedSchema: any | null;
  parsedInstance: any | null;

  // Error states
  schemaParseError: string | null;
  instanceParseError: string | null;
  schemaValidationErrors: ErrorObject[] | null;
  instanceValidationErrors: ErrorObject[] | null;

  // Results
  isValid: boolean | null;
  debounceMs: number;
}
```

## Services (Async Operations)

The machine uses three services for async operations:

### `parseJSON`

- **Input**: JSON text string
- **Output**: Parsed JavaScript object
- **Error**: Parse error message
- **Logic**: Simple `JSON.parse()` with error handling

### `validateSchema`

- **Input**: Parsed schema object
- **Output**: `ErrorObject[]` if invalid, `null` if valid
- **Error**: Validation failure
- **Logic**: Uses AJV's `validateSchema()` method

### `validateInstance`

- **Input**: `{ schema, instance }` object pair
- **Output**: `{ isValid: boolean, errors: ErrorObject[] | null }`
- **Error**: Compilation or validation failure
- **Logic**: AJV compile + validate pattern

## Workflow Logic

### Happy Path Flow

1. User types in schema → `UPDATE_SCHEMA` → `parsingSchema`
2. Schema parses successfully → `validatingSchema`
3. Schema is valid JSON Schema → `validatingInstance` (if instance ready)
4. User types in instance → `UPDATE_INSTANCE` → `parsingInstance`
5. Instance parses successfully → `checkingBothParsed`
6. Both parsed → `validatingSchema` → `validatingInstance`
7. Validation completes → `validationComplete`

### Error Handling

- **JSON Parse Errors**: Stay in error state until user fixes input
- **Schema Validation Errors**: Show schema errors, don't proceed to instance validation
- **Instance Validation Errors**: Show instance validation errors but consider flow complete
- **All Error States**: Allow user to update either input to retry

### Parallel Processing

When `VALIDATE` event is sent, the machine uses parallel states to parse both schema and instance simultaneously, then proceeds when both are complete.

## Integration with Previous Implementation

This design preserves the exact validation logic from the previous Vue 2 app:

### From `App.vue`

- **Debounced validation**: Implemented via machine context and composable
- **JSON parsing**: Matches JSONEditor emit pattern
- **AJV setup**: Same options (`allErrors: true, verbose: true`)
- **Schema validation**: Uses `ajv.validateSchema()`
- **Instance validation**: Uses `ajv.compile()` + `validator(instance)`
- **Error formatting**: Same error message format

### From `JSONEditor.vue`

- **JSON parsing**: Replicates jsonlint check logic
- **Parse error handling**: Same error state management
- **Valid status tracking**: Same boolean validation states

### From `Results.vue`

- **Error display**: Same error categorization and formatting
- **Success states**: Same validation success detection

## Composable Interface

The `useValidation()` composable provides:

### Reactive State

- `snapshot` - Current machine snapshot
- `currentState` - Current state name
- `context` - Machine context data

### Computed Status

- `isValidating` - Machine is in a validation state
- `hasErrors` - Any errors present
- `isValidationComplete` - Validation flow finished
- `validationSuccess` - Validation completed successfully
- `validationFailed` - Validation completed with errors

### Error Messages

- `schemaValidationErrorMessages` - Formatted schema errors
- `instanceValidationErrorMessages` - Formatted instance errors

### Actions

- `updateSchema(text)` - Update schema and trigger parsing
- `updateInstance(text)` - Update instance and trigger parsing
- `triggerValidation()` - Manual validation trigger
- `clearErrors()` - Clear current errors
- `reset()` - Reset to initial state

## Benefits of XState Design

1. **Clear State Management**: Explicit states prevent impossible states
2. **Predictable Flow**: Deterministic transitions match user expectations
3. **Error Handling**: Comprehensive error states with recovery paths
4. **Debuggable**: XState devtools provide complete state visualization
5. **Testable**: Machine logic is pure and easily testable
6. **Maintainable**: Self-documenting state chart replaces complex conditional logic

## Future Extensibility

This design supports future enhancements:

- **Multiple Validators**: Add WASM validators as additional services
- **Draft Support**: Extend schema validation for different JSON Schema drafts
- **Performance**: Add caching states for compiled schemas
- **Sharing**: Add states for URL encoding/decoding shared data
- **Themes**: Add UI state management for editor themes
