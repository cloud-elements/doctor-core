'use strict';
const getElements = require('./elements/getElements');
const getFormulas = require('../util/getFormulas');
const getVdrs = require('./vdrs/download/getVdrs');
const saveToFile = require('../util/saveToFile');
const saveToDir = require('../util/saveBackupToDir');
const saveTo = require('./saveTo');

const getData = async () => {
  return {
    elements: await getElements(),
    formulas: await getFormulas(),
    vdrs: await getVdrs(),
  };
};

module.exports = saveTo(getData, saveToFile, saveToDir);