const path = require('path');
const {find, propEq} = require('ramda');
const readFile = require('../../utils/readFile');
const {logDebug} = require('../../utils/logger');

const homeDir = process.platform === 'win32' ? process.env.HOMEPATH : process.env.HOME;
const filePath = path.normalize(`${homeDir}/.doctor/config.json`);

/**
 * Applicable only for CLI. For doctor-service, account details
 * are directly passed to and accessed via function arguments
 */
module.exports = async account => {
  if (typeof account !== 'object') {
    const accounts = await readFile(filePath);
    const props = find(propEq('name', account))(accounts);
    if (!props) {
      logDebug(`No account found`);
      throw new Error(`No account found`);
    }
    process.env.BASE_URL = props.baseUrl;
    process.env.USER_SECRET = props.userSecret;
    process.env.ORG_SECRET = props.orgSecret;
  }
};
