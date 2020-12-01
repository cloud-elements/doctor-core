'use strict';
const getDataToExport = require('../getDataToExport');
const getElements = require('./getElements');
const saveToFile = require('../../util/saveToFile');
const saveToDir = require('../../util/saveElementsToDir');
const saveTo = require('../saveTo');
const { logDebug } = require('../../util/logger');

module.exports = (params) => {
  try {
    return saveTo(getDataToExport(getElements), saveToFile, saveToDir)(params);
  } catch (error) {
    logDebug(`Failed to complete element operation: ${error.message}`);
    throw error;
  }
}