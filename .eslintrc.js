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
    'max-len': ['error', 120, 2, {
      ignoreUrls: true,
      ignoreComments: false,
      ignoreRegExpLiterals: true,
      ignoreStrings: true,
      ignoreTemplateLiterals: true,
    }],
    'no-restricted-syntax': ['error', 'WithStatement'],
    'class-methods-use-this': 'off',
    'no-underscore-dangle': 'off',
    'no-continue': 'off',
    'no-param-reassign': ['error', { 'props': false }],
    'object-curly-newline': ['error', {
      'ObjectExpression': { 'consistent': true },
      'ObjectPattern': { 'consistent': true },
      'ImportDeclaration': { 'consistent': true },
      'ExportDeclaration': { 'consistent': true },
    }],
    'import/prefer-default-export': 'off',

    '@typescript-eslint/indent': ['error', 2],
    '@typescript-eslint/type-annotation-spacing': ['error', { before: false, after: false, overrides: { arrow: { before: true, after: true } } }],
    '@typescript-eslint/explicit-function-return-type': ['error', { allowExpressions: true, allowHigherOrderFunctions: true }],
    '@typescript-eslint/no-non-null-assertion': 'off',
    '@typescript-eslint/no-unused-vars': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
  },
};
