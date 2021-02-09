const getElements = require('../core/elements/getElements');
const getFormulas = require('../core/formulas/getFormulas');
const getVdrs = require('../core/vdrs/getVdrs');
const saveToFile = require('./saveToFile');
const saveToDir = require('./saveBackupToDir');
const saveTo = require('./saveTo');

const getData = async ({account}) => {
  return {
    elements: await getElements(account),
    formulas: await getFormulas(account),
    vdrs: await getVdrs(account),
  };
};

module.exports = saveTo(getData, saveToFile, saveToDir);