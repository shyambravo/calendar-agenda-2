import babel from 'rollup-plugin-babel';
import commonjs from '@rollup/plugin-commonjs';
import external from 'rollup-plugin-peer-deps-external';
import postcss from 'rollup-plugin-postcss';
import resolve from '@rollup/plugin-node-resolve';
import replace from '@rollup/plugin-replace';

import serve from 'rollup-plugin-serve';
import livereload from 'rollup-plugin-livereload';
import json from '@rollup/plugin-json';

export default {
  input: './src/index.js',
  output: [
    {
      file: '.bin/app.min.js',
      format: 'iife',
    },
  ],
  plugins: [
    serve({
      open: true,
      verbose: true,
      contentBase: ['', 'html'],
      historyApiFallback: true,
      host: 'localhost',
      port: 3000,
    }),
    livereload({ watch: '.bin' }),
    replace({
      'process.env.NODE_ENV': JSON.stringify('production'),
      'process.env.REACT_APP_CLIENT_ID': JSON.stringify('1000.43FVHMOQJN51X41OMHWCCISWC8E2KQ'),
      'process.env.REACT_APP_CLIENT_SECRET': JSON.stringify('ffa14b204250402255feb1ec4f541cab3ecf06206b'),
      'process.env.REACT_APP_BACKEND_URL': JSON.stringify('http://localhost:5000'),
    }),
    external(),
    postcss({
      extract: 'app.min.css',
    }),
    babel({
      exclude: 'node_modules/**',
      presets: ['@babel/preset-env', '@babel/preset-react'],
      runtimeHelpers: true,
    }),
    resolve(),
    commonjs(),
    json(),
  ],
};
