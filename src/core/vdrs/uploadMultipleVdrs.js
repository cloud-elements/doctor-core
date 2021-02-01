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
const {isNilOrEmpty} = require('../../utils/common');

const importVdrsV1 = async (commonResources, options) => {
  try {
    // From CLI - User can pass comma seperated string of vdrs name
    // From Service - It will be in Array of objects containing vdr name
    if (!isNilOrEmpty(options.name) && !equals(type(options.name), 'Function')) {
      const vdrNames = Array.isArray(options.name) ? options.name.map(vdr => vdr.name) : options.name.split(',');
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
    await pipeP(createObjectDefinitions, createTransformations)(commonResources);
  } catch (error) {
    /* istanbul ignore next */
    logError('Failed to upload vdrs');
    /* istanbul ignore next */
    throw error;
  }
};

const importVdrsV2 = async (vdrs, options) => {
  try {
    // From CLI - User can pass comma seperated string of elements key
    // From Service - It will be in Array of objects containing elementKey and private flag structure
    let vdrsToImport = {};
    if (!isNilOrEmpty(options.name) && !equals(type(options.name), 'Function')) {
      const vdrNames = Array.isArray(options.name) ? options.name.map(vdr => vdr.name) : options.name.split(',');
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
    await upsertVdrs(vdrsToImport, options.jobId, options.processId);
  } catch (error) {
    /* istanbul ignore next */
    logError('Failed to upload vdrs');
    /* istanbul ignore next */
    throw error;
  }
};

const importVdrs = curry(async (vdrs, options) => {
  try {
    if (has('objectDefinitions', vdrs) && has('transformations', vdrs)) {
      await importVdrsV1(vdrs, options);
    } else {
      await importVdrsV2(vdrs, options);
    }
  } catch (error) {
    logError('Failed to upload vdrs');
    throw error;
  }
});

module.exports = async options => {
  try {
    return cond([
      [
        pipe(prop('file'), isNil, not),
        pipeP(useWith(readFile, [prop('file')]), applyVersion(__, options), importVdrs(__, options)),
      ],
      [
        pipe(prop('dir'), isNil, not),
        pipeP(useWith(buildVdrsFromDir, [prop('dir')]), applyVersion(__, options), importVdrs(__, options)),
      ],
    ])(options);
  } catch (error) {
    /* istanbul ignore next */
    logDebug(`Failed to complete VDR operation: ${error.message}`);
    /* istanbul ignore next */
    throw error;
  }
};
