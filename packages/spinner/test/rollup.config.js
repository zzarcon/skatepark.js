const rollupNodeResolve = require('rollup-plugin-node-resolve');
const commonjs = require('rollup-plugin-commonjs');
const babel = require('rollup-plugin-babel');

module.exports = {
  entry: 'index.jsx',
  format: 'umd',
  moduleName: 'SpinnerTests',
  plugins: [
    babel({
      plugins: [
        'transform-class-properties',
        ['transform-react-jsx', {
          pragma: 'h'
        }]
      ]
    }),
    rollupNodeResolve({
      jsnext: true,
      main: true
    }),
    commonjs()
  ],
  dest: 'test_bundle.js'
};