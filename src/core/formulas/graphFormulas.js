const {existsSync} = require('fs');
const {dirname} = require('path');
const readFile = require('../../utils/readFile');
const graphFormula = require('./generateFormulaFlowchart');
const {logDebug} = require('../../utils/logger');

const readFormula = async formulaFile => {
  if (!existsSync(formulaFile)) {
    logDebug(`Formula file does not exist: ${formulaFile}`);
    return;
  }
  // eslint-disable-next-line consistent-return
  return await readFile(formulaFile);
};
// (fileName)
module.exports = async parms => {
  if (parms.file) {
    const formula = await readFormula(parms.file);
    const formulaDirName = dirname(parms.file);

    if (formula instanceof Array) {
      logDebug('Error: graph function expects file content to be only one formula.');
      return;
    }
    await graphFormula(formula, formulaDirName);
  }
};
