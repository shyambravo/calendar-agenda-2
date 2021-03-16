import babel from 'rollup-plugin-babel';
import commonjs from '@rollup/plugin-commonjs';
import external from 'rollup-plugin-peer-deps-external';
import postcss from 'rollup-plugin-postcss';
import resolve from '@rollup/plugin-node-resolve';
import image from '@rollup/plugin-image';
import visualizer from 'rollup-plugin-visualizer';
import replace from '@rollup/plugin-replace';

import serve from 'rollup-plugin-serve';
import livereload from 'rollup-plugin-livereload';

export default {
  input: './src/index.js',
  output: [
    {
      file: 'temp/bunde.js',
      format: 'iife',
    },
  ],
  plugins: [
    serve({
      open: true,
      verbose: true,
      contentBase: ['', 'temp'],
      historyApiFallback: true,
      host: 'localhost',
      port: 3000,
    }),
    livereload({ watch: 'temp' }),
    replace({
      'process.env.NODE_ENV': JSON.stringify('production'),
      'process.env.REACT_APP_CLIENT_ID': JSON.stringify('1000.43FVHMOQJN51X41OMHWCCISWC8E2KQ'),
      'process.env.REACT_APP_CLIENT_SECRET': JSON.stringify('ffa14b204250402255feb1ec4f541cab3ecf06206b'),
      'process.env.REACT_APP_BACKEND_URL': JSON.stringify('http://localhost:5000'),
    }),
    external(),
    postcss(),
    babel({
      exclude: 'node_modules/**',
      presets: ['@babel/preset-react'],
      runtimeHelpers: true,
    }),
    resolve(),
    commonjs(),
    image(),
    visualizer(),
  ],
};
