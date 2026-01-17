<!-- Main playground page -->
<!-- This will be the primary JSON Schema validation interface -->

<template>
  <div class="min-h-screen flex flex-col">
    <AppHeader />

    <!-- Loading state for shared URLs -->
    <div v-if="isLoadingSharedData" class="flex-1 flex items-center justify-center">
      <div class="text-center">
        <UIcon name="i-heroicons-arrow-path" class="animate-spin text-4xl text-primary mb-4" />
        <p class="text-muted">Loading shared data...</p>
      </div>
    </div>

    <!-- Error state for shared URLs -->
    <div v-else-if="sharedUrlError" class="flex-1 flex items-center justify-center px-4">
      <UCard class="max-w-md mx-auto">
        <UAlert
          :title="isDatabaseUnavailable ? 'Service Unavailable' : 'Invalid Share URL'"
          :description="sharedUrlError"
          :color="isDatabaseUnavailable ? 'warning' : 'error'"
        />
        <div class="mt-4">
          <UButton
            variant="outline"
            @click="
              sharedUrlError = null;
              $router.push('/');
            "
          >
            Continue to Playground
          </UButton>
        </div>
      </UCard>
    </div>

    <!-- Main playground interface -->
    <UContainer v-else class="flex-1 py-8 max-w-none">
      <div class="text-center mb-8">
        <h1 class="text-3xl font-bold text-highlighted mb-2">JSON Schema Playground</h1>
        <p class="text-muted">
          The home of JSON Schema validation right in your browser
          <span v-if="isSharedUrl" class="block text-sm text-toned mt-1">
            Loaded from shared URL
          </span>
        </p>
      </div>

      <!-- Main editor and validation interface -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-0 mb-8">
        <!-- Schema Editor -->
        <UCard>
          <template #header>
            <div class="flex items-center justify-between">
              <h2 class="text-lg font-semibold">JSON Schema</h2>
              <!-- Editor toolbar will go here -->
            </div>
          </template>

          <div class="w-full h-96">
            <CustomMonacoEditor
              v-model="playgroundStore.schema"
              language="json"
              :theme="colorMode.value === 'dark' ? 'vs-dark' : 'vs'"
              :container-style="{ width: '100%', height: '100%' }"
            />
          </div>
        </UCard>

        <!-- Instance Editor -->
        <UCard>
          <template #header>
            <div class="flex items-center justify-between">
              <h2 class="text-lg font-semibold">JSON Instance</h2>
              <!-- Editor toolbar will go here -->
            </div>
          </template>

          <div class="w-full h-96">
            <CustomMonacoEditor
              v-model="playgroundStore.instance"
              language="json"
              :theme="colorMode.value === 'dark' ? 'vs-dark' : 'vs'"
              :container-style="{ width: '100%', height: '100%' }"
            />
          </div>
        </UCard>
      </div>

      <!-- Results -->
      <UCard>
        <template #header>
          <h2 class="text-lg font-semibold">Results</h2>
        </template>

        <div class="space-y-4">
          <Results />
        </div>
      </UCard>
    </UContainer>

    <AppFooter />
  </div>
</template>

<script setup lang="ts">
import { useDebounceFn } from '@vueuse/core';

// Import layout components
import AppHeader from '~/components/layout/AppHeader.vue';
import AppFooter from '~/components/layout/AppFooter.vue';

// Import validation components
import Results from '~/components/validation/Results.vue';

// Props for server-side rendered shared data
import type { ShareResponse } from '~/utils/sharing';

const props = withDefaults(
  defineProps<{
    sharedData?: ShareResponse | null;
    loadError?: { message: string } | null;
  }>(),
  {
    sharedData: undefined,
    loadError: undefined,
  }
);

// Import validation composable
const validation = useValidation();

// Import Pinia store
const playgroundStore = usePlaygroundStore();

// Get color mode for theme
const colorMode = useColorMode();

// Debounced validation with proper cancellation
// Track the latest values to ensure we only process the most recent
let latestSchemaValue = '';
let latestInstanceValue = '';

const debouncedSchemaUpdate = useDebounceFn((schemaText: string) => {
  // Only proceed if this is still the latest value
  if (schemaText === latestSchemaValue) {
    validation.updateSchema(schemaText);
  }
}, 300);

const debouncedInstanceUpdate = useDebounceFn((instanceText: string) => {
  // Only proceed if this is still the latest value
  if (instanceText === latestInstanceValue) {
    validation.updateInstance(instanceText);
  }
}, 300);

// Watch for changes and trigger debounced validation
watch(
  () => playgroundStore.schema,
  (newValue) => {
    latestSchemaValue = newValue; // Track latest value
    debouncedSchemaUpdate(newValue);
  }
);
watch(
  () => playgroundStore.instance,
  (newValue) => {
    latestInstanceValue = newValue; // Track latest value
    debouncedInstanceUpdate(newValue);
  }
);

// Initialize validation on mount
onMounted(() => {
  validation.updateSchema(playgroundStore.schema);
  validation.updateInstance(playgroundStore.instance);
});

// Main playground component - handles both / and /s/{data} routes
// Detects route and loads shared data if on /s/{data} route

const route = useRoute();

// Detect if this is a shared URL (route starts with /s/)
const isSharedUrl = computed(() => route.path.startsWith('/s/'));

// Loading and error states for shared URLs
const isLoadingSharedData = ref(false);
const sharedUrlError = ref<string | null>(null);

// Determine error state and message
const isDatabaseUnavailable = computed(() => props.loadError?.message === 'DATABASE_UNAVAILABLE');

// Check if this is a shared URL that failed to load server-side
if (isSharedUrl.value && !props.sharedData) {
  if (isDatabaseUnavailable.value) {
    sharedUrlError.value =
      'The database service is currently unavailable. Please try again later or continue to use the playground without loading shared data.';
  } else if (props.loadError) {
    sharedUrlError.value = 'Shared URL not found or could not be loaded.';
  }
}

// Handle shared URL data loading
onMounted(async () => {
  // Handle shared URL data initialization
  if (isSharedUrl.value) {
    if (props.sharedData) {
      // Use server-side rendered data
      try {
        if (props.sharedData.schema) {
          playgroundStore.schema = props.sharedData.schema;
          validation.updateSchema(props.sharedData.schema);
        }
        if (props.sharedData.instance) {
          playgroundStore.instance = props.sharedData.instance;
          validation.updateInstance(props.sharedData.instance);
        }

        // TODO: Handle validators and configs when validator system is implemented
        // props.sharedData.implementations.validators
        // props.sharedData.implementations.configs
        console.log('Loaded shared data from server-side rendering');
      } catch (error) {
        console.error('Failed to load shared data:', error);
        sharedUrlError.value = 'Failed to load shared data. The URL may be invalid or corrupted.';
      }
    }
  } else {
    // Initialize playground with default data for non-shared URLs
    playgroundStore.initialize();
  }
});

// Set page metadata
useHead({
  title: 'JSON Schema Playground - jsonschema.dev',
  meta: [
    {
      name: 'description',
      content:
        'JSON Schema validation playground - validate JSON data against JSON Schema in your browser',
    },
  ],
});
</script>
