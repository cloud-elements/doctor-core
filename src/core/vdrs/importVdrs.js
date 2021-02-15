/* eslint-disable no-unused-expressions */
const {pipe, prop, isNil, not, isEmpty, propOr, has, equals, type, assoc, forEachObjIndexed} = require('ramda');
const readFile = require('../../utils/readFile');
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
    logError(`Failed to upload vdrs ${error}`, jobId);
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
    logError(`Failed to upload vdrs ${error}`, jobId);
    throw error;
  }
};

module.exports = async (account, options) => {
  try {
    let vdrsDataToImport;
    if (pipe(prop('file'), isNil, not)(options)) {
      vdrsDataToImport = await readFile(options.file);
    } else if (pipe(prop('dir'), isNil, not)(options)) {
      vdrsDataToImport = await buildVdrsFromDir(options.dir);
    }
    if (isNilOrEmpty(vdrsDataToImport)) {
      logError(`No VDRs found for import operation`);
      return;
    }
    if (has('objectDefinitions', vdrsDataToImport) && has('transformations', vdrsDataToImport)) {
      await importVdrsV1(vdrsDataToImport, account, options);
    } else {
      await importVdrsV2(vdrsDataToImport, account, options);
    }
  } catch (error) {
    logDebug(`Failed to upload VDRs operation: ${error.message}`, options.jobId);
    throw error;
  }
};
