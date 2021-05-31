import typescript from 'rollup-plugin-typescript2';
import { terser } from 'rollup-plugin-terser';
import { nodeResolve } from '@rollup/plugin-node-resolve';

export default [
  {
    input: 'src/index.ts',
    output: {
      dir: 'dist/esm',
      format: 'esm',
    },
    plugins: [nodeResolve(), typescript(), terser()],
  },
  {
    input: 'src/index.ts',
    output: {
      dir: 'dist',
      format: 'cjs',
    },
    plugins: [
      nodeResolve(),
      typescript({ tsconfig: 'tsconfig.cjs.json' }),
      terser(),
    ],
  },
];
