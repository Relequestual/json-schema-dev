<!-- Application footer component -->
<!-- Provides consistent footer across all pages with credits and links -->

<template>
  <footer class="border-t border-default bg-muted mt-auto">
    <UContainer>
      <div class="flex flex-col md:flex-row items-center justify-between py-8">
        <!-- Credits and Links -->
        <div class="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-6">
          <NuxtLink 
            to="https://github.com/Relequestual/json-schema-dev"
            external
            class="flex items-center space-x-1 text-toned hover:text-default transition-colors"
          >
            <UIcon name="i-simple-icons-github" />
            <span>jsonschema.dev</span>
          </NuxtLink>
          
          <NuxtLink 
            to="https://twitter.com/relequestual"
            external
            class="flex items-center space-x-1 text-toned hover:text-default transition-colors"
          >
            <UIcon name="i-simple-icons-twitter" />
            <span>@relequestual</span>
          </NuxtLink>
        </div>
        
        <!-- Sponsor Link -->
        <div class="mt-4 md:mt-0">
          <span class="text-muted mr-2">Thanks to Sponsors:</span>
          <NuxtLink 
            to="https://ko-fi.com/F1F3TKJK"
            external
            class="inline-block"
          >
            <img 
              src="https://az743702.vo.msecnd.net/cdn/kofi3.png?v=2"
              alt="Buy Me a Coffee at ko-fi.com"
              class="h-9"
            >
          </NuxtLink>
        </div>
      </div>
    </UContainer>
  </footer>
</template>

<script setup lang="ts">
// Footer component - static content for now
// Future: Could include dynamic status information
</script>
