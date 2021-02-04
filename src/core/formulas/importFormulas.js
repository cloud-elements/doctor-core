/* eslint-disable no-unused-expressions */
const {
  pipe,
  pipeP,
  cond,
  prop,
  isNil,
  not,
  useWith,
  type,
  equals,
  __,
  isEmpty,
  toLower,
  find,
  any,
  curry,
} = require('ramda');
const readFile = require('../../utils/readFile');
const applyVersion = require('../../utils/applyVersion');
const buildFormulasFromDir = require('./buildFormulasFromDir');
const createFormulas = require('./createFormulas');
const {logDebug, logError} = require('../../utils/logger');

const isNilOrEmpty = val => isNil(val) || isEmpty(val);

const importFormulas = curry(async (formulas, account, options) => {
  try {
    // From CLI - User can pass comma seperated string of formula name
    // From Service - It will be in Array of objects containing formula name
    let formulasToImport = [];
    if (!isNilOrEmpty(options.name) && !equals(type(options.name), 'Function')) {
      const formulaNames = Array.isArray(options.name)
        ? options.name.map(formulaName => formulaName.name)
        : options.name.split(',');
      formulaNames &&
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
    await createFormulas(account, formulasToImport, options.jobId, options.processId);
  } catch (error) {
    logError('Failed to import formulas');
    throw error;
  }
});

module.exports = (account, options) => {
  try {
    return cond([
      [
        pipe(prop('file'), isNil, not),
        pipeP(
          pipeP(useWith(readFile, [prop('file')]), applyVersion(__, options)),
          cond([
            [
              pipe(type, equals('Object')) && pipe(prop('formulas'), isNil, not),
              pipe(prop('formulas'), importFormulas(__, account, options)),
            ],
            [pipe(type, equals('Array')), importFormulas(__, account, options)],
          ]),
        ),
      ],
      [
        pipe(prop('dir'), isNil, not),
        pipeP(
          useWith(buildFormulasFromDir, [prop('dir')]),
          applyVersion(__, options),
          importFormulas(__, account, options),
        ),
      ],
    ])(options);
  } catch (error) {
    /* istanbul ignore next */
    logError(`Failed to complete formula operation: ${error.message}`);
    /* istanbul ignore next */
    throw error;
  }
};
