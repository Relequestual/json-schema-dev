# Multi-Schema & Multi-Instance Strategy

## Overview

**Future Enhancement**: XState Actor Model (Planned for Phase 6)

## Context

- **Primary Schema**: Main schema with referenced sub-schemas (all must be parsed & validated)
- **Multiple Test Instances**: Each validates against the same resolved primary schema
- **Current Approach**: Single schema + single instance state machine (sufficient for MVP)

## Planned Actor-Based Architecture

```typescript
// Coordinator state machine manages schema resolution and instance validation
parentMachine = createMachine({
  context: {
    primarySchemaId: 'main',
    validationResults: new Map(), // instanceId -> validation result
  },
  states: {
    loadingSchemas: {
      // Spawn schema actors for primary + referenced schemas
      entry: 'spawnSchemaActors',
      always: { target: 'schemasReady', guard: 'allSchemasValid' },
    },
    schemasReady: {
      // Ready to validate instances against resolved primary schema
      on: {
        ADD_INSTANCE: { actions: 'spawnInstanceActor' },
        UPDATE_INSTANCE: { actions: 'updateInstanceActor' },
      },
    },
  },
});

// Individual schema/instance actors reuse current validation machine logic
schemaActor = createMachine({
  /* current schema parsing/validation logic */
});
instanceActor = createMachine({
  /* current instance validation logic */
});
```

## Benefits

- **Schema dependency coordination**: Wait for primary + all referenced schemas before instance validation
- **Scalable test instances**: Each gets independent actor, all validate against same resolved schema
- **Reusable logic**: Current clean state machine logic preserved for individual actors
- **Clear separation**: Parent coordinates, actors handle their own parsing/validation

## References

- [XState Actors Documentation](https://stately.ai/docs/actors)
- [XState Spawn Documentation](https://stately.ai/docs/spawn)
- [XState Actor Model Guide](https://stately.ai/docs/actor-model)

## Decision

Defer until multi-schema/instance requirements are confirmed. Current single-pair approach covers MVP needs effectively.
