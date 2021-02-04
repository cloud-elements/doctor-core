const {type, join} = require('ramda');
const getVdrNames = require('./getVdrNames');
const exportVdrs = require('./exportVdrs');
const applyQuotes = require('../../utils/quoteString');
const {logError} = require('../../utils/logger');

module.exports = async (account, vdrName, jobId, processId, jobType) => {
  try {
    // From CLI - User can pass comma seperated string of vdrs name
    // From Service - It will be in Array of objects containing vdr name
    let param = '';
    let vdrNames = [];
    if (type(vdrName) === 'String') {
      vdrNames = vdrName.split(',');
      param = {where: `objectName in (${applyQuotes(join(',', vdrNames))})`};
    } else if (Array.isArray(vdrName)) {
      vdrNames = vdrName.map(vdr => vdr.name);
      param = {where: `objectName in (${applyQuotes(join(',', vdrNames))})`};
    }
    vdrNames = await getVdrNames(param, account);
    const exportData = await exportVdrs(vdrNames, vdrName, jobId, processId, jobType, account);
    return exportData;
  } catch (error) {
    logError('Failed to retrieve vdrs');
    throw error;
  }
};
