const {pipe, pipeP, cond, prop, isNil, not, useWith} = require('ramda');
const importElements = require('../core/elements/importElements');
const importVdrs = require('../core/vdrs/uploadMultipleVdrs');
const importFormulas = require('../core/formulas/importFormulas');
const createObjectDefinitions = require('../core/commonResources/createObjectDefinitions');
const createTransformations = require('../core/commonResources/createTransformations');
const createFormulas = require('../core/formulas/createFormulas');
const createElements = require('../core/elements/createElements');
const readFile = require('./readFile');

const importBackupFromFile = async fileData => {
  await createElements(fileData.elements);
  createObjectDefinitions(fileData).then(() => {
    createTransformations(fileData);
  });
  await createFormulas(fileData.formulas);
};

const importBackupFromDir = async parms => {
  await importElements({...parms, dir: `${parms.dir}/elements`});
  await importVdrs({...parms, dir: `${parms.dir}/vdrs`});
  await importFormulas({...parms, dir: `${parms.dir}/formulas`});
};

module.exports = cond([
  [pipe(prop('file'), isNil, not), pipeP(useWith(readFile, [prop('file')]), importBackupFromFile)],
  [pipe(prop('dir'), isNil, not), importBackupFromDir],
]);
