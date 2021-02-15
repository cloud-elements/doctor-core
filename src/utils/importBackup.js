const {cond, curry, isNil, not, pipe, pipeP, prop, useWith} = require('ramda');
const importElements = require('../core/elements/importElements');
const importVdrs = require('../core/vdrs/importVdrs');
const importFormulas = require('../core/formulas/importFormulas');
const createObjectDefinitions = require('../core/commonResources/createObjectDefinitions');
const createTransformations = require('../core/commonResources/createTransformations');
const createFormulas = require('../core/formulas/createFormulas');
const createElements = require('../core/elements/createElements');
const readFile = require('./readFile');

const importBackupFromFile = async (account, fileData) => {
  await createElements(account, fileData.elements);
  createObjectDefinitions(fileData, account).then(() => {
    createTransformations(fileData, account);
  });
  await createFormulas(account, fileData.formulas);
};

const importBackupFromDir = async (account, params) => {
  await importElements(account, {...params, dir: `${params.dir}/elements`});
  await importVdrs(account, {...params, dir: `${params.dir}/vdrs`});
  await importFormulas(account, {...params, dir: `${params.dir}/formulas`});
};

module.exports = (account, options) => {
  cond([
    [pipe(prop('file'), isNil, not), pipeP(useWith(readFile, [prop('file')]), curry(importBackupFromFile)(account))],
    [pipe(prop('dir'), isNil, not), curry(importBackupFromDir)(account)],
  ])(options);
};
