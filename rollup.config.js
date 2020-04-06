/* eslint-disable @typescript-eslint/camelcase */
import dts from 'rollup-plugin-dts';
import resolve from '@rollup/plugin-node-resolve';
import { terser } from 'rollup-plugin-terser';
import typescript from 'rollup-plugin-typescript2';

const packages = ['signals', 'core', 'fsm', 'tick', 'tools', 'io', 'ash'];
export default packages.reduce((config, packageName) => {
  const root = `packages/${packageName}`;
  const input = `${root}/src/index.ts`;
  const filePath = `${root}/dist/${packageName}`;
  const name = packageName === 'ash' ? 'ash' : `ash.${packageName}`;
  const globals = packageName === 'ash' ? undefined : pkg => pkg.replace(/^@ash\.ts\/(.*)$/g, `ash.$1`);
  const external = packageName === 'ash' ? undefined : packages.map(pkg => `@ash.ts/${pkg}`);
  const plugins = [
    resolve({
      modulesOnly: true,
    }),
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
      external,
      output: [
        { format: 'umd', file: `${filePath}.js`, globals, name },
        { format: 'esm', file: `${filePath}.mjs`, globals },
      ],
    }, {
      input,
      plugins: minPlugins,
      external,
      output: [
        { format: 'umd', file: `${filePath}.min.js`, globals, name },
        { format: 'esm', file: `${filePath}.min.mjs`, globals },
      ],
    }, {
      input: `${root}/dist/types/index.d.ts`,
      plugins: [dts()],
      output: { file: `${filePath}.d.ts`, format: 'es' },
    }];
}, []);
