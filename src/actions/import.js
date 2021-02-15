const loadAccount = require('../core/accounts/loadAccount');
const {startSpinner, stopSpinner} = require('../utils/spinner');
const eventListener = require('../events/event-listener');
const {removeCancelledJobId} = require('../events/cancelled-job');
const {logDebug, logError} = require('../utils/logger');
const importVdrs = require('../core/vdrs/importVdrs');
const importFormulas = require('../core/formulas/importFormulas');
const importElements = require('../core/elements/importElements');
const importAll = require('../utils/importBackup');

const clearCancelledJobId = (jobId) => jobId && removeCancelledJobId(jobId);

const importByAssetType = {
  vdrs: importVdrs,
  formulas: importFormulas,
  elements: importElements,
  all: importAll,
};

module.exports = async (assetType, account, options) => {
  try {
    logDebug(`Starting executing specified operation on core for asset type: ${assetType}`);
    await startSpinner();
    account = await loadAccount(account);
    if (!options.file && !options.dir) {
      logDebug('Please specify a file or directory to save with -f / -d');
      throw new Error(`Command not found: ${assetType}`);
    } else if (!importByAssetType[assetType]) {
      logDebug(`Command not found: ${assetType}`);
      throw new Error(`Command not found: ${assetType}`);
    }
    eventListener.addListener();
    await importByAssetType[assetType](account, options);
  } catch (error) {
    logError(`An error occured during export operation for asset type: ${assetType}, error: ${error.message}`);
    throw error;
  } finally {
    logDebug(`Successfully completed specified operation on core for asset type: ${assetType}`);
    clearCancelledJobId(options.jobId);
    await stopSpinner();
  }
};
