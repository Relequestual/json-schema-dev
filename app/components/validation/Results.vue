<template>
  <div class="space-y-4">
    <!-- Schema Parse Errors -->
    <UAlert
      v-if="playgroundStore.schemaParseError"
      title="Schema Parse Error"
      :description="playgroundStore.schemaParseError"
      color="error"
      icon="i-heroicons-exclamation-triangle"
    />

    <!-- Instance Parse Errors -->
    <UAlert
      v-if="playgroundStore.instanceParseError"
      title="Instance Parse Error"
      :description="playgroundStore.instanceParseError"
      color="error"
      icon="i-heroicons-exclamation-triangle"
    />

    <!-- Schema Validation Errors -->
    <UAlert
      v-if="
        playgroundStore.schemaValidationErrors && playgroundStore.schemaValidationErrors.length > 0
      "
      title="Schema Validation Error"
      color="error"
      icon="i-heroicons-exclamation-triangle"
    >
      <template #description>
        <div class="space-y-2">
          <div
            v-for="(error, i) in playgroundStore.schemaValidationErrors"
            :key="i"
            class="font-mono text-sm bg-red-100 dark:bg-red-950/50 text-red-900 dark:text-red-100 p-2 rounded border-l-4 border-red-500"
          >
            <pre class="whitespace-pre-wrap">{{ formatSchemaError(error) }}</pre>
          </div>
        </div>
      </template>
    </UAlert>

    <!-- Instance Validation Errors -->
    <UAlert
      v-if="
        playgroundStore.instanceValidationErrors &&
        playgroundStore.instanceValidationErrors.length > 0
      "
      title="Instance Validation Error"
      color="error"
      icon="i-heroicons-exclamation-triangle"
    >
      <template #description>
        <div class="space-y-2">
          <div
            v-for="(error, i) in playgroundStore.instanceValidationErrors"
            :key="i"
            class="font-mono text-sm bg-red-100 dark:bg-red-950/50 text-red-900 dark:text-red-100 p-2 rounded border-l-4 border-red-500"
          >
            <pre class="whitespace-pre-wrap">{{ formatValidationError(error) }}</pre>
          </div>
        </div>
      </template>
    </UAlert>

    <!-- Validation Success -->
    <UAlert
      v-if="playgroundStore.isValid === true"
      title="Validation Successful"
      description="The JSON instance is valid according to the provided schema."
      color="primary"
      icon="i-heroicons-check-circle"
    />

    <!-- Ready (no errors, no results yet) -->
    <UAlert
      v-if="playgroundStore.showReadyState"
      title="Ready"
      description="Enter your JSON Schema and instance data above to begin validation."
      color="info"
      variant="soft"
      icon="i-heroicons-information-circle"
    />
  </div>
</template>

<script setup lang="ts">
import type { ErrorObject } from 'ajv';

// Use the Pinia store for validation state
const playgroundStore = usePlaygroundStore();

// Error formatting functions (based on the previous implementation)
const formatSchemaError = (error: ErrorObject): string => {
  return `"${error.instancePath}" ${error.message}`;
};

const formatValidationError = (error: ErrorObject): string => {
  return `${error.message}.\n${error.keyword} at "${error.schemaPath}"\nInstance location: "${error.instancePath}"`;
};
</script>
