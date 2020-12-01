'use strict';

const readFile = require('../util/readFile');
const path = require('path')
const saveToFile = require('../util/saveToFile');
const homeDir = (process.platform === 'win32') ? process.env.HOMEPATH : process.env.HOME;
const filePath = path.normalize(`${homeDir}/.doctor/config.json`);
const {pipe, filter, propEq, not, find} = require('ramda');
const { logDebug } = require('../util/logger');

module.exports = async (account) => {
    const accounts = await readFile(filePath); 
    if (!find(propEq('name', account.name))(accounts)) {
        logDebug(`Account ${account.name} not found`);
        process.exit(1);   
    }  
    pipe(
        filter(pipe(propEq('name', account.name), not)),
        saveToFile(filePath)
    )(accounts);
}