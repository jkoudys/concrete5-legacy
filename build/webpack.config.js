const webpack = require('webpack');
const precss = require('precss');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

// Check if we're doing a production build
const PROD = process.env.NODE_ENV === 'production';
const target = process.env.TARGET;

const presets = ['babel-preset-es2015', 'babel-preset-es2017', 'babel-preset-stage-2'].map(require.resolve);

const appDir = '../web/js/ccm_app';

const entry = [];
const output = {
  path: '../web/js',
};


if (target === 'base') {
  entry.push(
    'babel-polyfill'
  );
  output.filename = 'ccm.base.js';
} else {
  entry.push(
    `${appDir}`,
    `${appDir}/jquery.colorpicker.js`,
    `${appDir}/jquery.hoverIntent.js`,
    `${appDir}/jquery.liveupdate.js`,
    `${appDir}/jquery.metadata.js`,
    `${appDir}/jquery.cookie.js`,
    `${appDir}/layouts.js`,
    `${appDir}/quicksilver.js`,
    `${appDir}/sitemap.js`,
    `${appDir}/status_bar.js`,
    `${appDir}/tabs.js`,
    `${appDir}/tinymce_integration.js`,
    `${appDir}/ui.js`,
    `${appDir}/toolbar.js`,
    `${appDir}/themes.js`,
    `${appDir}/composer.js`
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
      test: /\.js$/,
      exclude: /(node_modules|bower_components)/,
      loader: 'babel-loader',
      query: { presets },
    }],
  },
}, PROD && {
  // Modify config if production build or not
  plugins: baseConfig.plugins.concat([
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
