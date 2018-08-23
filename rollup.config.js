import typescript from 'rollup-plugin-typescript2';
import { terser } from 'rollup-plugin-terser';

const typescriptConfig = {
  tsconfig: 'ash/tsconfig.json',
  useTsconfigDeclarationDir: true
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
      'es2015.iterable'
    ]
  }
};

export default [
  {
    input: 'ash/index.ts',
    output: [
      { format: 'umd', file: 'dist/ash.ts.js', name: 'ash' },
      { format: 'esm', file: 'dist/ash.ts.mjs' }
    ],
    plugins: [
      typescript(typescriptConfig)
    ]
  }, {
    input: 'ash/index.ts',
    output: [
      { format: 'umd', file: 'dist/ash.ts.min.js', name: 'ash' },
      { format: 'esm', file: 'dist/ash.ts.min.mjs' }
    ],
    plugins: [
      typescript(typescriptConfig),
      terser()
    ]
  }, {
    input: 'ash/index.ts',
    output: [
      { format: 'umd', file: 'dist/ash.ts.es5.js', name: 'ash' }
    ],
    plugins: [
      typescript({ ...typescriptConfig, tsconfigOverride }),
    ]
  }, {
    input: 'ash/index.ts',
    output: [
      { format: 'umd', file: 'dist/ash.ts.es5.min.js', name: 'ash' }
    ],
    plugins: [
      typescript({ ...typescriptConfig, tsconfigOverride }),
      terser()
    ]
  }
];
