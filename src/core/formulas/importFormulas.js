/* eslint-disable no-unused-expressions */
const {pipe, prop, isNil, not, type, equals, isEmpty, toLower, find, any, curry} = require('ramda');
const readFile = require('../../utils/readFile');
const readFormulasFromDir = require('./readFormulasFromDir');
const createFormulas = require('./createFormulas');
const {logDebug, logError} = require('../../utils/logger');

const isNilOrEmpty = val => isNil(val) || isEmpty(val);

const importFormulas = curry(async (formulas, account, options) => {
  const {name, jobId, processId} = options;
  try {
    // From CLI - User can pass comma seperated string of formula name
    // From Service - It will be in Array of objects containing formula name
    let formulasToImport = [];
    if (!isNilOrEmpty(name) && !equals(type(name), 'Function')) {
      const formulaNames = Array.isArray(name) ? name.map(formulaName => formulaName.name) : name.split(',');
      formulaNames.forEach(formulaName => {
        const formulaToImport = find(formula => toLower(formula.name) === toLower(formulaName))(formulas);
        if (isNilOrEmpty(formulaToImport)) {
          logDebug(`The doctor was unable to find the formula ${formulaName}.`);
        } else if (any(step => step.type === 'formula')(formulaToImport.steps)) {
          logDebug(
            `You are trying to import a formula (${formulaName}) that has a sub formula. Please make sure to import all formulas.`,
          );
          formulasToImport.push(formulaToImport);
        } else {
          formulasToImport.push(formulaToImport);
        }
      });
    }
    formulasToImport = isNilOrEmpty(formulasToImport) ? formulas : formulasToImport;
    await createFormulas(account, formulasToImport, jobId, processId);
  } catch (error) {
    logError(`Failed to import formulas ${error}`, jobId);
    throw error;
  }
});

module.exports = async (account, options) => {
  try {
    let formulasDataToImport;
    if (pipe(prop('file'), isNil, not)(options)) {
      formulasDataToImport = await readFile(options.file);
    } else if (pipe(prop('dir'), isNil, not)(options)) {
      formulasDataToImport = await readFormulasFromDir(options.dir);
    }
    if (isNilOrEmpty(formulasDataToImport)) {
      logError(`No formulas found for import operation`);
      return;
    }
    if (pipe(type, equals('Object')) && pipe(prop('formulas'), isNil, not)(formulasDataToImport)) {
      /* istanbul ignore next */
      await importFormulas(pipe(prop('formulas'))(formulasDataToImport), account, options);
    } else if (pipe(type, equals('Array'))(formulasDataToImport)) {
      await importFormulas(formulasDataToImport, account, options);
    }
  } catch (error) {
    logError(`Failed to complete formula operation: ${error.message}`, options && options.jobId);
    throw error;
  }
};
