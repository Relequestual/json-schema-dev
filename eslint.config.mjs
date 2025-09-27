// @ts-check
import withNuxt from './.nuxt/eslint.config.mjs';
import eslintConfigPrettier from 'eslint-config-prettier';

export default withNuxt(
  // Disable rules that conflict with Prettier
  eslintConfigPrettier,
  {
    // Ignore legacy Vue 2 code
    ignores: ['previous/**/*'],
  }
);
