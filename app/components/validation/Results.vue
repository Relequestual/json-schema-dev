<template>
  <div class="space-y-4">
    <!-- Schema Parse Errors -->
    <UAlert
      v-if="validation.context.value.schemaParseError"
      title="Schema Parse Error"
      :description="validation.context.value.schemaParseError"
      color="error"
      icon="i-heroicons-exclamation-triangle"
    />

    <!-- Instance Parse Errors -->
    <UAlert
      v-if="validation.context.value.instanceParseError"
      title="Instance Parse Error"
      :description="validation.context.value.instanceParseError"
      color="error"
      icon="i-heroicons-exclamation-triangle"
    />

    <!-- Schema Validation Errors -->
    <UAlert
      v-if="
        validation.context.value.schemaValidationErrors &&
        validation.context.value.schemaValidationErrors.length > 0
      "
      title="Schema Validation Error"
      color="error"
      icon="i-heroicons-exclamation-triangle"
    >
      <template #description>
        <div class="space-y-2">
          <div
            v-for="(error, i) in validation.context.value.schemaValidationErrors"
            :key="i"
            class="font-mono text-sm bg-error-50 dark:bg-error-950/50 p-2 rounded border-l-4 border-error-500"
          >
            <pre class="whitespace-pre-wrap">{{ formatSchemaError(error) }}</pre>
          </div>
        </div>
      </template>
    </UAlert>

    <!-- Instance Validation Errors -->
    <UAlert
      v-if="
        validation.context.value.instanceValidationErrors &&
        validation.context.value.instanceValidationErrors.length > 0
      "
      title="Instance Validation Error"
      color="error"
      icon="i-heroicons-exclamation-triangle"
    >
      <template #description>
        <div class="space-y-2">
          <div
            v-for="(error, i) in validation.context.value.instanceValidationErrors"
            :key="i"
            class="font-mono text-sm bg-error-50 dark:bg-error-950/50 p-2 rounded border-l-4 border-error-500"
          >
            <pre class="whitespace-pre-wrap">{{ formatValidationError(error) }}</pre>
          </div>
        </div>
      </template>
    </UAlert>

    <!-- Validation Success -->
    <UAlert
      v-if="validation.validationSuccess.value"
      title="Validation Successful"
      description="The JSON instance is valid according to the provided schema."
      color="primary"
      icon="i-heroicons-check-circle"
    />

    <!-- Ready to Validate (no errors, no results yet) -->
    <UAlert
      v-if="showReadyState"
      title="Ready to validate"
      description="Enter your JSON Schema and instance data above to begin validation."
      color="info"
      variant="soft"
      icon="i-heroicons-information-circle"
    />
  </div>
</template>

<script setup lang="ts">
import type { ErrorObject } from 'ajv';

// Use the global validation composable directly
const validation = useValidation();

// Computed to determine if we should show the "ready to validate" state
const showReadyState = computed(() => {
  return (
    !validation.isValidating.value &&
    !validation.hasErrors.value &&
    !validation.isValidationComplete.value &&
    !validation.context.value.schemaParseError &&
    !validation.context.value.instanceParseError &&
    (!validation.context.value.schemaValidationErrors ||
      validation.context.value.schemaValidationErrors.length === 0) &&
    (!validation.context.value.instanceValidationErrors ||
      validation.context.value.instanceValidationErrors.length === 0)
  );
});

// Error formatting functions (based on the previous implementation)
const formatSchemaError = (error: ErrorObject): string => {
  return `"${error.instancePath}" ${error.message}`;
};

const formatValidationError = (error: ErrorObject): string => {
  return `${error.message}.\n${error.keyword} at "${error.schemaPath}"\nInstance location: "${error.instancePath}"`;
};
</script>
