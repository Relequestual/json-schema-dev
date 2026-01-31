import { useMachine } from '@xstate/vue';
import { fromPromise } from 'xstate';
import { validationMachine } from '~/machines/validationMachine';
import Ajv, { type ErrorObject } from 'ajv';

// Type for any valid JSON value (matches machine definition)
type JSONValue = string | number | boolean | null | JSONValue[] | { [key: string]: JSONValue };

/**
 * Composable that provides JSON Schema validation functionality using XState machine.
 * Based on the logic from the previous Vue 2 implementation.
 */
export const useValidation = () => {
  // Get store inside composable function (after Pinia is initialized)
  const playgroundStore = usePlaygroundStore();
  // Create AJV instance with settings matching previous implementation
  const ajv = new Ajv({
    allErrors: true,
    verbose: true,
    // jsonPointers: true // This was removed in AJV 8+, using instancePath instead
  });

  // XState machine with validation services (XState v5 API)
  const { snapshot, send } = useMachine(
    validationMachine.provide({
      actors: {
        // Parse JSON text - matches JSONEditor component logic
        parseJSON: fromPromise<JSONValue, string>(async ({ input }) => {
          console.log('actor parsing json');
          console.log({ input });

          try {
            return JSON.parse(input);
          } catch (error) {
            throw new Error(
              `Invalid JSON: ${error instanceof Error ? error.message : 'Unknown error'}`
            );
          }
        }),

        // Validate schema using AJV - matches App.vue validateSchema logic
        validateSchema: fromPromise<ErrorObject[] | null, unknown>(async ({ input }) => {
          console.log('actor validate schema');
          console.log({ input });
          if (input === null || input === undefined) {
            throw new Error('No schema provided for validation');
          }

          // JSON Schema can be an object or a boolean
          if (typeof input !== 'object' && typeof input !== 'boolean') {
            throw new Error('Schema must be a valid JSON Schema (object or boolean)');
          }

          try {
            // Use AJV's validateSchema method to check if schema is valid JSON Schema
            const isValid = ajv.validateSchema(input);

            if (!isValid && ajv.errors) {
              // Return the schema validation errors
              return ajv.errors;
            }

            // Return null if schema is valid (no errors)
            return null;
          } catch (error) {
            throw new Error(
              `Schema validation failed: ${error instanceof Error ? error.message : 'Unknown error'}`
            );
          }
        }),

        // Validate instance against schema - matches App.vue validate logic
        validateInstance: fromPromise<
          { isValid: boolean; errors: ErrorObject[] | null },
          { schema: unknown; instance: unknown }
        >(async ({ input }) => {
          console.log('actor validate instance');
          console.log({ input });
          if (
            !input ||
            input.schema === null ||
            input.schema === undefined ||
            input.instance === null ||
            input.instance === undefined
          ) {
            throw new Error('Both schema and instance are required for validation');
          }

          // Schema validation: must be object or boolean
          if (typeof input.schema !== 'object' && typeof input.schema !== 'boolean') {
            throw new Error('Schema must be a valid JSON Schema (object or boolean)');
          }

          // Instance can be any valid JSON value (no type restrictions needed)

          try {
            const validator = ajv.compile(input.schema as object | boolean);

            // Validate the instance
            const isValid = validator(input.instance);

            return {
              isValid,
              errors: isValid ? null : validator.errors || null,
            };
          } catch (error) {
            throw new Error(
              `Instance validation failed: ${error instanceof Error ? error.message : 'Unknown error'}`
            );
          }
        }),
      },
    })
  );

  // Computed getters for easier access to state properties
  const currentState = computed(() => snapshot.value.value);
  const context = computed(() => snapshot.value.context); // Empty context - data in store

  // Validation status computed properties - matches previous implementation
  const isValidating = computed(() => {
    return (
      snapshot.value.matches('parsingSchema') ||
      snapshot.value.matches('parsingInstance') ||
      snapshot.value.matches('validatingSchema') ||
      snapshot.value.matches('validatingInstance')
    );
  });

  const hasErrors = computed(() => {
    return !!(
      playgroundStore.schemaParseError ||
      playgroundStore.instanceParseError ||
      playgroundStore.schemaValidationErrors ||
      (playgroundStore.instanceValidationErrors &&
        playgroundStore.instanceValidationErrors.length > 0)
    );
  });

  // Computed properties for reactive state access
  const isValidationComplete = computed(() => {
    return currentState.value === 'validationResults';
  });

  // Error message formatters - matches previous implementation
  const formatSchemaError = (error: ErrorObject): string => {
    return `${error.message}.\n${error.keyword} at "${error.schemaPath}"\nInstance location: "${error.instancePath}"`;
  };

  const schemaValidationErrorMessages = computed(() => {
    const errors = playgroundStore.schemaValidationErrors;
    return errors ? errors.map((error: ErrorObject) => formatSchemaError(error)) : [];
  });

  const instanceValidationErrorMessages = computed(() => {
    const errors = playgroundStore.instanceValidationErrors;
    return errors ? errors.map((error: ErrorObject) => formatSchemaError(error)) : [];
  });

  // Actions to send events to the machine
  const updateSchema = (schemaText: string) => {
    send({ type: 'UPDATE_SCHEMA', schemaText });
  };

  const updateInstance = (instanceText: string) => {
    console.log('sending update of instance to SM');
    console.log({ instanceText });
    send({ type: 'UPDATE_INSTANCE', instanceText });
  };

  const reset = () => {
    send({ type: 'RESET' });
  };

  return {
    // State
    snapshot,
    currentState,
    context,

    // Status computed properties
    isValidating,
    hasErrors,
    isValidationComplete,

    // Error messages
    schemaValidationErrorMessages,
    instanceValidationErrorMessages,

    // Actions
    updateSchema,
    updateInstance,
    reset,

    // Send function for custom events
    send,
  };
};

export type UseValidationReturn = ReturnType<typeof useValidation>;
