const {pipeP, pipe, map, flatten, prop, filter, uniq} = require('ramda');
const getObjectDefinitions = require('./getObjectDefinitions');
const mapP = require('../../utils/mapP');
const http = require('../../utils/http');

const makePathObjects = key => `organizations/objects/${key}/transformations`;
const makePathTransformations = elementKey => `organizations/elements/${elementKey}/transformations`;
const filterOrgLevel = transformationMeta => transformationMeta.level === 'organization';
const elementKeyLens = pipe(prop('element'), prop('key'));

const getObjectNames = pipeP(getObjectDefinitions, Object.keys);

const getElementKeys = pipeP(http.get, filter(filterOrgLevel), map(elementKeyLens));

const createObject = async objectNames => {
  const object = {};
  const paths = map(makePathTransformations)(objectNames);
  for (let i = 0; i < objectNames.length; i++) {
    object[objectNames[i]] = await http.get(paths[i]);
  }
  return object;
};

module.exports = pipeP(getObjectNames, map(makePathObjects), mapP(getElementKeys), flatten, uniq, createObject);
