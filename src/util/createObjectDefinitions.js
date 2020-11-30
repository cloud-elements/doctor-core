'use strict';
const { find, equals, keys } = require('ramda');
const get = require('./get');
const logDebug = require('./logger');
const create = require('./post')
const makePath = objectName => `organizations/objects/${objectName}/definitions`;
const update = require('./update');

module.exports = async (data) => {
    const objectDefinitions = data.objectDefinitions;
    let endpointObjects = [];
    try {
        endpointObjects = await get('organizations/objects/definitions',"");
    } catch (error) {/* ignore */}

    const objectNames = keys(objectDefinitions);
    for(const objectName of objectNames){
        const endpointObjectName = find(equals(objectName))(keys(endpointObjects));
        if(endpointObjectName) {
            await update(makePath(endpointObjectName), objectDefinitions[endpointObjectName]);
            logDebug(`Updated Object: ${endpointObjectName}`);
        } else {
            await create(makePath(objectName), objectDefinitions[objectName]);
            logDebug(`Created Object: ${objectName}`);
        }
    }

    return data;
}