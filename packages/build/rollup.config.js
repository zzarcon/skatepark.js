const rollupNodeResolve = require('rollup-plugin-node-resolve');
const commonjs = require('rollup-plugin-commonjs');
const babel = require('rollup-plugin-babel');

module.exports = {
  entry: 'src/index.jsx',
  format: 'umd',
  moduleName: 'Emoji',
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
  dest: 'dist/index.js'
};