module.exports = {
  mode: 'modules',
  out: 'docs',
  exclude: ['./tests/**/*', './node_modules/**/*'],
  theme: 'default',
  ignoreCompilerErrors: true,
  excludePrivate: true,
  excludeNotExported: true,
  preserveConstEnums: true,
  stripInternal: true,
  tsconfig: 'ash/tsconfig.json'
};
