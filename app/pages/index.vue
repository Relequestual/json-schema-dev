<template>
  <PlaygroundView :shared-data="sharedData" :load-error="loadError" />
</template>

<script setup lang="ts">
import { retrieveSharedContent } from '~/utils/sharing';

// Home page - renders the playground component
// This handles both / and /s/:data routes via router.options.ts

const route = useRoute();
const shortId = route.params.data as string;

// Only use SSR for shared URLs to enable server-side rendering and SEO
if (shortId) {
  definePageMeta({
    ssr: true,
  });
}

// Server-side data fetching for shared URLs
const { data: sharedData, error: loadError } = await useAsyncData(
  shortId ? `share-${shortId}` : 'no-share',
  async () => {
    if (!shortId || !import.meta.server) return null;

    try {
      // Access D1 database binding directly (more efficient than API call)
      // NOTE: If this becomes a performance issue with large multi-part data,
      // consider implementing a hybrid approach:
      // 1. Check if data is chunked/large via metadata query
      // 2. For large data, return a marker and use client-side streaming via API
      // 3. For small data, continue with direct server-side fetch

      // Get the server event context to access Cloudflare bindings
      const event = useRequestEvent();
      const db = event?.context?.cloudflare?.env?.DB;

      if (!db) {
        console.error('D1 database binding not available on server');
        throw new Error('DATABASE_UNAVAILABLE');
      }

      return await retrieveSharedContent(db, shortId);
    } catch (error) {
      console.error('Failed to fetch shared content:', error);
      throw error;
    }
  }
);

// Set SEO metadata for shared URLs
const errorMessage = loadError.value?.message;
const isDatabaseUnavailable = errorMessage === 'DATABASE_UNAVAILABLE';

if (sharedData.value) {
  useSeoMeta({
    title: 'JSON Schema Validation - Shared',
    description: 'JSON Schema validation playground with shared schema and instance data',
  });
} else if (isDatabaseUnavailable) {
  // Database is unavailable
  useSeoMeta({
    title: 'Service Unavailable - JSON Schema Validation',
    description: 'The JSON Schema validation service is temporarily unavailable',
  });
} else if (shortId) {
  // Shared URL not found
  useSeoMeta({
    title: 'Shared URL Not Found - JSON Schema Validation',
    description: 'The requested shared JSON Schema validation data could not be found',
  });
} else {
  // Regular home page
  useSeoMeta({
    title: 'JSON Schema Validation Playground',
    description:
      'Online JSON Schema validation tool with real-time validation and sharing capabilities',
  });
}
</script>
