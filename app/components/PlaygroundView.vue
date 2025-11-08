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
        <UAlert title="Invalid Share URL" :description="sharedUrlError" color="error" />
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

          <div class="w-full h-96 border border-gray-200 rounded-md overflow-hidden">
            <MonacoEditor
              v-model="playgroundStore.schema"
              lang="json"
              :options="{ ...editorOptions, placeholder: 'Enter your JSON Schema here...' }"
              :style="{ width: '100%', height: '100%' }"
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

          <div class="w-full h-96 border border-gray-200 rounded-md overflow-hidden">
            <MonacoEditor
              v-model="playgroundStore.instance"
              lang="json"
              :options="{
                ...editorOptions,
                placeholder: 'Enter your JSON instance to validate...',
              }"
              :style="{ width: '100%', height: '100%' }"
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
import { useMonacoConfig } from '@/composables/useMonacoConfig';

// Import layout components
import AppHeader from '~/components/layout/AppHeader.vue';
import AppFooter from '~/components/layout/AppFooter.vue';

// Import validation components
import Results from '~/components/validation/Results.vue';

// Import validation composable
const validation = useValidation();

// Import Pinia store
const playgroundStore = usePlaygroundStore();

// Import Monaco configuration composable
const { configureSchemaEditor, configureInstanceEditor, getEditorOptions } = useMonacoConfig();

// Get color mode for theme
const colorMode = useColorMode();

// Configure Monaco editors on mount
onMounted(async () => {
  await configureSchemaEditor();
  await configureInstanceEditor();
});

// Get editor options from composable and make theme reactive
const editorOptions = computed(() => {
  const isDarkMode = colorMode.value === 'dark';
  const baseEditorOptions = getEditorOptions(isDarkMode);

  return {
    ...baseEditorOptions,
    // Disable built-in JSON Schema autocomplete
    quickSuggestions: false,
    suggestOnTriggerCharacters: false,
    acceptSuggestionOnEnter: 'off' as const,
    // Keep syntax error highlighting but disable occurrence highlighting
    occurrencesHighlight: 'off' as const,
  };
});

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

// Extract shared data from URL path parameter (for /s/{data} route)
const sharedData = computed(() => {
  if (isSharedUrl.value) {
    // When using custom routing with :data parameter
    return (route.params.data as string) || null;
  }
  return null;
});

// Loading and error states for shared URLs
const isLoadingSharedData = ref(false);
const sharedUrlError = ref<string | null>(null);

// Handle shared URL data loading
onMounted(async () => {
  // Initialize playground with default data if not loading shared URL
  if (!isSharedUrl.value) {
    playgroundStore.initialize();
    return;
  }

  // Handle shared URL loading
  if (sharedData.value) {
    isLoadingSharedData.value = true;
    try {
      // TODO: Implement URL decoding logic
      // This will use useSharing composable to decode the data
      // and load it into the playground stores
      console.log('Loading shared data from URL:', sharedData.value);

      // Placeholder - actual implementation will decode and load data
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate loading

      // Note: We keep the original URL in place, no redirect
    } catch (err) {
      console.error('Failed to load shared data:', err);
      sharedUrlError.value = 'Failed to load shared data from URL';
    } finally {
      isLoadingSharedData.value = false;
    }
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
