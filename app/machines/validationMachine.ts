import { setup, assign } from 'xstate';
import type { ErrorObject } from 'ajv';

// Type for any valid JSON value
type JSONValue = string | number | boolean | null | JSONValue[] | { [key: string]: JSONValue };

// Types for the validation context
export interface ValidationContext {
  schemaText: string;
  instanceText: string;

  // Parsed JSON data
  parsedSchema: string | boolean | null;
  parsedInstance: JSONValue;

  // JSON parsing errors
  schemaParseError: string | null;
  instanceParseError: string | null;

  // Schema validation errors (when schema itself is invalid)
  schemaValidationErrors: ErrorObject[] | null;

  // Instance validation errors (when instance doesn't match schema)
  instanceValidationErrors: ErrorObject[] | null;

  // Overall validation result
  isValid: boolean | null;
}

// Events that can be sent to the machine
export type ValidationEvent =
  | { type: 'UPDATE_SCHEMA'; schemaText: string }
  | { type: 'UPDATE_INSTANCE'; instanceText: string }
  | { type: 'VALIDATE' }
  | { type: 'RESET' };

export const validationMachine = setup({
  types: {} as {
    context: ValidationContext;
    events: ValidationEvent;
  },
  actors: {
    parseJSON: 'parseJSON' as any,
    validateSchema: 'validateSchema' as any,
    validateInstance: 'validateInstance' as any,
  },
}).createMachine({
  id: 'validation',
  context: {
    schemaText: '{}',
    instanceText: '{}',
    parsedSchema: null as string | boolean | null,
    parsedInstance: null as JSONValue,
    schemaParseError: null as string | null,
    instanceParseError: null as string | null,
    schemaValidationErrors: null as ErrorObject[] | null,
    instanceValidationErrors: null as ErrorObject[] | null,
    isValid: null as boolean | null,
  },

  initial: 'idle',

  states: {
    idle: {
      description: 'Ready for text updates',
      entry: (context) => console.log('🔄 State: idle', { context }),
      on: {
        UPDATE_SCHEMA: {
          target: 'parsingSchema',
          actions: [
            (context, event) => {
              console.log('UPDATE_SCHEMA event received:', event);
            },
            assign({
              schemaText: ({ event }) => event.schemaText,
              schemaParseError: null,
              schemaValidationErrors: null,
              isValid: null,
            }),
          ],
        },
        UPDATE_INSTANCE: {
          target: 'parsingInstance',
          actions: [
            (context, event) => {
              console.log('UPDATE_INSTANCE event received:', event);
            },
            assign({
              instanceText: ({ event }) => event.instanceText,
              instanceParseError: null,
              instanceValidationErrors: null,
              isValid: null,
            }),
          ],
        },
      },
    },

    parsingSchema: {
      description: 'Parsing schema JSON',
      entry: (context, event) => {
        console.log('🔄 State: parsingSchema', { context, event });
      },
      invoke: {
        src: 'parseJSON',
        input: ({ event }: { event: any }) => {
          console.log('[invoke input] parsingSchema event:', event);
          return event.schemaText;
        },
        onDone: {
          target: 'validatingSchema',
          actions: assign({
            parsedSchema: ({ event }) => event.output as string | boolean,
            schemaParseError: null,
          }),
        },
        onError: {
          target: 'schemaParseError',
          actions: assign({
            schemaParseError: ({ event }) => {
              const error = event.error as Error;
              return error?.message || 'Invalid JSON in JSON Schema';
            },
            parsedSchema: null,
          }),
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
        input: ({ event }: { event: any }) => {
          console.log('[invoke input] parsingInstance event:', event);
          return event.instanceText;
        },
        onDone: [
          {
            // If schema is already validated, we're ready for instance validation
            target: 'bothReady',
            guard: ({ context }: { context: ValidationContext }) =>
              context.schemaValidationErrors === null && context.parsedSchema !== null,
            actions: assign({
              parsedInstance: ({ event }) => event.output as JSONValue,
              instanceParseError: null,
            }),
          },
          {
            // Otherwise, instance is parsed but waiting for schema validation
            target: 'instanceParsed',
            actions: assign({
              parsedInstance: ({ event }) => event.output as JSONValue,
              instanceParseError: null,
            }),
          },
        ],
        onError: {
          target: 'instanceParseError',
          actions: assign({
            instanceParseError: ({ event }) => {
              const error = event.error as Error;
              return error?.message || 'Invalid JSON in instance';
            },
            parsedInstance: null,
          }),
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
        input: ({ context }: { context: ValidationContext }) => {
          console.log(
            '[invoke input] validatingSchema context.parsedSchema:',
            context.parsedSchema
          );
          return context.parsedSchema;
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
            actions: assign({
              schemaValidationErrors: ({ event }) => event.output as ErrorObject[],
            }),
          },
          {
            // Schema is valid - check if instance is ready
            target: 'bothReady',
            guard: ({ context }: { context: ValidationContext }) => {
              const instanceReady =
                context.parsedInstance !== null && context.instanceParseError === null;
              console.log(
                '🔍 validatingSchema onDone - instanceReady check:',
                instanceReady,
                'parsedInstance:',
                context.parsedInstance,
                'instanceParseError:',
                context.instanceParseError
              );
              return instanceReady;
            },
            actions: assign({
              schemaValidationErrors: null,
            }),
          },
          {
            // Schema is valid but instance not ready yet
            target: 'schemaValidated',
            actions: [
              () =>
                console.log(
                  '🔍 validatingSchema onDone - going to schemaValidated (instance not ready)'
                ),
              assign({
                schemaValidationErrors: null,
              }),
            ],
          },
        ],
        onError: {
          target: 'schemaValidationError',
          actions: [
            ({ event }) => console.log('❌ validatingSchema onError:', event.error),
            assign({
              schemaValidationErrors: ({ event }) => [
                {
                  instancePath: '',
                  schemaPath: '',
                  keyword: 'error',
                  params: {},
                  message: (event.error as Error)?.message || 'Schema validation failed',
                } as ErrorObject,
              ],
            }),
          ],
        },
      },
    },

    validatingInstance: {
      description: 'Instance is being validated against the schema',
      entry: () => console.log('🔍 State: validatingInstance'),
      invoke: {
        src: 'validateInstance',
        input: ({ context }: { context: ValidationContext }) => {
          const input = { schema: context.parsedSchema, instance: context.parsedInstance };
          console.log('[invoke input] validatingInstance input:', input);
          return input;
        },
        onDone: {
          target: 'validationResults',
          actions: [
            ({ event }) => {
              console.log('✅ validatingInstance onDone - full event:', event);
              console.log('✅ validatingInstance onDone - output:', event.output);
              const output = event.output as { isValid: boolean; errors: ErrorObject[] | null };
              console.log('✅ validatingInstance onDone - isValid:', output.isValid);
              console.log('✅ validatingInstance onDone - errors:', output.errors);
            },
            assign({
              isValid: ({ event }) => (event.output as { isValid: boolean }).isValid,
              instanceValidationErrors: ({ event }) =>
                (event.output as { errors: ErrorObject[] | null }).errors,
            }),
          ],
        },
        onError: {
          target: 'validationResults',
          actions: [
            ({ event }) => {
              console.log('❌ validatingInstance onError - full event:', event);
              console.log('❌ validatingInstance onError - error:', event.error);
              console.log(
                '❌ validatingInstance onError - error message:',
                (event.error as Error)?.message
              );
            },
            assign({
              isValid: () => false,
              instanceValidationErrors: ({ event }) => [
                {
                  instancePath: '',
                  schemaPath: '',
                  keyword: 'error',
                  params: {},
                  message: (event.error as Error)?.message || 'Validation failed',
                } as ErrorObject,
              ],
            }),
          ],
        },
      },
    },

    // Terminal states
    schemaParseError: {
      description: 'Schema JSON is invalid',
      entry: () => console.log('❌ State: schemaParseError'),
      on: {
        UPDATE_SCHEMA: 'parsingSchema',
        UPDATE_INSTANCE: 'parsingInstance',
      },
    },

    instanceParseError: {
      description: 'Instance JSON is invalid',
      entry: () => console.log('❌ State: instanceParseError'),
      on: {
        UPDATE_SCHEMA: 'parsingSchema',
        UPDATE_INSTANCE: 'parsingInstance',
      },
    },

    schemaValidationError: {
      description: 'Schema is syntactically valid but semantically invalid',
      entry: () => console.log('❌ State: schemaValidationError'),
      on: {
        UPDATE_SCHEMA: 'parsingSchema',
        UPDATE_INSTANCE: 'parsingInstance',
      },
    },

    validationResults: {
      description: 'Validation completed with results',
      entry: () => console.log('✅ State: validationResults'),
      on: {
        UPDATE_SCHEMA: 'parsingSchema',
        UPDATE_INSTANCE: 'parsingInstance',
      },
    },
  },

  // Global events
  on: {
    RESET: {
      target: '.idle',
      actions: assign({
        schemaText: '{}',
        instanceText: '{}',
        parsedSchema: null,
        parsedInstance: null,
        schemaParseError: null,
        instanceParseError: null,
        schemaValidationErrors: null,
        instanceValidationErrors: null,
        isValid: null,
      }),
    },
  },
});

export type ValidationMachine = typeof validationMachine;
