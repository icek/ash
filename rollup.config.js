/* eslint-disable @typescript-eslint/camelcase */
import dts from 'rollup-plugin-dts';
import { terser } from 'rollup-plugin-terser';
import typescript from 'rollup-plugin-typescript2';

export default [
  'signals',
  'core',
  // 'fsm',
  // 'tick',
  // 'tools',
  // 'io',
].reduce((config, name) => {
  const plugins = [typescript({
    useTsconfigDeclarationDir: true,
    clean: true,
    verbosity: 1,
    tsconfig: `./packages/${name}/tsconfig.json`,
  })];
  const root = `packages/${name}`;
  const input = `${root}/src/index.ts`;

  config.push({
    plugins,
    input,
    output: [
      { format: 'umd', file: `${root}/dist/${name}.js`, name },
      { format: 'esm', file: `${root}/dist/${name}.mjs` },
    ],
  });

  plugins.push(terser({
    keep_classnames: true,
    keep_fnames: true,
  }));

  config.push({
    plugins,
    input,
    output: [
      { format: 'umd', file: `${root}/dist/${name}.min.js`, name },
      { format: 'esm', file: `${root}/dist/${name}.min.mjs` },
    ],
  });

  config.push({
    input: `${root}/dist/types/index.d.ts`,
    output: { file: `${root}/dist/${name}.d.ts`, format: 'es' },
    plugins: [dts()],
  });

  console.log(config);

  return config;
}, []);
// Library bundle in 4 versions: ESM and ES6 UMD as minified and unminified.
