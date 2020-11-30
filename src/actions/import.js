'use strict';
require('log-prefix')(() => `[${new Date().toISOString()}] Doctor-core: %s`);
const loadAccount = require('../util/loadAccount');
const {startSpinner, stopSpinner} = require('../util/spinner');
const eventListener = require('../events/event-listener');
const {removeCancelledJobId} = require('../events/cancelled-job');
const logDebug = require('../util/logger');
const clearCancelledJobId = (jobId) => jobId && removeCancelledJobId(jobId);

const functions = {
  vdrs: require('../core/vdrs/upload/uploadMultipleVdrs'),
  formulas: require('../core/importFormulas'),
  elements: require('../core/importElements'),
  all: require('../core/importBackup'),
};

module.exports = async (object, account, options) => {
  try {
    await startSpinner();
    await loadAccount(account);
    if (!options.file && !options.dir) {
      logDebug('Please specify a file or directory to save with -f / -d');
      process.exit(1);
    } else if (!functions[object]) {
      logDebug(`Command not found: ${object}`);
      process.exit(1);
    }
    eventListener.addListener();
    await functions[object](options);
    clearCancelledJobId(options.jobId)
    await stopSpinner();
  } catch (err) {
    clearCancelledJobId(options.jobId)
    await stopSpinner();
    throw err;
  }
};
