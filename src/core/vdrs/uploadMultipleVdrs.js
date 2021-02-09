/* eslint-disable no-unused-expressions */
const {
  pipe,
  pipeP,
  cond,
  prop,
  isNil,
  not,
  useWith,
  __,
  isEmpty,
  propOr,
  has,
  equals,
  type,
  curry,
  assoc,
  forEachObjIndexed,
} = require('ramda');
const readFile = require('../../utils/readFile');
const applyVersion = require('../../utils/applyVersion');
const buildVdrsFromDir = require('./readVdrsFromDir');
const upsertVdrs = require('./upsertVdrs');
const createObjectDefinitions = require('../commonResources/createObjectDefinitions');
const createTransformations = require('../commonResources/createTransformations');
const {logDebug, logError} = require('../../utils/logger');

const isNilOrEmpty = val => isNil(val) || isEmpty(val);

const importVdrsV1 = async (commonResources, account, options) => {
  const {name, jobId} = options;
  try {
    // From CLI - User can pass comma seperated string of vdrs name
    // From Service - It will be in Array of objects containing vdr name
    if (!isNilOrEmpty(name) && !equals(type(name), 'Function')) {
      const vdrNames = Array.isArray(name) ? name.map(vdr => vdr.name) : name.split(',');
      vdrNames &&
        vdrNames.forEach(async vdrName => {
          const transformations = {};
          forEachObjIndexed((element, elementKey) => {
            if (!isNilOrEmpty(element[vdrName])) {
              transformations[elementKey] = {};
              transformations[elementKey][vdrName] = element[vdrName];
            }
          })(commonResources.transformations);
          commonResources.objectDefinitions = commonResources.objectDefinitions[vdrName]
            ? {[vdrName]: commonResources.objectDefinitions[vdrName]}
            : {};
          commonResources.transformations = transformations;

          if (isNilOrEmpty(commonResources.objectDefinition) && isNilOrEmpty(commonResources.transformations)) {
            logDebug(`The doctor was unable to find any vdr called ${vdrName}`);
          }
        });
    }
    await createObjectDefinitions(commonResources, account);
    await createTransformations(commonResources, account);
  } catch (error) {
    /* istanbul ignore next */
    logError(`Failed to upload vdrs ${error}`, jobId);
    /* istanbul ignore next */
    throw error;
  }
};

const importVdrsV2 = async (vdrs, account, options) => {
  const {name, jobId, processId} = options;
  try {
    // From CLI - User can pass comma seperated string of elements key
    // From Service - It will be in Array of objects containing elementKey and private flag structure
    let vdrsToImport = {};
    if (!isNilOrEmpty(name) && !equals(type(name), 'Function')) {
      const vdrNames = Array.isArray(name) ? name.map(vdr => vdr.name) : name.split(',');
      vdrNames &&
        vdrNames.forEach(vdrName => {
          const vdrToImport = propOr({}, vdrName)(vdrs);
          if (isNilOrEmpty(vdrToImport)) {
            logDebug(`The doctor was unable to find the vdr ${vdrName}.`);
          } else {
            vdrsToImport = assoc(vdrName, vdrToImport, vdrsToImport);
          }
        });
    }
    vdrsToImport = isNilOrEmpty(vdrsToImport) ? vdrs : vdrsToImport;
    await upsertVdrs(vdrsToImport, jobId, processId, account);
  } catch (error) {
    /* istanbul ignore next */
    logError(`Failed to upload vdrs ${error}`, jobId);
    /* istanbul ignore next */
    throw error;
  }
};

const importVdrs = curry(async (vdrs, account, options) => {
  try {
    if (has('objectDefinitions', vdrs) && has('transformations', vdrs)) {
      await importVdrsV1(vdrs, account, options);
    } else {
      await importVdrsV2(vdrs, account, options);
    }
  } catch (error) {
    logError('Failed to upload vdrs');
    throw error;
  }
});

module.exports = async (account, options) => {
  try {
    return cond([
      [
        pipe(prop('file'), isNil, not),
        pipeP(useWith(readFile, [prop('file')]), applyVersion(__, options), importVdrs(__, account, options)),
      ],
      [
        pipe(prop('dir'), isNil, not),
        pipeP(useWith(buildVdrsFromDir, [prop('dir')]), applyVersion(__, options), importVdrs(__, account, options)),
      ],
    ])(options);
  } catch (error) {
    /* istanbul ignore next */
    logDebug(`Failed to complete VDR operation: ${error.message}`, options.jobId);
    /* istanbul ignore next */
    throw error;
  }
};
