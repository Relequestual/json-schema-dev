import { setup, fromPromise } from 'xstate';
import type { ErrorObject } from 'ajv';
import { usePlaygroundStore } from '@/stores/playground';

// Type for any valid JSON value
type JSONValue = string | number | boolean | null | JSONValue[] | { [key: string]: JSONValue };

// ValidationContext removed - all state now in Pinia store
// Machine is pure workflow controller

// Events that can be sent to the machine
export type ValidationEvent =
  | { type: 'UPDATE_SCHEMA'; schemaText: string }
  | { type: 'UPDATE_INSTANCE'; instanceText: string }
  | { type: 'VALIDATE' }
  | { type: 'RESET' };

export const validationMachine = setup({
  types: {} as {
    context: undefined; // No context - pure workflow controller
    events: ValidationEvent;
  },
  actors: {
    // Actor contract: Parse JSON text and return any valid JSON value
    parseJSON: fromPromise<JSONValue, string>(async () => {
      throw new Error('parseJSON actor must be provided');
    }),
    // Actor contract: Validate schema and return AJV errors or null
    validateSchema: fromPromise<ErrorObject[] | null, unknown>(async () => {
      throw new Error('validateSchema actor must be provided');
    }),
    // Actor contract: Validate instance against schema
    validateInstance: fromPromise<
      { isValid: boolean; errors: ErrorObject[] | null },
      { schema: unknown; instance: unknown }
    >(async () => {
      throw new Error('validateInstance actor must be provided');
    }),
  },
  actions: {
    // Update schema text and clear all schema-related errors
    updateSchema: ({ event }: { event: ValidationEvent }) => {
      const store = usePlaygroundStore();
      if (event.type === 'UPDATE_SCHEMA') {
        store.schema = event.schemaText;
      }
      store.schemaParseError = null;
      store.schemaValidationErrors = null;
      store.isValid = null;
    },
    // Update instance text and clear all instance-related errors
    updateInstance: ({ event }: { event: ValidationEvent }) => {
      const store = usePlaygroundStore();
      if (event.type === 'UPDATE_INSTANCE') {
        store.instance = event.instanceText;
      }
      store.instanceParseError = null;
      store.instanceValidationErrors = null;
      store.isValid = null;
    },
  },
}).createMachine({
  id: 'validation',
  context: {}, // No data storage - all state in Pinia store

  initial: 'idle',

  states: {
    idle: {
      description: 'Ready for text updates',
      entry: (context) => console.log('🔄 State: idle', { context }),
      on: {
        UPDATE_SCHEMA: [
          {
            // If schema is completely empty (no content), just update and stay in idle
            target: 'idle',
            guard: ({ event }: { event: Extract<ValidationEvent, { type: 'UPDATE_SCHEMA' }> }) => {
              const schemaText = event.schemaText;
              return schemaText === '';
            },
            actions: [
              (context, event) => {
                console.log('UPDATE_SCHEMA event received (empty):', event);
              },
              'updateSchema',
            ],
          },
          {
            // If schema has any content (including ""), proceed to parsing
            target: 'parsingSchema',
            actions: [
              (context, event) => {
                console.log('UPDATE_SCHEMA event received:', event);
              },
              'updateSchema',
            ],
          },
        ],
        UPDATE_INSTANCE: [
          {
            // If instance editor is completely empty (no characters), just update and stay in idle
            target: 'idle',
            guard: ({
              event,
            }: {
              event: Extract<ValidationEvent, { type: 'UPDATE_INSTANCE' }>;
            }) => {
              const instanceText = event.instanceText;
              return instanceText === '';
            },
            actions: [
              (context, event) => {
                console.log('UPDATE_INSTANCE event received (empty):', event);
              },
              'updateInstance',
            ],
          },
          {
            // If instance has any content (including quoted empty string ""), proceed to parsing
            target: 'parsingInstance',
            actions: [
              (context, event) => {
                console.log('UPDATE_INSTANCE event received:', event);
              },
              'updateInstance',
            ],
          },
        ],
      },
    },

    parsingSchema: {
      description: 'Parsing schema JSON',
      entry: (context, event) => {
        console.log('🔄 State: parsingSchema', { context, event });
      },
      invoke: {
        src: 'parseJSON',
        input: ({ event }) => {
          console.log('[invoke input] parsingSchema event:', event);
          if (event.type === 'UPDATE_SCHEMA') {
            return event.schemaText;
          }
          return '';
        },
        onDone: {
          target: 'validatingSchema',
          actions: ({ event }) => {
            const store = usePlaygroundStore();
            store.parsedSchema = event.output;
            store.schemaParseError = null;
          },
        },
        onError: {
          target: 'schemaParseError',
          actions: ({ event }) => {
            const store = usePlaygroundStore();
            const errorMessage =
              event.error && typeof event.error === 'object' && 'message' in event.error
                ? String(event.error.message)
                : 'Invalid JSON in JSON Schema';
            store.schemaParseError = errorMessage;
            store.parsedSchema = null;
          },
        },
      },
    },

    parsingInstance: {
      description: 'Parsing instance JSON',
      entry: (context, event) => {
        console.log('🔄 State: parsingInstance', { context, event });
      },
      invoke: {
        src: 'parseJSON',
        input: ({ event }) => {
          console.log('[invoke input] parsingInstance event:', event);
          if (event.type === 'UPDATE_INSTANCE') {
            return event.instanceText;
          }
          return '';
        },
        onDone: [
          {
            // If schema is already validated, we're ready for instance validation
            target: 'bothReady',
            guard: () => {
              const store = usePlaygroundStore();
              return store.schemaValidationErrors === null && store.parsedSchema !== null;
            },
            actions: ({ event }) => {
              const store = usePlaygroundStore();
              store.parsedInstance = event.output;
              store.instanceParseError = null;
            },
          },
          {
            // Otherwise, instance is parsed but waiting for schema validation
            target: 'instanceParsed',
            actions: ({ event }) => {
              const store = usePlaygroundStore();
              store.parsedInstance = event.output;
              store.instanceParseError = null;
            },
          },
        ],
        onError: {
          target: 'instanceParseError',
          actions: ({ event }) => {
            const store = usePlaygroundStore();
            const errorMessage =
              event.error && typeof event.error === 'object' && 'message' in event.error
                ? String(event.error.message)
                : 'Invalid JSON in instance';
            store.instanceParseError = errorMessage;
            store.parsedInstance = null;
          },
        },
      },
    },

    schemaValidated: {
      description: 'Schema is validated, waiting for instance to be parsed',
      entry: () => console.log('✅ State: schemaValidated'),
      on: {
        UPDATE_SCHEMA: 'parsingSchema',
        UPDATE_INSTANCE: 'parsingInstance',
      },
    },

    instanceParsed: {
      description: 'Instance is parsed, waiting for schema to be validated',
      entry: () => console.log('📝 State: instanceParsed'),
      on: {
        UPDATE_SCHEMA: 'parsingSchema',
        UPDATE_INSTANCE: 'parsingInstance',
      },
    },

    bothReady: {
      description: 'Both schema and instance are parsed and schema is valid',
      entry: () => console.log('✅ State: bothReady'),
      always: {
        target: 'validatingInstance',
      },
      on: {
        UPDATE_SCHEMA: 'parsingSchema',
        UPDATE_INSTANCE: 'parsingInstance',
      },
    },

    validatingSchema: {
      description: 'Schema is being validated',
      entry: () => console.log('🔍 State: validatingSchema'),
      invoke: {
        src: 'validateSchema',
        input: () => {
          const store = usePlaygroundStore();
          console.log('[invoke input] validatingSchema store.parsedSchema:', store.parsedSchema);
          return store.parsedSchema;
        },
        onDone: [
          {
            target: 'schemaValidationError',
            guard: ({ event }) => {
              const hasErrors = Array.isArray(event.output) && event.output.length > 0;
              console.log(
                '🔍 validatingSchema onDone - hasErrors:',
                hasErrors,
                'output:',
                event.output
              );
              return hasErrors;
            },
            actions: ({ event }) => {
              const store = usePlaygroundStore();
              store.schemaValidationErrors = event.output;
            },
          },
          {
            // Schema is valid - check if instance is ready
            target: 'bothReady',
            guard: () => {
              const store = usePlaygroundStore();
              const instanceReady =
                store.parsedInstance !== null && store.instanceParseError === null;
              console.log(
                '🔍 validatingSchema onDone - instanceReady check:',
                instanceReady,
                'parsedInstance:',
                store.parsedInstance,
                'instanceParseError:',
                store.instanceParseError
              );
              return instanceReady;
            },
            actions: () => {
              const store = usePlaygroundStore();
              store.schemaValidationErrors = null;
            },
          },
          {
            // Schema is valid but instance not ready yet
            target: 'schemaValidated',
            actions: [
              () =>
                console.log(
                  '🔍 validatingSchema onDone - going to schemaValidated (instance not ready)'
                ),
              () => {
                const store = usePlaygroundStore();
                store.schemaValidationErrors = null;
              },
            ],
          },
        ],
        onError: {
          target: 'schemaValidationError',
          actions: [
            ({ event }) => console.log('❌ validatingSchema onError:', event.error),
            ({ event }) => {
              const store = usePlaygroundStore();
              const errorMessage =
                event.error && typeof event.error === 'object' && 'message' in event.error
                  ? String(event.error.message)
                  : 'Schema validation failed';
              store.schemaValidationErrors = [
                {
                  instancePath: '',
                  schemaPath: '',
                  keyword: 'error',
                  params: {},
                  message: errorMessage,
                } as ErrorObject,
              ];
            },
          ],
        },
      },
    },

    validatingInstance: {
      description: 'Instance is being validated against the schema',
      entry: () => console.log('🔍 State: validatingInstance'),
      invoke: {
        src: 'validateInstance',
        input: () => {
          const store = usePlaygroundStore();
          const input = { schema: store.parsedSchema, instance: store.parsedInstance };
          console.log('[invoke input] validatingInstance input:', input);
          return input;
        },
        onDone: {
          target: 'validationResults',
          actions: [
            ({ event }) => {
              console.log('✅ validatingInstance onDone - full event:', event);
              console.log('✅ validatingInstance onDone - output:', event.output);
              console.log('✅ validatingInstance onDone - isValid:', event.output.isValid);
              console.log('✅ validatingInstance onDone - errors:', event.output.errors);

              const store = usePlaygroundStore();
              store.isValid = event.output.isValid;
              store.instanceValidationErrors = event.output.errors;
            },
          ],
        },
        onError: {
          target: 'validationResults',
          actions: [
            ({ event }) => {
              console.log('❌ validatingInstance onError - full event:', event);
              console.log('❌ validatingInstance onError - error:', event.error);
              const errorMessage =
                event.error && typeof event.error === 'object' && 'message' in event.error
                  ? String(event.error.message)
                  : 'Validation failed';
              console.log('❌ validatingInstance onError - error message:', errorMessage);
            },
            ({ event }) => {
              const store = usePlaygroundStore();
              store.isValid = false;
              const errorMessage =
                event.error && typeof event.error === 'object' && 'message' in event.error
                  ? String(event.error.message)
                  : 'Validation failed';
              store.instanceValidationErrors = [
                {
                  instancePath: '',
                  schemaPath: '',
                  keyword: 'error',
                  params: {},
                  message: errorMessage,
                } as ErrorObject,
              ];
            },
          ],
        },
      },
    },

    // Terminal states
    schemaParseError: {
      description: 'Schema JSON is invalid',
      entry: () => console.log('❌ State: schemaParseError'),
      always: {
        target: 'idle',
      },
    },

    instanceParseError: {
      description: 'Instance JSON is invalid',
      entry: () => console.log('❌ State: instanceParseError'),
      always: {
        target: 'idle',
      },
    },

    schemaValidationError: {
      description: 'Schema is syntactically valid but semantically invalid',
      entry: () => console.log('❌ State: schemaValidationError'),
      always: {
        target: 'idle',
      },
    },

    validationResults: {
      description: 'Validation completed with results',
      entry: () => console.log('✅ State: validationResults'),
      always: {
        target: 'idle',
      },
    },
  },

  // Global events
  on: {
    RESET: {
      target: '.idle',
      actions: () => {
        const store = usePlaygroundStore();
        store.schema = '';
        store.instance = '';
        store.parsedSchema = null;
        store.parsedInstance = null;
        store.schemaParseError = null;
        store.instanceParseError = null;
        store.schemaValidationErrors = null;
        store.instanceValidationErrors = null;
        store.isValid = null;
      },
    },
  },
});

export type ValidationMachine = typeof validationMachine;
