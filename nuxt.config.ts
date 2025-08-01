// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-08-01',
  devtools: { enabled: true },

  modules: [
    '@nuxt/eslint',
    '@nuxt/fonts',
    '@nuxt/icon',
    '@nuxt/image',
    '@nuxt/scripts',
    '@nuxt/test-utils',
  ],

  nitro: {
    preset: 'cloudflare-module',
    compatibilityDate: '2025-08-01',
    cloudflare: {
      deployConfig: true,
      nodeCompat: true,
    },
  },
});
