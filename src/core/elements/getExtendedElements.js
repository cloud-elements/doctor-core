/* eslint-disable no-nested-ternary */
const {join, map, flatten, pipe, filter, type} = require('ramda');
const {Assets} = require('../../constants/artifact');
const http = require('../../utils/http');
const applyQuotes = require('../../utils/quoteString');
const {logError} = require('../../utils/logger');
const {isNilOrEmpty} = require('../../utils/common');

module.exports = async (keys, jobId) => {
  // From CLI - User can pass comma seperated string of elements key
  // From Doctor-service - It will be in Array of objects containing elementKey and private flag structure
  const extendedElementsKey = !isNilOrEmpty(keys)
    ? Array.isArray(keys)
      ? pipe(
          filter(element => !element.private),
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
  const extendedQuery = isNilOrEmpty(extendedElementsKey)
    ? isNilOrEmpty(jobId)
      ? {where: "extended='true'"}
      : ''
    : {where: `extended='true' AND key in (${applyQuotes(extendedElementsKey)})`};

  try {
    const allExtendedElements = !isNilOrEmpty(extendedQuery) ? await http.get(Assets.ELEMENTS, extendedQuery) : [];
    return !isNilOrEmpty(allExtendedElements)
      ? allExtendedElements.filter(element => element.extended && !element.private)
      : [];
  } catch (error) {
    logError('Failed to retrieve extened elements');
    throw error;
  }
};
