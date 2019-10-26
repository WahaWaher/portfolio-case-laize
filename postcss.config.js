module.exports = {
  /**
   * PostCSS (development mode)
   */
  development: {
    plugins: [require('postcss-inline-svg')],
  },

  /**
   * PostCSS (production mode)
   *
   */
  production: {
    plugins: [
      require('postcss-inline-svg'),
      require('autoprefixer')({
        overrideBrowserslist: ['> 0.1%'],
      }),
      require('css-mqpacker'),
      require('cssnano')({
        preset: ['default', { discardComments: { removeAll: true } }],
      }),
    ],
  },
};
