const path = require('path');
const {pipe, dropWhile, propEq, append, pick} = require('ramda');
const readFile = require('../../utils/readFile');
const saveToFile = require('../../utils/saveToFile');

const homeDir = process.platform === 'win32' ? process.env.HOMEPATH : process.env.HOME;
const filePath = path.normalize(`${homeDir}/.doctor/config.json`);

const accountProps = ['name', 'userSecret', 'orgSecret', 'baseUrl'];

module.exports = async account => {
  const newAccount = pick(accountProps, account);
  const accounts = await readFile(filePath);
  pipe(dropWhile(propEq('name', account.name)), append(pick(accountProps, account)), saveToFile(filePath))(accounts);
};
