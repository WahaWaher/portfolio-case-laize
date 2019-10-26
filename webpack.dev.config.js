const { mode, config } = require('./project.config');
const { readyJsDir } = config.development;

module.exports = {
  mode: 'development',
  devtool: 'eval-source-map',
  entry: {
    app: './src/js/app.js',
  },
  output: {
    filename: `src/${readyJsDir}/[name].js`,
  },
  optimization: {
    minimize: false,
    splitChunks: {
      cacheGroups: {
        vendors: {
          filename: `src/${readyJsDir}/[name].js`,
          chunks: 'all',
          test: /node_modules/,
          enforce: true,
        },
      },
    },
  },

  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              [
                '@babel/preset-env',
                {
                  // Core-JS autopolyfill
                  useBuiltIns: 'usage',
                  ignoreBrowserslistConfig: true,
                  corejs: 3,
                },
              ],
            ],
            plugins: [
              // Async/Await
              '@babel/plugin-transform-async-to-generator',
              '@babel/plugin-transform-runtime',
              // Lodash
              'lodash',
              // Experimental
              '@babel/plugin-proposal-optional-chaining',
            ],
          },
        },
      },
    ],
  },
};
