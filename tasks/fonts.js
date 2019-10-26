const { src, dest } = require('gulp');

/**
 * Copy fonts from "src/" to "build/"
 */
const copyFonts = () => {
  return src(['src/fonts/**/*'])
    .pipe(dest('build/fonts'))
};

module.exports = {
  copyFonts,
};