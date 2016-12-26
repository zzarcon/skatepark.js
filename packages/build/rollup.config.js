const rollupNodeResolve = require('rollup-plugin-node-resolve');
const commonjs = require('rollup-plugin-commonjs');

module.exports = {
  entry: 'src/index.js',
  format: 'umd',
  moduleName: 'Emoji',
  plugins: [
    rollupNodeResolve({ jsnext: true, main: true }),
    commonjs()
  ],
  dest: 'dist/index.js'
};