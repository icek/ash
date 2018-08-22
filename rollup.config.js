import typescript from 'rollup-plugin-typescript2';
import { terser } from 'rollup-plugin-terser';

export default {
  input: 'ash/index.ts',
  output: [
    { format: 'umd', file: 'dist/ash.ts.umd.js', name: 'ash-ts' },
    { format: 'esm', file: 'dist/ash.ts.esm.js', name: 'ash-ts' }
  ],
  plugins: [
    typescript({ tsconfig: 'ash/tsconfig.json', useTsconfigDeclarationDir: true }),
    terser()
  ]
};
