const { src, dest } = require('gulp');
const gulpif = require('gulp-if');
const rename = require('gulp-rename');
const sass = require('gulp-sass');
const sourcemaps = require('gulp-sourcemaps');
const concat = require('gulp-concat');
const cssimport = require('gulp-cssimport');
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');
const mqpacker = require('css-mqpacker');
const inlineSvg = require('postcss-inline-svg');
const notify = require('gulp-notify');
const plumber = require('gulp-plumber');
// Configs, BrowserSync
const { mode, config } = require('../project.config');
const { server, stream } = require('./server');
const postcssConfig = require('../postcss.config.js');

sass.compiler = require('node-sass');

/**
 * CSS: App
 */
const appStyles = () => {
  return src(['src/scss/app.scss'])
    .pipe(
      plumber({ errorHandler: notify.onError('Error: <%= error.message %>') })
    )
    .pipe(gulpif(mode.is('dev'), sourcemaps.init()))
    .pipe(sass({ outputStyle: 'expanded' }).on('error', sass.logError))
    .pipe(cssimport({ includePaths: ['./node_modules/'] }))
    .pipe(postcss(postcssConfig[mode()].plugins))
    .pipe(gulpif(mode.is('dev'), sourcemaps.write()))
    .pipe(
      rename({
        basename: 'app',
        suffix: mode.is('prod') ? '.min' : '',
        extname: '.css',
      })
    )
    .pipe(
      dest(
        mode.is('dev')
          ? `src/${config.development.readyCssDir}`
          : 'build/css'
      )
    )
    .pipe(gulpif(mode.is('dev'), stream()));
};

/**
 * CSS: Libs
 */
const vendorStyles = () => {
  return src('src/scss/vendors/vendors.scss')
    .pipe(
      plumber({ errorHandler: notify.onError('Error: <%= error.message %>') })
    )
    .pipe(gulpif(mode.is('dev'), sourcemaps.init()))
    .pipe(sass({ outputStyle: 'expanded' }).on('error', sass.logError))
    .pipe(cssimport({ includePaths: ['./node_modules/'] }))
    .pipe(postcss(postcssConfig[mode()].plugins))
    .pipe(gulpif(mode.is('dev'), sourcemaps.write()))
    .pipe(
      rename({
        basename: 'vendors~app',
        suffix: mode.is('prod') ? '.min' : '',
        extname: '.css',
      })
    )
    .pipe(
      dest(
        mode.is('dev')
          ? `src/${config.development.readyCssDir}`
          : 'build/css'
      )
    )
    .pipe(gulpif(mode.is('dev'), stream()));
};

/**
 * Generate header-styles to "src/css/header~app.min.css"
 * (normalizer, bootstrap-grid)
 * Settings: "src/scss/utils/_variables.scss"
 */
const headerStyles = () => {
  return src('src/scss/base/header-styles.scss')
    .pipe(
      plumber({ errorHandler: notify.onError('Error: <%= error.message %>') })
    )
    .pipe(sass())
    .pipe(cssimport({ includePaths: ['./node_modules/'] }))
    .pipe(postcss(postcssConfig.production.plugins))
    .pipe(
      rename({
        basename: 'header~app',
        suffix: '.min',
        extname: '.css',
      })
    )
    .pipe(dest(`src/${config.development.readyCssDir}`));
};

module.exports = {
  appStyles,
  vendorStyles,
  headerStyles,
};
