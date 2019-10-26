const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

module.exports = {
  mode: 'production',
  entry: {
    app: './src/js/app.js',
  },
  output: {
    filename: 'build/js/[name].min.js',
  },
  optimization: {
    minimize: true,
    minimizer: [
      new UglifyJsPlugin({
        cache: true,
        parallel: true,
        uglifyOptions: {
          output: {
            comments: false,
          },
        },
      }),
    ],
    splitChunks: {
      cacheGroups: {
        vendors: {
          filename: 'build/js/[name].min.js',
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
