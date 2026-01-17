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

  icon: {
    // Use local bundling for Cloudflare Workers - remote API calls add latency and aren't reliable in edge runtime
    serverBundle: 'local',
  },

  nitro: {
    preset: 'cloudflare-module',
    compatibilityDate: '2025-08-01',
    cloudflare: {
      deployConfig: true,
      nodeCompat: true,
    },
    // Bundle optimizations for Monaco Editor
    rollupConfig: {
      output: {
        manualChunks: (id) => {
          // Bundle Monaco files together to reduce worker invocations
          if (id.includes('monaco-editor')) {
            return 'monaco-vendor';
          }
          // Ensure Nitro core modules stay together
          if (id.includes('nitropack/dist/runtime')) {
            return 'nitro-runtime';
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
