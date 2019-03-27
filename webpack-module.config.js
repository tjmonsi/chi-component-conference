'use strict';

// const CleanWebpackPlugin = require('clean-webpack-plugin');

module.exports = (IS_DEV_SERVER) => {
  return {
    module: {
      rules: [
        {
          test: /\.js$/,
          // We need to transpile Polymer itself and other ES6 code
          // exclude: /(node_modules)/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: [[
                '@babel/preset-env',
                {
                  targets: { browsers: ['last 2 Chrome versions', 'Safari 10'] },
                  debug: true
                }
              ]],
              plugins: [
                '@babel/plugin-syntax-dynamic-import',
                ['@babel/plugin-transform-runtime', {
                  'helpers': false,
                  'regenerator': true
                }],
                ['@babel/plugin-proposal-object-rest-spread', { useBuiltIns: true }]
              ]
            }
          }
        }
      ]
    }
  };
};
