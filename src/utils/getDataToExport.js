/* eslint-disable no-useless-catch */
const {curry} = require('ramda');

module.exports = curry(async (getData, objectName, jobId, processId, jobType, account) => {
  try {
    return await getData(objectName, jobId, processId, jobType, account);
  } catch (error) {
    throw error;
  }
});
