const {pipe, prop, isNil, not} = require('ramda');
const getElements = require('./getElements');
const saveToFile = require('../../utils/saveToFile');
const saveToFolder = require('./saveElementsToDir');
const {logDebug} = require('../../utils/logger');

module.exports = async params => {
  try {
    const elementsDataToExport = await getElements(
      pipe(prop('account'))(params),
      pipe(prop('options'), prop('name'))(params),
      pipe(prop('options'), prop('jobId'))(params),
      pipe(prop('options'), prop('processId'))(params),
      pipe(prop('options'), prop('jobType'))(params),
    );
    if (pipe(prop('options'), prop('file'), isNil, not)(params)) {
      await saveToFile(pipe(prop('options'), prop('file'))(params), elementsDataToExport);
    } else if (pipe(prop('options'), prop('dir'), isNil, not)(params)) {
      await saveToFolder(pipe(prop('options'), prop('dir'))(params), elementsDataToExport);
    }
  } catch (error) {
    logDebug(`Failed to complete element operation: ${error.message}`);
    throw error;
  }
};
