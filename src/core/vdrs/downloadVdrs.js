const {pipeP, __} = require('ramda');
const getData = require('./getVdrs');
const applyVersion = require('../../utils/applyVersion');
const saveTo = require('../../utils/saveTo');
const saveToFile = require('../../utils/saveToFile');
const {saveVdrsToDirNew, saveVdrsToDirOld} = require('./saveVdrsToDir');
const {logDebug} = require('../../utils/logger');

module.exports = params => {
  try {
    const saveToFolder = Object.hasOwnProperty(params.options, 'useNew')
      ? saveVdrsToDirNew
      : saveVdrsToDirOld;
    if (Object.hasOwnProperty(params.options, 'version')) {
      params.options.name = `${params.options.name}_${params.options.version}`;
    }
    return saveTo(pipeP(getData, applyVersion(__, params)), saveToFile, saveToFolder)(params);
  } catch (error) {
    /* istanbul ignore next */

    logDebug(`Failed to complete VDR operation: ${error.message}`);
    /* istanbul ignore next */
    throw error;
  }
};
