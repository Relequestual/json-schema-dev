// @ts-check
import withNuxt from './.nuxt/eslint.config.mjs';

export default withNuxt(
  // Your custom configs here
  {
    rules: {
      // Disable strict Vue attribute formatting rules
      'vue/first-attribute-linebreak': 'off',
      'vue/max-attributes-per-line': [
        'error',
        {
          singleline: 3,
        },
      ],
    },
  }
);
