/* eslint-disable no-restricted-syntax */
const {find, equals, keys} = require('ramda');
const http = require('../../utils/http');
const {logDebug} = require('../../utils/logger');

const makePath = objectName => `organizations/objects/${objectName}/definitions`;

module.exports = async (data, account) => {
  const {objectDefinitions} = data;
  let endpointObjects = [];
  try {
    endpointObjects = await http.get('organizations/objects/definitions', {}, account);
  } catch (error) {
    /* ignore */
  }

  const objectNames = keys(objectDefinitions);
  for (const objectName of objectNames) {
    const endpointObjectName = find(equals(objectName))(keys(endpointObjects));
    if (endpointObjectName) {
      await http.update(makePath(endpointObjectName), objectDefinitions[endpointObjectName], account);
      logDebug(`Updated Object: ${endpointObjectName}`);
    } else {
      await http.post(makePath(objectName), objectDefinitions[objectName], account);
      logDebug(`Created Object: ${objectName}`);
    }
  }

  return data;
};
