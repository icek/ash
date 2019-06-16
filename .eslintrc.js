module.exports = {
  settings: {
    'import/resolver': {
      typescript: {
        project: './tsconfig.json',
      },
    },
  },
  parser: '@typescript-eslint/parser',
  extends: [
    'airbnb-base',
    'plugin:@typescript-eslint/recommended',
  ],
  plugins: ['@typescript-eslint'],
  env: {
    es6: true,
    browser: true,
    node: false,
    jest: true,
  },
  rules: {
    'max-len': [2, 120],
    'no-restricted-syntax': ['error', 'WithStatement'],
    'class-methods-use-this': 'off',
    'no-param-reassign': ['error', { 'props': false }],

    '@typescript-eslint/indent': ['error', 2],
    '@typescript-eslint/type-annotation-spacing': ['error', { before: false, after: false, overrides: { arrow: { before: true, after: true } } }],
    '@typescript-eslint/explicit-function-return-type': ['error', { allowExpressions: true }],
    '@typescript-eslint/no-non-null-assertion': 'off',
    '@typescript-eslint/no-unused-vars': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
  },
};
