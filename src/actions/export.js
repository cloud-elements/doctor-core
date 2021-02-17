const loadAccount = require('../core/accounts/loadAccount');
const {startSpinner, stopSpinner} = require('../utils/spinner');
const eventListener = require('../events/event-listener');
const {removeCancelledJobId} = require('../events/cancelled-job');
const {logDebug, logError} = require('../utils/logger');
const exportVdrs = require('../core/vdrs/exportVdrs');
const exportFormulas = require('../core/formulas/exportFormulas');
const exportElements = require('../core/elements/exportElements');
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
    logDebug(`Starting executing specified operation on core for asset type: ${assetType}`);
    await startSpinner();
    account = await loadAccount(account);
    if (!options.file && !options.dir) {
      logDebug('Please specify a file to save with -f or a directory to save with -d');
      throw new Error('Please specify a file to save with -f or a directory to save with -d');
    } else if (!exportByAssetType[assetType]) {
      logDebug(`Command not found: ${assetType}`);
      throw new Error(`Command not found: ${assetType}`);
    }
    eventListener.addListener();
    await exportByAssetType[assetType]({account, assetType, options});
  } catch (error) {
    logError(`An error occured during export operation for asset type: ${assetType}, error: ${error.message}`);
    throw error;
  } finally {
    logDebug(`Successfully completed specified operation on core for asset type: ${assetType}`);
    clearCancelledJobId(options.jobId);
    await stopSpinner();
  }
};
