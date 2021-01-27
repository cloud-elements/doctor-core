/* eslint-disable no-useless-catch */
const {curry} = require('ramda');

module.exports = curry(async (getData, objectName, jobId, processId, jobType) => {
  try {
    return await getData(objectName, jobId, processId, jobType);
  } catch (error) {
    throw error;
  }
});
