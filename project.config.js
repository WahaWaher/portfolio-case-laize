const config = {
  /**
   * Use Webpack for JS
   * If false, third-party libraries
   * will be imported from: "src/js/vendors.list.js"
   * Example: "vendors.exmple.js"
   */
  useWebpackJS: true,

  development: {
    /**
     * Directory for compiled JS files
     * relative to the root dev directory
     * (paths in html files are changed manually)
     */
    readyJsDir: 'js/ready',

    /**
     * Directory for compiled CSS files
     * relative to the root dev directory
     * (paths in html files are changed manually)
     */
    readyCssDir: 'css',
  },
  production: {
    /**
     * Compress images in the "img /" directory
     */
    compressImg: true,
  },
};

/**
 * Get current mode
 */
let mode = () => require('yargs').argv.env || 'development';

mode.is = arg => {
  if (arg === 'dev') {
    return mode() === 'development' ? true : false;
  }
  if (arg === 'prod') {
    return mode() === 'production' ? true : false;
  }
};

module.exports = {
  config,
  mode,
};
