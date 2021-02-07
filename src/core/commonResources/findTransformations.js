const {__, curry, filter, flatten, map, pipeP, pipe, prop, uniq} = require('ramda');
const mapP = require('../../utils/mapP');
const http = require('../../utils/http');

const makePathObjects = key => `organizations/objects/${key}/transformations`;
const makePathTransformations = elementKey => `organizations/elements/${elementKey}/transformations`;

const filterOrgLevel = transformationMeta => transformationMeta.level === 'organization';
const elementKeyLens = pipe(prop('element'), prop('key'));

const getObjectNames = account => pipeP(http.get(`organizations/objects/definitions`, {}, account), Object.keys);
const getElementKeys = pipeP(http.get, filter(filterOrgLevel), map(elementKeyLens));

const createObject = curry(async (objectNames, account) => {
  const object = {};
  const paths = map(makePathTransformations)(objectNames);
  for (let i = 0; i < objectNames.length; i++) {
    object[objectNames[i]] = await http.get(paths[i], {}, account);
  }
  return object;
});

module.exports = account =>
  pipeP(
    getObjectNames,
    map(makePathObjects),
    mapP(getElementKeys),
    flatten,
    uniq,
    createObject(__, account),
  )(account);
