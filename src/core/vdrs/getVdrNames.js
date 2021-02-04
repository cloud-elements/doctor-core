const {isNil, isEmpty} = require('ramda');
const http = require('../../utils/http');
const {logError} = require('../../utils/logger');

const isNilOrEmpty = val => isNil(val) || isEmpty(val);

module.exports = async (params = '', account) => {
  try {
    const vdrs = await http.get('vdrs', params, account);
    return isNilOrEmpty(vdrs) ? [] : Array.from(vdrs, vdr => vdr.objectName);
  } catch (error) {
    logError('Failed to retrieve vdrs');
    throw error;
  }
};
