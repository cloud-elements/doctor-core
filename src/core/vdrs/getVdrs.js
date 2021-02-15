const {type, join} = require('ramda');
const getVdrNames = require('./getVdrNames');
const exportVdrs = require('./downloadVdrs');
const applyQuotes = require('../../utils/quoteString');
const {logError} = require('../../utils/logger');

module.exports = async (account, inputVdrNames, jobId, processId, jobType) => {
  try {
    // From CLI - User can pass comma seperated string of vdrs name
    // From Service - It will be in Array of objects containing vdr name
    let param = '';
    let vdrNames = [];
    if (type(inputVdrNames) === 'String') {
      vdrNames = inputVdrNames.split(',');
      param = {where: `objectName in (${applyQuotes(join(',', vdrNames))})`};
    } else if (Array.isArray(inputVdrNames)) {
      vdrNames = inputVdrNames.map(vdr => vdr.name);
      param = {where: `objectName in (${applyQuotes(join(',', vdrNames))})`};
    }
    vdrNames = await getVdrNames(account, param);
    const exportData = await exportVdrs(vdrNames, inputVdrNames, jobId, processId, jobType, account);
    return exportData;
  } catch (error) {
    logError('Failed to retrieve vdrs', jobId);
    throw error;
  }
};
