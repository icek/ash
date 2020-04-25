/* eslint-disable @typescript-eslint/camelcase */
import resolve from '@rollup/plugin-node-resolve';
import dts from 'rollup-plugin-dts';
import { terser } from 'rollup-plugin-terser';
import typescript from 'rollup-plugin-typescript2';

const bundlePackageName = 'ash';
const packages = ['signals', 'core', 'fsm', 'tick', 'tools', 'io', bundlePackageName];
export default packages.reduce((config, packageName) => {
  const ashGlobal = 'ASH';
  const root = `packages/${packageName}`;
  const filePath = `${root}/dist/${packageName}`;
  const isBundle = packageName === bundlePackageName;
  const name = isBundle ? ashGlobal : `${ashGlobal}.${packageName}`;
  const globals = isBundle ? undefined : pkg => pkg.replace(/^@ash\.ts\/(.*)$/g, `${ashGlobal}.$1`);
  const external = isBundle ? undefined : pkg => pkg.startsWith('@ash.ts/');

  return [
    ...config,
    {
      input: `${root}/src/index.ts`,
      plugins: [
        resolve({ modulesOnly: true }),
        typescript({
          useTsconfigDeclarationDir: true,
          clean: true,
          verbosity: 1,
          tsconfigOverride: {
            include: [`${root}/src/`],
            compilerOptions: {
              baseUrl: root,
              declarationDir: `${root}/dist/types`,
            },
          },
        }),
        terser({ keep_classnames: true, keep_fnames: true, include: [/^.+\.min\.m?js$/] }),
      ],
      external,
      output: [
        { format: 'umd', file: `${filePath}.js`, globals, name },
        { format: 'umd', file: `${filePath}.min.js`, globals, name },
        { format: 'es', file: `${filePath}.mjs` },
        { format: 'es', file: `${filePath}.min.mjs` },
      ],
    }, {
      input: `${root}/dist/types/index.d.ts`,
      plugins: [dts()],
      output: { format: 'es', file: `${filePath}.d.ts` },
    }];
}, []);
