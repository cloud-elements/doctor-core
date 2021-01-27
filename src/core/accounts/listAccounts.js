const path = require('path');
const readFile = require('../../utils/readFile');

const homeDir = process.platform === 'win32' ? process.env.HOMEPATH : process.env.HOME;
const filePath = path.normalize(`${homeDir}/.doctor/config.json`);

module.exports = async () => {
  const accounts = await readFile(filePath);
  // eslint-disable-next-line node/no-unsupported-features/node-builtins
  console.table(accounts);
};
