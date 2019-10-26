const { src, dest } = require('gulp');

/**
 * Copy rest from "src/" to "build/"
 */
const copyRootOther = () => {
  return src([
    'src/*.*',
    'src/.*',
    '!src/index.html',
    '!src/404.html',
    '!src/index.php',
    '!src/404.php',
  ])
    .pipe(dest('build'))
};

module.exports = {
  copyRootOther,
};
