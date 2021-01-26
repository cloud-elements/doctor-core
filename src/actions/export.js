const loadAccount = require('../core/accounts/loadAccount');
const {startSpinner, stopSpinner} = require('../utils/spinner');
const eventListener = require('../events/event-listener');
const {removeCancelledJobId} = require('../events/cancelled-job');
const {logDebug} = require('../utils/logger');
const exportVdrs = require('../core/vdrs/downloadVdrs');
const exportFormulas = require('../core/formulas/saveFormulas');
const exportElements = require('../core/elements/saveElements');
const exportAll = require('../utils/saveAll');

const clearCancelledJobId = jobId => jobId && removeCancelledJobId(jobId);

const exportOperationsObject = {
  vdrs: exportVdrs,
  formulas: exportFormulas,
  elements: exportElements,
  all: exportAll,
};

module.exports = async (object, account, options) => {
  try {
    await startSpinner();
    await loadAccount(account);
    if (!options.file && !options.dir) {
      logDebug('Please specify a file to save with -f or a directory to save with -d');
      throw new Error('Please specify a file to save with -f or a directory to save with -d');
    } else if (!exportOperationsObject[object]) {
      logDebug(`Command not found: ${object}`);
      throw new Error(`Command not found: ${object}`);
    }
    eventListener.addListener();
    await exportOperationsObject[object]({object, options});
    clearCancelledJobId(options.jobId);
    await stopSpinner();
  } catch (err) {
    clearCancelledJobId(options.jobId);
    await stopSpinner();
    throw err;
  }
};
