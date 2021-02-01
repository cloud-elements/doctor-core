const {readFileSync, lstatSync, readdir, existsSync} = require('fs');
const {join} = require('path');
const {promisify} = require('util');
const {pipe, map, filter} = require('ramda');
const readFile = require('../../utils/readFile');
const getResourceName = require('../../utils/getResourceName');
const {toDirectoryName} = require('../../utils/regex');
const {isNilOrEmpty} = require('../../utils/common');

const isDirectory = source => lstatSync(source).isDirectory();

const getDirectories = async source => {
  const items = await promisify(readdir)(source);
  return pipe(
    map(name => join(source, name)),
    filter(isDirectory),
    map(name => join(name, 'element.json')),
    filter(existsSync),
  )(items);
};

const buildHooks = elementFolder =>
  map(h => ({
    ...h,
    body: readFileSync(`${elementFolder}/${h.type}Hook.js`).toString(),
  }));

const toElementFolderName = (dirName, elementName) => `${dirName}/${toDirectoryName(elementName)}`;

const buildResources = elementFolder =>
  map(r =>
    !isNilOrEmpty(r.hooks)
      ? {
          ...r,
          hooks: map(h => ({
            ...h,
            body: readFileSync(`${elementFolder}/resources/${getResourceName(r)}${h.type}Hook.js`).toString(),
          }))(r.hooks),
        }
      : r,
  );

module.exports = async dirName => {
  const directories = await getDirectories(dirName);
  const elements = await Promise.all(map(readFile)(directories));
  return map(e => ({
    ...e,
    hooks: !isNilOrEmpty(e.hooks) ? pipe(toElementFolderName, buildHooks)(dirName, e.name)(e.hooks) : [],
    resources: !isNilOrEmpty(e.resources)
      ? pipe(toElementFolderName, buildResources)(dirName, e.name)(e.resources)
      : [],
  }))(elements);
};
