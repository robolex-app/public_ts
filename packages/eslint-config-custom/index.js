/** @type {import('eslint').Linter.BaseConfig} **/
module.exports = {
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint', 'react', 'react-hooks', 'prettier'],

  extends: [
    'next',
    'turbo',
    'prettier',
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    // TODO: Enable this after PR is merged
    // 'plugin:@typescript-eslint/recommended-requiring-type-checking',
  ],

  rules: {
    // TODO: Make this an error after all are solved
    // https://linear.app/robolex/issue/ROB-64/fix-all-typescript-eslintno-unnecessary-condition-warns-and-make-it
    '@typescript-eslint/no-unnecessary-condition': 'warn',

    '@typescript-eslint/no-explicit-any': 'warn',

    // TODO: Enable this ASAP
    // '@typescript-eslint/no-floating-promises': 'error',

    '@typescript-eslint/no-unused-vars': [
      'warn',
      {
        // https://eslint.org/docs/latest/rules/no-unused-vars#ignorerestsiblings
        // https://github.com/eslint/eslint/issues/4880
        ignoreRestSiblings: true,
      },
    ],
  },

  settings: {
    react: {
      version: 'detect',
    },
  },
}
