/* eslint-disable no-nested-ternary */
const {join, map, isNil, isEmpty, flatten, pipe, filter, type} = require('ramda');
const {Assets} = require('../../constants/artifact');
const http = require('../../utils/http');
const applyQuotes = require('../../utils/quoteString');
const {logError} = require('../../utils/logger');

const isNilOrEmpty = val => isNil(val) || isEmpty(val);

module.exports = async (keys, jobId, account) => {
  // From CLI - User can pass comma seperated string of elements key
  // From Doctor-service - It will be in Array of objects containing elementKey and private flag structure
  const privateElementsKey = !isNilOrEmpty(keys)
    ? Array.isArray(keys)
      ? pipe(
          filter(element => element.private),
          map(element => element.key),
          flatten,
          join(','),
        )(keys)
      : type(keys) === 'String'
        ? keys
        : []
    : [];

  // For CLI, if elements keys are empty then default the qs to true
  // For Doctor-service, if any private or extended keys are empty then don't make API call
  const privateQuery = isNilOrEmpty(privateElementsKey)
    ? isNilOrEmpty(jobId)
      ? {where: "private='true'"}
      : ''
    : {where: `private='true' AND key in (${applyQuotes(privateElementsKey)})`};
  try {
    return !isNilOrEmpty(privateQuery) ? await http.get(Assets.ELEMENTS, privateQuery, account) : [];
  } catch (error) {
    logError('Failed to retrieve private elements');
    throw error;
  }
};
