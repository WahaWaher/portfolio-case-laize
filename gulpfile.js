const { series, parallel } = require('gulp');
// Tasks
const { cleanBuild, cleanCssSrc, cleanJsSrc } = require('./tasks/clean');
const { appStyles, vendorStyles, headerStyles } = require('./tasks/styles');
const { scriptsWebpack, scriptsNativeApp, scriptsNativeLibs } = require('./tasks/scripts');
const { rootPagesHTML, rootPagesPHP, pages, layout } = require('./tasks/pages');
const { images, genFavicons, genSprite, copySVG } = require('./tasks/images');
const { copyFonts } = require('./tasks/fonts');
const { copyRootOther } = require('./tasks/other');
const { watcher } = require('./tasks/watch');
// Configs
const { mode, config } = require('./project.config');

/**
 * Development
 */
exports['dev'] = series(
  cleanCssSrc,
  cleanJsSrc,
  parallel(
    config.useWebpackJS ? scriptsWebpack : scriptsNativeLibs,
    appStyles,
    vendorStyles,
    genSprite
  ),
  watcher
);

/**
 * Production
 */
exports['build'] = series(
  cleanBuild,
  parallel(
    config.useWebpackJS
      ? scriptsWebpack
      : parallel(scriptsNativeLibs, scriptsNativeApp),
    appStyles,
    vendorStyles,
    rootPagesHTML,
    rootPagesPHP,
    pages,
    layout,
    genSprite,
    images,
    copyFonts,
    copySVG,
    copyRootOther,
  )
);

/**
 * Generate favicons (png, ico)
 * From: "src/img/original.png"
 */
exports['fav'] = series(genFavicons);

/**
 * Generate header-styles to "src/css/header~app.min.css"
 * (normalizer, bootstrap-grid)
 * Settings: "src/scss/utils/_variables.scss"
 */
exports['header-styles'] = series(headerStyles);
