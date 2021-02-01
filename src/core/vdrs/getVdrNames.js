const {isNilOrEmpty} = require('../../utils/common');
const http = require('../../utils/http');
const {logError} = require('../../utils/logger');

module.exports = async (params = '') => {
  try {
    const vdrs = await http.get('vdrs', params);
    return isNilOrEmpty(vdrs) ? [] : Array.from(vdrs, vdr => vdr.objectName);
  } catch (error) {
    logError('Failed to retrieve vdrs');
    throw error;
  }
};
