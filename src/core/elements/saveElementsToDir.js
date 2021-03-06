/* istanbul ignore file */
const {existsSync} = require('fs');
const fsExtra = require('fs-extra');
const {forEach, dissoc, map, omit, pipe, tap, gt, propOr, pluck, countBy, identity, isNil, isEmpty} = require('ramda');
const {toDirectoryName} = require('../../utils/regex');
const getResourceName = require('../../utils/getResourceName');

const isNilOrEmpty = val => isNil(val) || isEmpty(val);

module.exports = async (dir, data) => {
  const elements = data;
  if (!existsSync(dir)) {
    fsExtra.ensureDirSync(dir);
  }
  // Construct the hash map with key as element key and value as number of occurences
  // in the given elements object above. eg: {sfdc: 2, zoho: 1}
  // This is required to structure elements folder properly incase if a element with
  // element key appear twice (1 extended and 1 private element) and to differentiate
  // private and extended element folder structure
  const allElementsNameCount = pipe(pluck('name'), countBy(identity))(elements);
  forEach(element => {
    const elementFolder =
      gt(Number(propOr(1, element.name)(allElementsNameCount)), 1) &&
        (isNilOrEmpty(element.private) ? element.extended : !element.private)
        ? `${dir}/${toDirectoryName(element.name)}_extended`
        : `${dir}/${toDirectoryName(element.name)}`;

    if (!existsSync(elementFolder)) {
      fsExtra.ensureDirSync(elementFolder);
    }

    element = dissoc('id', element);
    element.configuration = map(dissoc('id'))(element.configuration).sort((a, b) => a.key.localeCompare(b.key));
    element.parameters = map(omit(['id', 'elementId', 'createdDate', 'updatedDate']))(element.parameters).sort((a, b) =>
      a.name.localeCompare(b.name),
    );

    element.hooks = map(
      pipe(
        omit(['id', 'elementId']),
        tap(h => fsExtra.outputFileSync(`${elementFolder}/${h.type}Hook.js`, h.body, 'utf8')),
        dissoc('body'),
      ),
    )(element.hooks).sort((a, b) => -a.type.localeCompare(b.type));

    if (element.resources) {
      const resourcesFolder = `${elementFolder}/resources`;
      if (!existsSync(resourcesFolder)) {
        fsExtra.ensureDirSync(resourcesFolder);
      }
      element.resources = map(resource => {
        if (resource.parameters) {
          resource.parameters = map(omit(['id', 'resourceId', 'createdDate', 'updatedDate']))(
            resource.parameters,
          ).sort((a, b) => a.name.localeCompare(b.name));
        }
        if (resource.hooks) {
          const uniqueName = getResourceName(resource);
          resource.hooks = map(
            pipe(
              omit(['id', 'resourceId']),
              tap(h => fsExtra.outputFileSync(`${resourcesFolder}/${uniqueName}${h.type}Hook.js`, h.body, 'utf8')),
              dissoc('body'),
            ),
          )(resource.hooks).sort((a, b) => -a.type.localeCompare(b.type));
        }
        return omit(['createdDate', 'updatedDate'], resource);
      })(element.resources).sort((a, b) => a.path.localeCompare(b.path) || a.method.localeCompare(b.method));
    }
    fsExtra.outputFileSync(`${elementFolder}/element.json`, JSON.stringify(element), 'utf8');
  })(elements);
};
