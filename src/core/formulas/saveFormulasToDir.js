/* istanbul ignore file */
const {existsSync} = require('fs');
const fsExtra = require('fs-extra');
const {forEach, map, dissoc, omit, when, dissocPath, pipe, tap} = require('ramda');
const {toDirectoryName} = require('../../utils/regex');
const {logError} = require('../../utils/logger');

const cleanFormula = formula => {
  const result = omit(['accountId', 'userId', 'createdDate'])(formula);
  result.configuration = map(dissoc('id'))(formula.configuration);
  result.triggers = map(dissoc('id'))(formula.triggers);
  result.steps = map(dissoc('id'))(formula.steps);
  if (formula.subFormulas) {
    result.subFormulas = map(cleanFormula)(formula.subFormulas);
  }
  return result;
};

module.exports = async (dir, data) => {
  try {
    let formulas = data;
    formulas = map(cleanFormula)(formulas);
    if (!existsSync(dir)) {
      fsExtra.ensureDirSync(dir);
    }
    forEach(async formula => {
      try {
        const formulaFolder = `${dir}/${toDirectoryName(formula.name)}`;
        if (!existsSync(formulaFolder)) {
          fsExtra.ensureDirSync(formulaFolder);
        }
        formula.steps = map(
          when(
            s => s.type === 'filter' || s.type === 'script',
            pipe(
              tap(s =>
                fsExtra.outputFileSync(`${formulaFolder}/${toDirectoryName(s.name)}.js`, s.properties.body, 'utf8'),
              ),
              dissocPath(['properties', 'body']),
            ),
          ),
        )(formula.steps);
        fsExtra.outputFileSync(`${formulaFolder}/formula.json`, JSON.stringify(formula), 'utf8');
      } catch (error) {
        logError(`Failed to save data into formula file: ${dir}`);
        throw error;
      }
    })(formulas);
  } catch (error) {
    logError(`Failed to save data into directory: ${dir}`);
    throw error;
  }
};
