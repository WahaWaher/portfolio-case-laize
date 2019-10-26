const { src, dest } = require('gulp');
const gulpif = require('gulp-if');
const imagemin = require('gulp-imagemin');
const rename = require('gulp-rename');
const imageResize = require('gulp-image-resize');
const ico = require('gulp-to-ico');
const svgSprite = require('gulp-svg-sprites');
const svgmin = require('gulp-svgmin');
const cheerio = require('gulp-cheerio');
const htmlbeautify = require('gulp-html-beautify');
// Configs
const { mode, config } = require('../project.config');

/**
 * Сopy/Сompress images from "src/img/" to "build/img/"
 */
const images = () => {
  return src('src/img/**/*')
    .pipe(
      gulpif(
        config[mode()].compressImg,
        imagemin(
          [
            imagemin.gifsicle({ interlaced: true }),
            imagemin.jpegtran({ progressive: true }),
            imagemin.optipng({ optimizationLevel: 5 }),
            imagemin.svgo({
              plugins: [{ removeViewBox: true }, { cleanupIDs: false }],
            }),
          ],
          { verbose: true }
        )
      )
    )
    .pipe(dest('build/img'));
};

/**
 * Favicon generation
 */
const genFavicons = () => {
  return src('src/img/favicon/original.png')
    .pipe(imageResize({ width: 114, height: 114 }))
    .pipe(rename('apple-touch-icon-114x114.png'))
    .pipe(dest('src/img/favicon/'))

    .pipe(imageResize({ width: 72, height: 72 }))
    .pipe(rename('apple-touch-icon-72x72.png'))
    .pipe(dest('src/img/favicon/'))

    .pipe(imageResize({ width: 57, height: 57 }))
    .pipe(rename('apple-touch-icon.png'))
    .pipe(dest('src/img/favicon/'))

    .pipe(ico('favicon.ico', { resize: true, sizes: [32, 32] }))
    .pipe(dest('src/'));
};

/**
 * SVG-sprite generation
 */
const genSprite = () => {
  return src('src/svg/app-sprite-icons/*.svg')
    .pipe(svgmin({ js2svg: { pretty: true } }))
    .pipe(
      svgSprite({
        mode: 'symbols',
        preview: false,
        selector: '%f',
        svg: {
          symbols: 'app-sprite.svg',
        },
      })
    )
    .pipe(
      cheerio({
        run: function($) {
          $('svg')
            .removeAttr('style')
            .removeAttr('width')
            .removeAttr('height')
            .css('display', 'none');
          $('[fill]').removeAttr('fill');
        },
        parserOptions: { xmlMode: true },
      })
    )
    .pipe(
      htmlbeautify({
        indent_size: 2,
        indent_char: ' ',
        preserve_newlines: true,
      })
    )
    .pipe(dest(mode.is('dev') ? 'src/svg/' : 'build/svg/'));
};

/**
 * Сopy/Сompress svg to "build/svg/"
 */
const copySVG = () => {
  return src([
    'src/svg/**/*.svg',
    '!src/svg/app-sprite.svg',
    '!src/svg/app-sprite-icons/**/*',
  ]).pipe(dest('build/svg/'));
};

module.exports = {
  images,
  genFavicons,
  genSprite,
  copySVG,
};
