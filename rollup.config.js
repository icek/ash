import typescript from 'rollup-plugin-typescript2';
import { terser } from 'rollup-plugin-terser';

const input = 'src/index.ts';

const typescriptConfig = {
  useTsconfigDeclarationDir: true,
  clean: true,
  verbosity: 1,
};

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

const terserConfig = {
  keep_classnames: true,
  keep_fnames: true,
};

export default [
  {
    input,
    output: { format: 'umd', file: 'dist/ash.ts.js', name: 'ash' },
    plugins: [typescript(typescriptConfig)],
  },
  {
    input,
    output: { format: 'umd', file: 'dist/ash.ts.min.js', name: 'ash' },
    plugins: [typescript(typescriptConfig), terser(terserConfig)],
  },
  {
    input,
    output: { format: 'esm', file: 'dist/ash.ts.mjs' },
    plugins: [typescript(typescriptConfig)],
  },
  {
    input,
    output: { format: 'esm', file: 'dist/ash.ts.min.mjs' },
    plugins: [typescript(typescriptConfig), terser(terserConfig)],
  },
  {
    input,
    output: { format: 'umd', file: 'dist/ash.ts.es5.js', name: 'ash' },
    plugins: [typescript({ ...typescriptConfig, tsconfigOverride })],
  },
  {
    input,
    output: { format: 'umd', file: 'dist/ash.ts.es5.min.js', name: 'ash' },
    plugins: [typescript({ ...typescriptConfig, tsconfigOverride }), terser(terserConfig)],
  },
];
