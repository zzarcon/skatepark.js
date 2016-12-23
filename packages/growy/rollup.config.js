const rollupNodeResolve = require('rollup-plugin-node-resolve');
const commonjs = require('rollup-plugin-commonjs');

module.exports = {
  entry: 'src/index.js',
  format: 'umd',
  moduleName: 'Growy',
  plugins: [
    rollupNodeResolve({ jsnext: true, main: true }),
    commonjs()
  ],
  dest: 'dist/index.js'
};