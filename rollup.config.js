/* eslint-disable @typescript-eslint/camelcase */
import dts from 'rollup-plugin-dts';
import resolve from 'rollup-plugin-node-resolve';
import { terser } from 'rollup-plugin-terser';
import typescript from 'rollup-plugin-typescript2';

export default [
  'signals',
  'core',
  'fsm',
  'tick',
  'tools',
  'io',
  'ash',
].reduce((config, name) => {
  const plugins = [
    resolve(),
    typescript({
      useTsconfigDeclarationDir: true,
      clean: true,
      verbosity: 1,
      tsconfig: `./packages/${name}/tsconfig.json`,
      tsconfigOverride: {
        include: ['./src/'],
      },
    }),
  ];

  const minPlugins = plugins.concat([
    terser({
      keep_classnames: true,
      keep_fnames: true,
    }),
  ]);

  const root = `packages/${name}`;
  const input = `${root}/src/index.ts`;

  config.push({
    input,
    plugins,
    output: [
      { format: 'umd', file: `${root}/dist/${name}.js`, name },
      { format: 'esm', file: `${root}/dist/${name}.mjs` },
    ],
  });

  config.push({
    input,
    plugins: minPlugins,
    output: [
      { format: 'umd', file: `${root}/dist/${name}.min.js`, name },
      { format: 'esm', file: `${root}/dist/${name}.min.mjs` },
    ],
  });

  config.push({
    input: `${root}/dist/types/index.d.ts`,
    plugins: [dts()],
    output: { file: `${root}/dist/${name}.d.ts`, format: 'es' },
  });

  return config;
}, []);
