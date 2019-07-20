/* eslint-disable @typescript-eslint/camelcase */
import dts from 'rollup-plugin-dts';
import resolve from 'rollup-plugin-node-resolve';
import { terser } from 'rollup-plugin-terser';
import typescript from 'rollup-plugin-typescript2';

export default ['signals', 'core', 'fsm', 'tick', 'tools', 'io', 'ash'].reduce((config, name) => {
  const root = `packages/${name}`;
  const input = `${root}/src/index.ts`;
  const filePath = `${root}/dist/${name}`;
  const plugins = [
    resolve(),
    typescript({
      useTsconfigDeclarationDir: true,
      clean: true,
      verbosity: 1,
      tsconfig: `${root}/tsconfig.json`,
      tsconfigOverride: {
        include: ['./src/'],
      },
    }),
  ];
  const minPlugins = [
    ...plugins,
    terser({
      keep_classnames: true,
      keep_fnames: true,
    }),
  ];

  return [
    ...config,
    {
      input,
      plugins,
      output: [
        { format: 'umd', file: `${filePath}.js`, name },
        { format: 'esm', file: `${filePath}.mjs` },
      ],
    }, {
      input,
      plugins: minPlugins,
      output: [
        { format: 'umd', file: `${filePath}.min.js`, name },
        { format: 'esm', file: `${filePath}.min.mjs` },
      ],
    }, {
      input: `${root}/dist/types/index.d.ts`,
      plugins: [dts()],
      output: { file: `${filePath}.d.ts`, format: 'es' },
    }];
}, []);
