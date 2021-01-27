const getElements = require('../core/elements/getElements');
const getFormulas = require('../core/formulas/getFormulas');
const getVdrs = require('../core/vdrs/getVdrs');
const saveToFile = require('./saveToFile');
const saveToDir = require('./saveBackupToDir');
const saveTo = require('./saveTo');

const getData = async () => {
  return {
    elements: await getElements(),
    formulas: await getFormulas(),
    vdrs: await getVdrs(),
  };
};

module.exports = saveTo(getData, saveToFile, saveToDir);
