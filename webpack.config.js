const webpack = require('webpack');
const precss = require('precss');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

// Check if we're doing a production build
const PROD = process.env.NODE_ENV === 'production';
const target = process.env.TARGET;

const presets = [
  ['env', {
    targets: PROD ? undefined : {
      chrome: 52,
    },
  }],
  'babel-preset-stage-2',
];

const appDir = './web/js/ccm_app';

const entry = [];
const output = {
  path: './web/js',
};

const plugins = [
  new ExtractTextPlugin({ filename: '../../web/css/ccm.app.css', allChunks: true }),
];

if (target === 'base') {
  entry.push(
    './polyfills/Object.assign',
    'babel-polyfill',
    'whatwg-fetch',
    './web/js/ccm_base'
  );
  output.filename = 'ccm.base.js';
} else {
  entry.push(
    `${appDir}`,
    `${appDir}/jquery.colorpicker.js`,
    `${appDir}/jquery.liveupdate.js`,
    `${appDir}/jquery.metadata.js`,
    `${appDir}/jquery.cookie.js`,
    `${appDir}/layouts.js`
  );

  output.filename = 'ccm.app.js';
}

module.exports = Object.assign({
  entry,
  output,
  module: {
    loaders: [{
      test: /\.json$/,
      loader: 'json-loader',
    }, {
      test: /\.less$/,
      loader: ExtractTextPlugin.extract({ fallback: 'style-loader', use: 'css-loader?-url!less-loader?-relativeUrls' }),
    }, {
      test: /\.js$/,
      exclude: /(node_modules|bower_components)/,
      loader: 'babel-loader',
      query: { presets },
    }],
  },
  plugins,
}, PROD && {
  // Modify config if production build or not
  plugins: plugins.concat([
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.UglifyJsPlugin(),
    new webpack.DefinePlugin({
      process: {
        env: {
          NODE_ENV: JSON.stringify('production'),
        },
      },
    }),
  ]),
});
