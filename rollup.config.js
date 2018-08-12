import typescript from 'rollup-plugin-typescript2';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import clean from 'rollup-plugin-clean';
import { terser } from 'rollup-plugin-terser';

export default {
  input: 'src/ash/index.ts',
  output: {
    name: 'ash',
    dir: 'dist',
    file: 'dist/ash.js',
    format: 'umd',
    sourcemap: false
  },
  plugins: [
    clean(),
    typescript({ tsconfig: 'src/ash/tsconfig.json', useTsconfigDeclarationDir: true }),
    resolve({ jsnext: true }),
    commonjs(),
    terser()
  ]
};
