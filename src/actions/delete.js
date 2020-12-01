'use strict';
const { type } = require('ramda');
const loadAccount = require('../util/loadAccount');
const { startSpinner, stopSpinner } = require('../util/spinner');
const { removeCancelledJobId } = require('../events/cancelled-job');
const { logDebug } = require('../util/logger');
const clearCancelledJobId = (jobId) => jobId && removeCancelledJobId(jobId);

const functions = {
  commonResources: require('../core/removeCommonResources'),
  vdrs: require('../core/removeCommonResources'),
  formulaInstances: require('../core/removeFormulaInstances'),
  instances: require('../core/removeInstances'),
  elements: require('../core/elements/removeElements'),
  formulas: require('../core/removeFormulas'),
};

const specificFunctions = {
  elements: require('../core/elements/removeElement'),
  formulas: require('../core/removeFormula'),
  vdrs: require('../core/removeCommonResource'),
  commonResources: require('../core/removeCommonResource'),
};

const validateObject = (object, functions) => {
  if (!functions[object]) {
    logDebug(`Command not found: ${object}`);
    process.exit(1);
  }
};

module.exports = async (object, account, options) => {
  await loadAccount(account);
  try {
    await startSpinner();
    if (options.name !== undefined && type(options.name) !== 'Function') {
      validateObject(object, specificFunctions);
      await specificFunctions[object](options);
    } else {
      validateObject(object, functions);
      await functions[object]();
    }
    clearCancelledJobId(options.jobId)
    await stopSpinner();
  } catch (err) {
    clearCancelledJobId(options.jobId)
    await stopSpinner();
    throw err;
  }
};
