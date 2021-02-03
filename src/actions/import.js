const loadAccount = require('../core/accounts/loadAccount');
const {startSpinner, stopSpinner} = require('../utils/spinner');
const eventListener = require('../events/event-listener');
const {removeCancelledJobId} = require('../events/cancelled-job');
const {logDebug} = require('../utils/logger');
const importVdrs = require('../core/vdrs/uploadMultipleVdrs');
const importFormulas = require('../core/formulas/importFormulas');
const importElements = require('../core/elements/importElements');
const importAll = require('../utils/importBackup');

const clearCancelledJobId = jobId => jobId && removeCancelledJobId(jobId);

const importByAssetType = {
  vdrs: importVdrs,
  formulas: importFormulas,
  elements: importElements,
  all: importAll,
};

module.exports = async (assetType, account, options) => {
  try {
    await startSpinner();
    await loadAccount(account);
    if (!options.file && !options.dir) {
      logDebug('Please specify a file or directory to save with -f / -d');
      throw new Error(`Command not found: ${assetType}`);
    } else if (!importByAssetType[assetType]) {
      logDebug(`Command not found: ${assetType}`);
      throw new Error(`Command not found: ${assetType}`);
    }
    eventListener.addListener();
    await importByAssetType[assetType](options);
    clearCancelledJobId(options.jobId);
    await stopSpinner();
  } catch (err) {
    clearCancelledJobId(options.jobId);
    await stopSpinner();
    throw err;
  }
};
