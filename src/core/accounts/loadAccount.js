const path = require('path');
const {find, propEq} = require('ramda');
const readFile = require('../../utils/readFile');
const {logDebug} = require('../../utils/logger');

const homeDir = process.platform === 'win32' ? process.env.HOMEPATH : process.env.HOME;
const filePath = path.normalize(`${homeDir}/.doctor/config.json`);

module.exports = async account => {
  if (typeof account === 'object') {
    process.env.AUTHENTICATION = account.authorization;
    process.env.BASE_URL = account.baseUrl;
  } else {
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
