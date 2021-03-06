const {pipe, prop, isNil, not} = require('ramda');
const getVdrs = require('./getVdrs');
const saveToFile = require('../../utils/saveToFile');
const {saveVdrsToDirNew, saveVdrsToDirOld} = require('./saveVdrsToDir');
const {logError} = require('../../utils/logger');

module.exports = async params => {
  try {
    const saveToFolder = Object.prototype.hasOwnProperty.call(params.options, 'useNew')
      ? saveVdrsToDirNew
      : saveVdrsToDirOld;
    const vdrsDataToExport = await getVdrs(
      pipe(prop('account'))(params),
      pipe(prop('options'), prop('name'))(params),
      pipe(prop('options'), prop('jobId'))(params),
      pipe(prop('options'), prop('processId'))(params),
      pipe(prop('options'), prop('jobType'))(params),
    );
    if (pipe(prop('options'), prop('file'), isNil, not)(params)) {
      await saveToFile(pipe(prop('options'), prop('file'))(params), vdrsDataToExport);
    } else if (pipe(prop('options'), prop('dir'), isNil, not)(params)) {
      await saveToFolder(pipe(prop('options'), prop('dir'))(params), vdrsDataToExport);
    }
  } catch (error) {
    logError(`Failed to complete VDR operation: ${error.message}`);
    throw error;
  }
};
