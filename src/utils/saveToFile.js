/* istanbul ignore file */
const {curry} = require('ramda');
const fsExtra = require('fs-extra');
const {logDebug} = require('./logger');

module.exports = curry(async (fileName, data) => {
  try {
    fsExtra.outputFileSync(fileName, JSON.stringify(await data), 'utf8');
  } catch (error) {
    logDebug(`Failed to save data into file: ${fileName}`);
    throw error;
  }
});
