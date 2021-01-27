/* istanbul ignore file */
const {existsSync} = require('fs');
const fsExtra = require('fs-extra');
const saveElementsToDir = require('../core/elements/saveElementsToDir');
const {saveVdrsToDirOld} = require('../core/vdrs/saveVdrsToDir');
const saveFormulasToDir = require('../core/formulas/saveFormulasToDir');

module.exports = async (dir, dataPromise) => {
  const data = await dataPromise;
  const elementsFolder = `${dir}/elements`;
  if (!existsSync(elementsFolder)) {
    fsExtra.ensureDirSync(elementsFolder);
  }
  await saveElementsToDir(elementsFolder, data.elements);

  const commonResourcesFolder = `${dir}/vdrs`;
  if (!existsSync(commonResourcesFolder)) {
    fsExtra.ensureDirSync(commonResourcesFolder);
  }
  await saveVdrsToDirOld(commonResourcesFolder, data.vdrs);

  const formulasFolder = `${dir}/formulas`;
  if (!existsSync(formulasFolder)) {
    fsExtra.ensureDirSync(formulasFolder);
  }
  await saveFormulasToDir(formulasFolder, data.formulas);
};
