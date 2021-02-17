/* istanbul ignore file */
const fs = require('fs');
const {logDebug} = require('./logger');

module.exports = async fileName => {
  if (!fs.existsSync(fileName)) {
    logDebug(`No such file or directory found for the path: ${fileName}`);
    return null;
  }
  return new Promise(resolve => resolve(JSON.parse(fs.readFileSync(fileName))));
};
