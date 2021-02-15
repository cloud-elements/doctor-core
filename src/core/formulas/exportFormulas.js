const {pipe, prop, isNil, not} = require('ramda');
const getFormulas = require('./getFormulas');
const saveToFile = require('../../utils/saveToFile');
const saveToFolder = require('./saveFormulasToDir');
const {logDebug} = require('../../utils/logger');

module.exports = async params => {
  try {
    const formulasDataToExport = await getFormulas(
      pipe(prop('account'))(params),
      pipe(prop('options'), prop('name'))(params),
      pipe(prop('options'), prop('jobId'))(params),
      pipe(prop('options'), prop('processId'))(params),
      pipe(prop('options'), prop('jobType'))(params),
    );
    if (pipe(prop('options'), prop('file'), isNil, not)(params)) {
      await saveToFile(pipe(prop('options'), prop('file'))(params), formulasDataToExport);
    } else if (pipe(prop('options'), prop('dir'), isNil, not)(params)) {
      await saveToFolder(pipe(prop('options'), prop('dir'))(params), formulasDataToExport);
    }
  } catch (error) {
    logDebug(`Failed to complete formula operation: ${error.message}`);
    throw error;
  }
};
