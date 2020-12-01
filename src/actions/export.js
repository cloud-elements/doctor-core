'use strict';
const loadAccount = require('../util/loadAccount');
const { startSpinner, stopSpinner } = require('../util/spinner');
const eventListener = require('../events/event-listener');
const { removeCancelledJobId } = require('../events/cancelled-job');
const { logDebug } = require('../util/logger');
const clearCancelledJobId = (jobId) => jobId && removeCancelledJobId(jobId);

const functions = {
  vdrs: require('../core/vdrs/download/downloadVdrs'),
  formulas: require('../core/saveFormulas'),
  elements: require('../core/elements/saveElements'),
  all: require('../core/saveAll'),
};

module.exports = async (object, account, options) => {
  try {
    await startSpinner();
    await loadAccount(account);
    if (!options.file && !options.dir) {
      logDebug('Please specify a file to save with -f or a directory to save with -d');
      process.exit(1);
    } else if (!functions[object]) {
      logDebug(`Command not found: ${object}`);
      process.exit(1);
    }
    eventListener.addListener();
    await functions[object]({ object, options });
    clearCancelledJobId(options.jobId)
    await stopSpinner();
  } catch (err) {
    clearCancelledJobId(options.jobId)
    await stopSpinner();
    throw err;
  }
};
