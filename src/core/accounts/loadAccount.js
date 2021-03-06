const path = require('path');
const {any, isNil, isEmpty, find, propEq} = require('ramda');
const readFile = require('../../utils/readFile');
const {logDebug} = require('../../utils/logger');

const homeDir = process.platform === 'win32' ? process.env.HOMEPATH : process.env.HOME;
const filePath = path.normalize(`${homeDir}/.doctor/config.json`);
const isNilOrEmpty = val => isNil(val) || isEmpty(val);

module.exports = async account => {
  // From CLI
  if (typeof account !== 'object') {
    const accounts = await readFile(filePath);
    const props = find(propEq('name', account))(accounts);
    const {baseUrl, userSecret, orgSecret} = !isNilOrEmpty(props) ? props : {};

    if (any(isNilOrEmpty)([props, baseUrl, userSecret, orgSecret])) {
      logDebug(`No account found`);
      throw new Error(`No account found`);
    }
    return {
      baseUrl,
      authorization: `User ${userSecret}, Organization ${orgSecret}`,
    };
  }
  return account; // From doctor-service
};
