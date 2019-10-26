const { src } = require('gulp');
const del = require('del');
// Configs
const { mode, config } = require('../project.config');
const { readyJsDir, readyCssDir } = config.development;

/**
 * Remove all from "build"
 */
const cleanBuild = () => del('build/**/*');

/**
 * Remove all from "src/css"
 */
const cleanCssSrc = () => del(`src/${readyCssDir}/**/*`);

/**
 * Remove all from "src/js/<readyJsDir>"
 */
const cleanJsSrc = () => del(`src/${readyJsDir}/**/*`);

module.exports = {
  cleanBuild,
  cleanCssSrc,
  cleanJsSrc,
};
