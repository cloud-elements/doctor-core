const {type} = require('ramda');
const loadAccount = require('../core/accounts/loadAccount');
const {startSpinner, stopSpinner} = require('../utils/spinner');
const {removeCancelledJobId} = require('../events/cancelled-job');
const {logDebug, logError} = require('../utils/logger');
const deleteCommonResources = require('../core/commonResources/removeCommonResources');
const deleteVdrs = require('../core/commonResources/removeCommonResources');
const deleteFormulaInstances = require('../core/formulaInstances/removeFormulaInstances');
const deleteInstances = require('../core/elementInstances/removeInstances');
const deleteElements = require('../core/elements/removeElements');
const deleteFormulas = require('../core/formulas/removeFormulas');
const deleteSpecificElement = require('../core/elements/removeElement');
const deleteSpecificFormula = require('../core/formulas/removeFormula');
const deleteSpecificVdr = require('../core/commonResources/removeCommonResource');
const deleteSpecificCommonResource = require('../core/commonResources/removeCommonResource');

const clearCancelledJobId = jobId => jobId && removeCancelledJobId(jobId);

const deleteOperationsObject = {
  commonResources: deleteCommonResources,
  vdrs: deleteVdrs,
  formulaInstances: deleteFormulaInstances,
  instances: deleteInstances,
  elements: deleteElements,
  formulas: deleteFormulas,
};

const deleteSpecificOperationsObject = {
  elements: deleteSpecificElement,
  formulas: deleteSpecificFormula,
  vdrs: deleteSpecificVdr,
  commonResources: deleteSpecificCommonResource,
};

const validateObject = (object, deleteOperationsObject) => {
  if (!deleteOperationsObject[object]) {
    logDebug(`Command not found: ${object}`);
    throw new Error(`Command not found: ${object}`);
  }
};

module.exports = async (assetType, account, options) => {
  try {
    logDebug(`Starting executing specified operation on core for asset type: ${assetType}`);
    await startSpinner();
    account = await loadAccount(account);
    if (options.name !== undefined && type(options.name) !== 'Function') {
      validateObject(assetType, deleteSpecificOperationsObject);
      await deleteSpecificOperationsObject[assetType](account, options);
    } else {
      validateObject(assetType, deleteOperationsObject);
      await deleteOperationsObject[assetType](account, ...options);
    }
  } catch (error) {
    logError(`An error occured during export operation for asset type: ${assetType}, error: ${error.message}`);
    throw error;
  } finally {
    logDebug(`Successfully completed specified operation on core for asset type: ${assetType}`);
    clearCancelledJobId(options.jobId);
    await stopSpinner();
  }
};
