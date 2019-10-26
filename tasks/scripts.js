const { src, dest } = require('gulp');
const gulpif = require('gulp-if');
const webpack = require('webpack-stream');
const uglify = require('gulp-uglify');
const concat = require('gulp-concat');
const rename = require('gulp-rename');
const fs = require('fs');
const importFresh = require('import-fresh');
// Configs
const { mode, config } = require('../project.config');

const getVendors = () => {
  let vendors;
  try {
    vendors = importFresh('../src/js/vendors.list.js');
    if (vendors.length <= 0) vendors = false;
  } catch (err) {
    vendors = false;
  }
  return vendors;
};

/**
 * JS All (webpack mode)
 */
const scriptsWebpack = () => {
  return src('src/js/app.js')
    .pipe(
      webpack(
        mode.is('prod')
          ? require('../webpack.build.config')
          : require('../webpack.dev.config')
      )
    )
    .pipe(dest('./'));
};

/**
 * JS App (native mode)
 */
const scriptsNativeApp = () => {
  return src('src/js/app.js')
    .pipe(gulpif(mode.is('prod'), uglify()))
    .pipe(gulpif(mode.is('prod'), rename({ suffix: '.min' })))
    .pipe(dest('./build/js'));
};

/**
 * JS Libs (native mode)
 */
const scriptsNativeLibs = () => {
  let vendors = getVendors();

  if (!vendors && mode.is('dev')) {
    fs.writeFileSync('src/js/vendors~app.js', '');
  }

  return src(vendors || ['./*', '!./*'], { allowEmpty: true })
    .pipe(concat('vendors~app.js'))
    .pipe(gulpif(mode.is('prod'), uglify()))
    .pipe(gulpif(mode.is('prod'), rename({ suffix: '.min' })))
    .pipe(dest(mode.is('dev') ? 'src/js' : 'build/js'))
    .on('end', () => {
      if (!vendors && mode.is('prod')) {
        fs.access('build/js', err => {
          if (err)
            fs.mkdir('build/js', () => {
              fs.writeFile('build/js/vendors~app.js', '', err => {});
            });
        });
      }
    });
};

module.exports = {
  scriptsWebpack,
  scriptsNativeApp,
  scriptsNativeLibs,
};
