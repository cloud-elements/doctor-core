const {pipeP, __} = require('ramda');
const getDataToExport = require('../../utils/getDataToExport');
const getFormulas = require('./getFormulas');
const applyVersion = require('../../utils/applyVersion');
const saveToFile = require('../../utils/saveToFile');
const saveToDir = require('./saveFormulasToDir');
const saveTo = require('../../utils/saveTo');
const {logDebug} = require('../../utils/logger');

module.exports = params => {
  try {
    if (Object.prototype.hasOwnProperty.call(params.options, 'version')) {
      params.options.name = `${params.options.name}_${params.options.version}`;
    }
    return saveTo(pipeP(getDataToExport(getFormulas), applyVersion(__, params)), saveToFile, saveToDir)(params);
  } catch (error) {
    /* istanbul ignore next */
    logDebug(`Failed to complete formula operation: ${error.message}`);
    /* istanbul ignore next */
    throw error;
  }
};
