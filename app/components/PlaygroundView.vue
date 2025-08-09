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
    <div v-else-if="sharedUrlError" class="flex-1 flex items-center justify-center">
      <UContainer>
        <UCard class="max-w-md mx-auto">
          <UAlert title="Invalid Share URL" :description="sharedUrlError" color="error" />
          <div class="mt-4">
            <UButton variant="outline" @click="sharedUrlError = null; $router.push('/')">
              Continue to Playground
            </UButton>
          </div>
        </UCard>
      </UContainer>
    </div>

    <!-- Main playground interface -->
    <UContainer v-else class="flex-1 py-8">
      <div class="text-center mb-8">
        <h1 class="text-3xl font-bold text-highlighted mb-2">
          JSON Schema Playground
        </h1>
        <p class="text-muted">
          The home of JSON Schema validation right in your browser
          <span v-if="isSharedUrl" class="block text-sm text-toned mt-1">
            Loaded from shared URL
          </span>
        </p>
      </div>

      <!-- Main editor and validation interface -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <!-- Schema Editor -->
        <UCard>
          <template #header>
            <div class="flex items-center justify-between">
              <h2 class="text-lg font-semibold">JSON Schema</h2>
              <!-- Editor toolbar will go here -->
            </div>
          </template>

          <div class="h-96">
            <!-- <SchemaEditor /> -->
            <div
              class="flex items-center justify-center h-full bg-muted rounded-lg border-2 border-dashed border-muted">
              <p class="text-muted">Schema Editor (Monaco) will be here</p>
            </div>
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

          <div class="h-96">
            <!-- <JsonEditor /> -->
            <div
              class="flex items-center justify-center h-full bg-muted rounded-lg border-2 border-dashed border-muted">
              <p class="text-muted">Instance Editor (Monaco) will be here</p>
            </div>
          </div>
        </UCard>
      </div>

      <!-- Validation Results -->
      <UCard>
        <template #header>
          <h2 class="text-lg font-semibold">Validation Results</h2>
        </template>

        <div class="space-y-4">
          <!-- <ValidationResults /> -->
          <UAlert title="Ready to validate"
            description="Enter your JSON Schema and instance data above to begin validation." color="info"
            variant="soft" />
        </div>
      </UCard>
    </UContainer>

    <AppFooter />
  </div>
</template>

<script setup lang="ts">
// Import layout components
import AppHeader from '~/components/layout/AppHeader.vue'
import AppFooter from '~/components/layout/AppFooter.vue'

// Main playground component - handles both / and /s/{data} routes
// Detects route and loads shared data if on /s/{data} route

const route = useRoute()

// Detect if this is a shared URL (route starts with /s/)
const isSharedUrl = computed(() => route.path.startsWith('/s/'))

// Extract shared data from URL path parameter (for /s/{data} route)
const sharedData = computed(() => {
  if (isSharedUrl.value) {
    // When using custom routing with :data parameter
    return route.params.data as string || null
  }
  return null
})

// Loading and error states for shared URLs
const isLoadingSharedData = ref(false)
const sharedUrlError = ref<string | null>(null)

// Handle shared URL data loading
onMounted(async () => {
  if (isSharedUrl.value && sharedData.value) {
    isLoadingSharedData.value = true
    try {
      // TODO: Implement URL decoding logic
      // This will use useSharing composable to decode the data
      // and load it into the playground stores
      console.log('Loading shared data from URL:', sharedData.value)

      // Placeholder - actual implementation will decode and load data
      await new Promise(resolve => setTimeout(resolve, 1000)) // Simulate loading

      // Note: We keep the original URL in place, no redirect

    } catch (err) {
      console.error('Failed to load shared data:', err)
      sharedUrlError.value = 'Failed to load shared data from URL'
    } finally {
      isLoadingSharedData.value = false
    }
  }
})

// Set page metadata
useHead({
  title: 'JSON Schema Playground - jsonschema.dev',
  meta: [
    { name: 'description', content: 'JSON Schema validation playground - validate JSON data against JSON Schema in your browser' }
  ]
})
</script>
