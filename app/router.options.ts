import type { RouterConfig } from '@nuxt/schema';

export default {
  // https://router.vuejs.org/api/interfaces/routeroptions.html#routes
  routes: () => [
    {
      name: 'home',
      path: '/',
      component: () => import('~/pages/index.vue'),
    },
    {
      name: 'shared-url',
      path: '/s/:data',
      component: () => import('~/pages/index.vue'),
    },
  ],
} satisfies RouterConfig;
