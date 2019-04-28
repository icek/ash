import typescript from 'rollup-plugin-typescript2';
import { terser } from 'rollup-plugin-terser';

const input = 'src/index.ts';

// Config for rollup-plugin-typescript2
const typescriptConfig = {
  useTsconfigDeclarationDir: true,
  clean: true,
  verbosity: 1,
};

// Config to override tsconfig to export ES5 module.
const tsconfigOverride = {
  compilerOptions: {
    target: 'es5',
    downlevelIteration: true,
    importHelpers: true,
    lib: [
      'dom',
      'es5',
      'es2015.collection',
      'es2015.iterable',
    ],
  },
};

// Config for terser - ES6 compatible code minifier.
const terserConfig = {
  keep_classnames: true,
  keep_fnames: true,
};

// Library bundle in 6 versions: ESM, ES6 UMD and ES5 UMD all as minified and unminified.
export default [
  {
    input,
    output: { format: 'umd', file: 'dist/ash.js', name: 'ash' },
    plugins: [typescript(typescriptConfig)],
  },
  {
    input,
    output: { format: 'umd', file: 'dist/ash.min.js', name: 'ash' },
    plugins: [typescript(typescriptConfig), terser(terserConfig)],
  },
  {
    input,
    output: { format: 'esm', file: 'dist/ash.mjs' },
    plugins: [typescript(typescriptConfig)],
  },
  {
    input,
    output: { format: 'esm', file: 'dist/ash.min.mjs' },
    plugins: [typescript(typescriptConfig), terser(terserConfig)],
  },
  {
    input,
    output: { format: 'umd', file: 'dist/ash.es5.js', name: 'ash' },
    plugins: [typescript({ ...typescriptConfig, tsconfigOverride })],
  },
  {
    input,
    output: { format: 'umd', file: 'dist/ash.es5.min.js', name: 'ash' },
    plugins: [typescript({ ...typescriptConfig, tsconfigOverride }), terser(terserConfig)],
  },
];
