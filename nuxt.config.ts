// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-08-01',
  devtools: { enabled: true },

  css: ['~/assets/css/main.css'],

  vite: {
    optimizeDeps: {
      include: ['monaco-editor'],
    },
  },

  modules: [
    '@nuxt/ui',
    '@nuxt/eslint',
    '@nuxt/fonts',
    '@nuxt/icon',
    '@nuxt/image',
    '@nuxt/scripts',
    '@nuxt/test-utils',
    '@pinia/nuxt',
  ],

  nitro: {
    preset: 'cloudflare-module',
    compatibilityDate: '2025-08-01',
    cloudflare: {
      deployConfig: true,
      nodeCompat: true,
    },
    // Bundle optimizations for Monaco Editor
    inlineDynamicImports: true,
    rollupConfig: {
      output: {
        manualChunks: (id) => {
          // Bundle Monaco files together to reduce worker invocations
          if (id.includes('monaco-editor')) {
            return 'monaco-vendor';
          }
        },
      },
    },
    compressPublicAssets: {
      gzip: true,
      brotli: true,
    },
  },
});
