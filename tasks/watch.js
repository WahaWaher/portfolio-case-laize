const { watch } = require('gulp');
// Configs
const { mode, config } = require('../project.config');
// Tasks
const { appStyles, vendorStyles } = require('./styles');
const { scriptsWebpack, scriptsNativeApp, scriptsNativeLibs } = require('./scripts');
const { server, reload } = require('./server');
const { genSprite } = require('./images');

/**
 * Watcher
 */
const watcher = () => {
  server();
  watch(['src/scss/**/*.scss', '!src/scss/vendors/**/*'], appStyles);
  watch(['src/scss/vendors/**/*.scss'], vendorStyles);

  if (config.useWebpackJS) {
    watch(['src/js/**/*.js', '!src/js/dist/**/*'], scriptsWebpack).on('change', reload);
  } else {
    watch(['src/js/vendors.list.js'], scriptsNativeLibs).on('change', reload);
    watch(['src/js/app.js'], scriptsNativeApp).on('change', reload);
  }
  
  watch(['src/svg/app-sprite-icons/**/*.svg'], genSprite).on('change', reload);
  watch(['src/**/*.(html|php)']).on('all', reload);
};

module.exports = {
  watcher
};