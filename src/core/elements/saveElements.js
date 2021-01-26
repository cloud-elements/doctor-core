const getDataToExport = require('../../utils/getDataToExport');
const getElements = require('./getElements');
const saveToFile = require('../../utils/saveToFile');
const saveToDir = require('./saveElementsToDir');
const saveTo = require('../../utils/saveTo');
const {logDebug} = require('../../utils/logger');

module.exports = params => {
  try {
    return saveTo(getDataToExport(getElements), saveToFile, saveToDir)(params);
  } catch (error) {
    /* istanbul ignore next */
    logDebug(`Failed to complete element operation: ${error.message}`);
    /* istanbul ignore next */
    throw error;
  }
};
