const { task } = require('gulp');
const browserSync = require('browser-sync').create();
const serverConfig = require('../server.config.js');

/**
 * BrowserSync
 */
const server = () => {
  browserSync.init({
    ...serverConfig,
    // BrowserSync options
    browser: 'chrome',
    open: false,
    notify: false,
  });
};

module.exports = {
  server,
  browserSync,
  reload: browserSync.reload,
  stream: browserSync.stream,
};
