const path = require('path');
const {pipe, filter, propEq, not, find} = require('ramda');
const readFile = require('../../utils/readFile');
const saveToFile = require('../../utils/saveToFile');
const {logDebug} = require('../../utils/logger');

const homeDir = process.platform === 'win32' ? process.env.HOMEPATH : process.env.HOME;
const filePath = path.normalize(`${homeDir}/.doctor/config.json`);

module.exports = async account => {
  const accounts = await readFile(filePath);
  if (!find(propEq('name', account.name))(accounts)) {
    logDebug(`Account ${account.name} not found`);
    throw new Error(`Account ${account.name} not found`);
  }
  pipe(filter(pipe(propEq('name', account.name), not)), saveToFile(filePath))(accounts);
};
