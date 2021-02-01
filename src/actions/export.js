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

const exportByAssetType = {
  vdrs: exportVdrs,
  formulas: exportFormulas,
  elements: exportElements,
  all: exportAll,
};

module.exports = async (assetType, account, options) => {
  try {
    await startSpinner();
    await loadAccount(account);
    if (!options.file && !options.dir) {
      logDebug('Please specify a file to save with -f or a directory to save with -d');
      throw new Error('Please specify a file to save with -f or a directory to save with -d');
    } else if (!exportByAssetType[assetType]) {
      logDebug(`Command not found: ${assetType}`);
      throw new Error(`Command not found: ${assetType}`);
    }
    eventListener.addListener();
    await exportByAssetType[assetType]({assetType, options});
    clearCancelledJobId(options.jobId);
    await stopSpinner();
  } catch (err) {
    clearCancelledJobId(options.jobId);
    await stopSpinner();
    throw err;
  }
};
