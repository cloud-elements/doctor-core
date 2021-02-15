/* istanbul ignore file */
/* eslint-disable no-prototype-builtins */
/* eslint-disable no-underscore-dangle */
const {curry} = require('ramda');
const util = require('util');
const {logDebug} = require('./logger');

module.exports = curry((params, data) => {
  if (!data.hasOwnProperty('options.rawArgs')) {
    return params;
  }
  if (data.options._name === 'doctor-download') {
    // if -v present -n required for download, if -n present, -v optional
    if (data.options.rawArgs.includes('-n')) {
      if (data.options.rawArgs.includes('-v')) {
        const versionIndex = data.options.rawArgs.indexOf('-v') + 1;
        const version = data.options.rawArgs[versionIndex];
        // handle versioning for vdrs
        if (data.object === 'vdrs') {
          const objectNameIndex = data.options.rawArgs.indexOf('-n') + 1;
          const objectName = data.options.name;
          const objectNameForVersion = params.objectDefinitions[objectName].objectName;
          if (objectNameForVersion.includes('_')) {
            const objectNameNoVersion = objectNameForVersion.split('_')[0];
            params.objectDefinitions[objectName].objectName = objectNameNoVersion;
            const transformationObject = params.transformations;
            const transformationKeys = Object.keys(transformationObject);
            const newTransformedObject = {};
            transformationKeys.forEach((key) => {
              const transformationIndividualObject = transformationObject[key];
              const objectName = Object.keys(transformationIndividualObject)[0];
              transformationIndividualObject[objectName].objectName = objectNameNoVersion;
              const newDataObject = {[key]: {[objectNameNoVersion]: transformationIndividualObject[objectName]}};
              Object.assign(newTransformedObject, newDataObject);
            });
            params.transformations = newTransformedObject;
            // same for the objectDefs
            const definitionsObject = {};
            const index = Object.keys(params.objectDefinitions)[0];
            Object.assign(definitionsObject, params.objectDefinitions[index]);
            delete params.objectDefinitions[index];
            params.objectDefinitions[objectNameNoVersion] = definitionsObject;
          } else {
            params.objectDefinitions[objectName].objectName = objectNameForVersion;
          }
        }
        // versioning for formulas
        else if (data.object === 'formulas') {
          const formulaNameIndex = data.options.rawArgs.indexOf('-n') + 1;
          const formulaName = data.options.rawArgs[formulaNameIndex];
          if (formulaName.includes('_')) {
            const formulaNameNoVersion = formulaName.split('_')[0];
            params[0].name = formulaNameNoVersion;
            return params;
          }

          params[0].name = formulaName;
          return params;
        }
      } else {
        return params;
      }
    } else if (!data.options.rawArgs.includes('-d')) {
      logDebug('operation failed: -n flag required to use -v on `doctor download`');
      throw new Error('operation failed: -n flag required to use -v on `doctor download`');
    } else {
      return params;
    }
  } else if (data.rawArgs.includes('-v')) {
    // -n not required for uploads, check that -v is present or do nothing
    const versionIndex = data.rawArgs.indexOf('-v') + 1;
    const version = data.rawArgs[versionIndex];
    // handle versioning for vdrs
    if (data.args[0] === 'vdrs') {
      const objectNameForVersion = Object.keys(params.objectDefinitions)[0];
      if (objectNameForVersion.includes('_')) {
        const objectNameNoVersion = objectNameForVersion.split('_')[0];
        const versionedObjectName = `${objectNameNoVersion}_${version}`;
        const versionedDefinitionObject = params.objectDefinitions.objectNameForVersion;
        params.objectDefinitions[objectNameForVersion].objectName = versionedObjectName;
        params.objectDefinitions.objectNameForVersion = versionedDefinitionObject;
      } else {
        // version the objectDefinitions
        params.objectDefinitions[objectNameForVersion].objectName = `${objectNameForVersion}_${version}`;
        const versionedDefinitionObject = params.objectDefinitions[objectNameForVersion];
        const versionedObjectName = `${objectNameForVersion}_${version}`;
        params.objectDefinitions[objectNameForVersion].objectName = versionedObjectName;
        params.objectDefinitions[versionedObjectName] = versionedDefinitionObject;
        delete params.objectDefinitions[objectNameForVersion];
        // version the transformations object
        const transformationObject = params.transformations;
        const transformationKeys = Object.keys(transformationObject);
        const newTransformedObject = {};
        transformationKeys.forEach((key) => {
          const transformationIndividualObject = transformationObject[key];
          const objectName = Object.keys(transformationIndividualObject)[0];
          transformationIndividualObject[objectName].objectName = versionedObjectName;
          const newDataObject = {[key]: {[versionedObjectName]: transformationIndividualObject[objectName]}};
          Object.assign(newTransformedObject, newDataObject);
        });
        params.transformations = newTransformedObject;
      }
    }
    // versioning for formulas
    else if (data.args[0] === 'formulas') {
      const formulaName = params[0].name;
      if (formulaName.includes('_')) {
        const formulaNameNoVersion = formulaName.split('_')[0];
        params[0].name = `${formulaNameNoVersion}_${version}`;
        delete params[0].id;
      } else {
        params[0].name = `${formulaName}_${version}`;
        delete params[0].id;
      }
    }
  }
  return params;
});
