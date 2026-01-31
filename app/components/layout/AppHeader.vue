<!-- Main application header/navigation component -->
<!-- Provides consistent navigation across all pages -->

<template>
  <header class="border-b border-default bg-default">
    <UContainer>
      <nav class="flex items-center justify-between h-16">
        <!-- Logo/Brand -->
        <div class="flex items-center">
          <NuxtLink to="/" class="flex items-center space-x-2">
            <UIcon name="i-heroicons-check-badge" class="text-primary text-2xl" />
            <span class="font-bold text-xl">JSONSchema.dev</span>
          </NuxtLink>
        </div>

        <!-- Navigation Links -->
        <div class="hidden md:flex items-center space-x-6">
          <UButton variant="ghost" external to="https://json-schema.org/specification.html">
            Specification
          </UButton>

          <UButton variant="ghost" external to="https://json-schema.org"> JSON-Schema.org </UButton>
        </div>

        <!-- Actions -->
        <div class="flex items-center space-x-4">
          <!-- Share Button -->
          <!-- <ShareButton /> -->

          <!-- Settings Toggle -->
          <UButton variant="ghost" icon="i-heroicons-cog-6-tooth" @click="toggleSettings" />

          <!-- GitHub Link -->
          <UButton
            variant="ghost"
            icon="i-simple-icons-github"
            external
            to="https://github.com/Relequestual/json-schema-dev"
          />
        </div>
      </nav>
    </UContainer>
  </header>
</template>

<script setup lang="ts">
// Header navigation logic
// Includes settings toggle, share functionality, and external links

const toggleSettings = () => {
  // Toggle settings panel/modal
  // Implementation will use settings store
};
</script>
