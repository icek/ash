/* eslint-disable @typescript-eslint/camelcase */
import resolve from '@rollup/plugin-node-resolve';
import replace from '@rollup/plugin-replace';
import dts from 'rollup-plugin-dts';
import { terser } from 'rollup-plugin-terser';
import typescript from 'rollup-plugin-typescript2';
import * as fs from 'fs';

const bundlePackageName = 'ash';
const ashGlobal = 'ASH';
const packages = ['signals', 'core', 'fsm', 'tick', 'tools', 'io', bundlePackageName];
const versionMap = packages.reduce((map, pkg) => ({
  ...map,
  [`__version__/${pkg}`]: JSON.parse(fs.readFileSync(`packages/${pkg}/package.json`, { encoding: 'utf8' })).version,
}), {});

export default packages.reduce((config, packageName) => {
  const root = `packages/${packageName}`;
  const filePath = `${root}/dist/${packageName}`;
  const isBundle = packageName === bundlePackageName;
  const name = isBundle ? ashGlobal : `${ashGlobal}.${packageName}`;
  const globals = isBundle ? undefined : pkg => pkg.replace(/^@ash\.ts\/(.*)$/g, `${ashGlobal}.$1`);
  const external = isBundle ? undefined : pkg => pkg.startsWith('@ash.ts/');
  const minifier = terser({ keep_classnames: true, keep_fnames: true });
  const replacements = { preventAssignment: true, values: { ...versionMap, __env__: 'production' }};

  return [...config, {
    input: `${root}/src/index.ts`,
    plugins: [
      replace(replacements),
      resolve({ modulesOnly: true }),
      typescript({
        useTsconfigDeclarationDir: true,
        clean: true,
        verbosity: 1,
        tsconfigOverride: {
          include: [`${root}/src/`],
          compilerOptions: { baseUrl: root, declarationDir: `${root}/dist/types` },
        },
      }),
    ],
    external,
    output: [
      { format: 'umd', file: `${filePath}.js`, globals, name },
      { format: 'umd', file: `${filePath}.min.js`, globals, name, plugins: [minifier] },
      { format: 'es', file: `${filePath}.mjs` },
      { format: 'es', file: `${filePath}.min.mjs`, plugins: [minifier] },
    ],
  }, {
    input: `${root}/dist/types/index.d.ts`,
    plugins: [dts({ respectExternal: isBundle })],
    output: [{ format: 'umd', file: `${filePath}.d.ts` }],
  }];
}, []);
