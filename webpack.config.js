'use strict';

const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

let entry = './src/index';
let plugins = [
  new webpack.optimize.OccurrenceOrderPlugin(),
  new webpack.DefinePlugin({
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
  }),
];
let cssLoader = ExtractTextPlugin.extract('style', 'css!postcss!stylus');

if (process.env.NODE_ENV === 'production') {
  plugins = plugins.concat([
    new ExtractTextPlugin('bundle.css'),
    new webpack.optimize.UglifyJsPlugin(),
  ]);
} else {
  entry = [
    'webpack-dev-server/client?http://localhost:3001',
    'webpack/hot/only-dev-server',
    'react-hot-loader/patch',
    './src/index'
  ];
  plugins.push(new webpack.HotModuleReplacementPlugin());
  cssLoader = 'style!css!postcss!stylus';
}

module.exports = {
  entry,
  output: {
    path: `${__dirname}/build/assets`,
    filename: 'bundle.js',
    publicPath: '/assets'
  },
  plugins,
  module: {
    loaders: [
      { test: /\.js$/, loader: 'babel', exclude: /node_modules/ },
      { test: /\.styl$/, loader: cssLoader }
    ]
  },
  postcss: [require('autoprefixer')],
  devtool: 'source-map'
};
