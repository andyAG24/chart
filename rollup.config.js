import typescript from '@rollup/plugin-typescript';
import dts from 'rollup-plugin-dts';
import postcss from 'rollup-plugin-postcss';

export default [
  {
    input: 'src/index.ts',
    output: [
      {
        file: 'build/esm/index.js',
        format: 'esm',
      },
      {
        file: 'build/cjs/index.js',
        format: 'cjs',
      },
    ],
    plugins: [
      typescript({ tsconfig: './tsconfig.json' }),
      postcss({ extract: 'index.css', modules: true, use: ['sass'], minimize: true }),
    ],
    external: ['react'],
  },
  {
    input: 'build/esm/index.d.ts',
    output: [{ file: 'build/index.d.ts', format: 'esm' }],
    plugins: [dts()],
  },
];
