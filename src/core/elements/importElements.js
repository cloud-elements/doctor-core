/* eslint-disable no-nested-ternary */
/* eslint-disable no-unused-expressions */
const {
  pipe,
  pipeP,
  cond,
  prop,
  isNil,
  not,
  useWith,
  type,
  equals,
  isEmpty,
  find,
  toLower,
  __,
  curry,
  has,
} = require('ramda');
const readFile = require('../../utils/readFile');
const buildElementsFromDir = require('./buildElementsFromDir');
const createElements = require('./createElements');
const {logDebug, logError} = require('../../utils/logger');

const isNilOrEmpty = val => isNil(val) || isEmpty(val);

const importElements = curry(async (elements, options) => {
  try {
    // From CLI - User can pass comma seperated string of elements key
    // From Service - It will be in Array of objects containing elementKey and private flag structure
    let elementsToImport = [];
    if (!isNilOrEmpty(options.name) && !equals(type(options.name), 'Function')) {
      const elementKeys = Array.isArray(options.name) ? options.name : options.name.split(',');
      elementKeys &&
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
    await createElements(elementsToImport, options.jobId, options.processId);
  } catch (error) {
    logError(`Failed to import elements: ${error.message}`);
    throw error;
  }
});

module.exports = options => {
  try {
    return cond([
      [
        pipe(prop('file'), isNil, not),
        pipeP(
          useWith(readFile, [prop('file')]),
          cond([
            [
              pipe(type, equals('Object')) && pipe(prop('elements'), isNil, not),
              pipe(prop('elements'), importElements(__, options)),
            ],
            [pipe(type, equals('Array')), importElements(__, options)],
          ]),
        ),
      ],
      [pipe(prop('dir'), isNil, not), pipeP(useWith(buildElementsFromDir, [prop('dir')]), importElements(__, options))],
    ])(options);
  } catch (error) {
    /* istanbul ignore next */
    logDebug(`Failed to import elements: ${error.message}`);
    /* istanbul ignore next */
    throw error;
  }
};
