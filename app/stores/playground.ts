// Main playground state store
// Manages JSON Schema and instance data, loading states, and core application state

import { defineStore } from 'pinia';
import type { ErrorObject } from 'ajv';

// Import JSONValue type from validation machine to maintain consistency
type JSONValue = string | number | boolean | null | unknown[] | { [key: string]: unknown };

export const usePlaygroundStore = defineStore('playground', () => {
  // Core content state
  const schema = ref('');
  const instance = ref('');

  // UI state
  const isLoading = ref(false);
  const showFeatures = ref(false);
  const showSettings = ref(false);

  // Validation state (moved from XState machine context)
  const parsedSchema = ref<JSONValue>(null);
  const parsedInstance = ref<JSONValue>(null);
  const schemaParseError = ref<string | null>(null);
  const instanceParseError = ref<string | null>(null);
  const schemaValidationErrors = ref<ErrorObject[] | null>(null);
  const instanceValidationErrors = ref<ErrorObject[] | null>(null);
  const isValid = ref<boolean | null>(null);

  // Actions - UI state only (direct state access for data)
  const toggleFeatures = () => {
    showFeatures.value = !showFeatures.value;
  };

  const toggleSettings = () => {
    showSettings.value = !showSettings.value;
  };

  // Batch operations - utility functions
  const resetValidation = () => {
    parsedSchema.value = null;
    parsedInstance.value = null;
    schemaParseError.value = null;
    instanceParseError.value = null;
    schemaValidationErrors.value = null;
    instanceValidationErrors.value = null;
    isValid.value = null;
  };

  // Initialize with default values
  const initialize = () => {
    schema.value = '';
    instance.value = '';
    resetValidation();
  };

  // Computed properties for validation status
  const hasErrors = computed(() => {
    return !!(
      schemaParseError.value ||
      instanceParseError.value ||
      schemaValidationErrors.value ||
      (instanceValidationErrors.value && instanceValidationErrors.value.length > 0)
    );
  });

  const validationSuccess = computed(() => {
    return isValid.value === true;
  });

  const validationFailed = computed(() => {
    return isValid.value === false;
  });

  // Computed property to determine what kind of idle state we're in
  const isWaitingForInput = computed(() => {
    const schemaEmpty = !schema.value || schema.value === '';
    const instanceEmpty = !instance.value || instance.value === '';
    return schemaEmpty || instanceEmpty;
  });

  // Computed property to determine if we should show the "ready" state
  const showReadyState = computed(() => {
    return isWaitingForInput.value && !hasErrors.value && isValid.value === null;
  });

  return {
    // State - Core content
    schema,
    instance,

    // State - UI
    isLoading,
    showFeatures,
    showSettings,

    // State - Validation
    parsedSchema,
    parsedInstance,
    schemaParseError,
    instanceParseError,
    schemaValidationErrors,
    instanceValidationErrors,
    isValid,

    // Computed - Validation status
    hasErrors,
    validationSuccess,
    validationFailed,
    isWaitingForInput,
    showReadyState,

    // Actions - UI only (data accessed directly)
    toggleFeatures,
    toggleSettings,

    // Batch operations
    resetValidation,
    initialize,
  };
});
