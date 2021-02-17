/* eslint-disable no-nested-ternary */
/* eslint-disable no-unused-expressions */
const {pipe, prop, isNil, not, type, equals, isEmpty, find, toLower, curry, has} = require('ramda');
const readFile = require('../../utils/readFile');
const readElementsFromDir = require('./readElementsFromDir');
const createElements = require('./createElements');
const {logDebug, logError} = require('../../utils/logger');

const isNilOrEmpty = val => isNil(val) || isEmpty(val);

const importElements = curry(async (elements, account, options) => {
  try {
    // From CLI - User can pass comma seperated string of elements key
    // From Service - It will be in Array of objects containing elementKey and private flag structure
    let elementsToImport = [];
    if (!isNilOrEmpty(options.name) && !equals(type(options.name), 'Function')) {
      const elementKeys = Array.isArray(options.name) ? options.name : options.name.split(',');
      elementKeys.forEach(elementKey => {
        if (equals(type(elementKey), 'Object') && !isNilOrEmpty(options.jobId)) {
          const {key} = elementKey;
          const elementToImport = find(element =>
            equals(toLower(element.key), toLower(key))
              ? elementKey.private
                ? has('private', element) && element.private
                : has('private', element)
                ? !element.private && element.extended
                : element.extended
              : false,
          )(elements);
          if (isNilOrEmpty(elementToImport)) {
            logDebug(`The doctor was unable to find the element ${key}.`);
          } else {
            elementsToImport.push(elementToImport);
          }
        } else {
          const elementToImport = find(element => equals(toLower(element.key), toLower(elementKey)))(elements);
          if (isNilOrEmpty(elementToImport)) {
            logDebug(`The doctor was unable to find the element ${elementKey}.`);
          } else {
            elementsToImport.push(elementToImport);
          }
        }
      });
    }
    elementsToImport = isNilOrEmpty(elementsToImport) ? elements : elementsToImport;
    await createElements(account, elementsToImport, options.jobId, options.processId);
  } catch (error) {
    logError(`Failed to import elements: ${error.message}`, options.jobId);
    throw error;
  }
});

module.exports = async (account, options) => {
  try {
    let elementsDataToImport;
    if (pipe(prop('file'), isNil, not)(options)) {
      elementsDataToImport = await readFile(options.file);
    } else if (pipe(prop('dir'), isNil, not)(options)) {
      elementsDataToImport = await readElementsFromDir(options.dir);
    }
    if (isNilOrEmpty(elementsDataToImport)) {
      logError(`No elements found for import operation`);
      return;
    }
    if (pipe(type, equals('Object')) && pipe(prop('elements'), isNil, not)(elementsDataToImport)) {
      /* istanbul ignore next */
      await importElements(pipe(prop('elements'))(elementsDataToImport), account, options);
    } else if (pipe(type, equals('Array'))(elementsDataToImport)) {
      await importElements(elementsDataToImport, account, options);
    }
  } catch (error) {
    logDebug(`Failed to complete element import operation: ${error.message}`);
    throw error;
  }
};
