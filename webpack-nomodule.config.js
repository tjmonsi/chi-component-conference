const BROWSERS = ['> 1%', 'last 2 versions', 'Firefox ESR', 'not ie <= 11'];

const CleanWebpackPlugin = require('clean-webpack-plugin');

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
                  targets: { browsers: BROWSERS },
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
    },
    plugins: IS_DEV_SERVER ? [] : [
      new CleanWebpackPlugin(['public'], { verbose: true })
    ]
  };
};
