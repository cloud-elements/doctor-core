/* eslint-disable no-undef */
const path = require('path');
const {JobType} = require('../../src/constants/artifact');
const {equals, pluck, addIndex, map, join} = require('ramda');
const removeElements = require('../../src/core/elements/removeElements');
const buildElementsFromDir = require('../../src/core/elements/buildElementsFromDir');
const http = require('../../src/utils/http');

const mapIndex = addIndex(map);
const elementsDirectoryPath = path.resolve('./test/assets/snapshot_export_103230_2020-11-27T05_53_21/elements');

jest.mock('../../src/utils/http');

describe('removeElements', () => {
  it('should be able to handle empty element keys', async () => {
    let elementsData = await buildElementsFromDir(elementsDirectoryPath);
    expect(elementsData).not.toBeNull();
    elementsData = mapIndex((element, index) => ({...element, id: index}), elementsData);
    http.get.mockImplementation((url, qs) => {
      if (
        equals(url, 'elements') &&
        (equals(qs, {
          where: "private='true'",
        }) ||
          equals(qs, {where: "private='true' AND key in ('wow',' how')"}))
      ) {
        return Promise.resolve([]);
      } else if (
        equals(url, 'elements') &&
        equals(qs, {
          where:
            "private='true' AND key in ('adpwfnSDF','adpworkforcenow','actessentials','bigcommerce','bigcommerce-clone')",
        })
      ) {
        return Promise.resolve(elementsData.filter(element => equals(element.key, 'bigcommerce-clone')));
      } else if (
        equals(url, 'elements') &&
        (equals(qs, {
          where: "extended='true'",
        }) ||
          equals(qs, {where: "extended='true' AND key in ('wow',' how')"}))
      ) {
        return Promise.resolve(elementsData.filter(element => !equals(element.key, 'bigcommerce-clone')));
      } else if (
        equals(url, 'elements') &&
        equals(qs, {
          where:
            "extended='true' AND key in ('adpwfnSDF','adpworkforcenow','actessentials','bigcommerce','bigcommerce-clone')",
        })
      ) {
        return Promise.resolve(elementsData.filter(element => !equals(element.key, 'bigcommerce-clone')));
      } else if (equals(url, 'elements/adpworkforcenow/resources')) {
        return Promise.resolve(
          head(
            pluck(
              'resources',
              elementsData.filter(element => equals(element.key, 'adpworkforcenow')),
            ),
          ),
        );
      } else if (equals(url, 'elements/actessentials/resources')) {
        return Promise.resolve(
          head(
            pluck(
              'resources',
              elementsData.filter(element => equals(element.key, 'actessentials')),
            ),
          ),
        );
      } else if (equals(url, 'elements/bigcommerce/resources')) {
        return Promise.resolve(
          head(
            pluck(
              'resources',
              elementsData.filter(element => equals(element.key, 'bigcommerce')),
            ),
          ),
        );
      } else if (equals(url, 'elements/bigcommerce-clone/resources')) {
        return Promise.resolve(
          head(
            pluck(
              'resources',
              elementsData.filter(element => equals(element.key, 'bigcommerce-clone')),
            ),
          ),
        );
      } else if (equals(url, 'elements/1')) {
        return Promise.resolve(elementsData.filter(element => equals(element.key, 'adpworkforcenow')));
      } else if (equals(url, 'elements/2')) {
        return Promise.resolve(elementsData.filter(element => equals(element.key, 'actessentials')));
      } else if (equals(url, 'elements/3')) {
        return Promise.resolve(elementsData.filter(element => equals(element.key, 'bigcommerce')));
      } else if (equals(url, 'elements/4')) {
        return Promise.resolve(elementsData.filter(element => equals(element.key, 'bigcommerce-clone')));
      } else if (equals(url, 'elements/1/export')) {
        return Promise.resolve(elementsData.filter(element => equals(element.key, 'adpworkforcenow')));
      } else if (equals(url, 'elements/2/export')) {
        return Promise.resolve(elementsData.filter(element => equals(element.key, 'actessentials')));
      } else if (equals(url, 'elements/3/export')) {
        return Promise.resolve(elementsData.filter(element => equals(element.key, 'bigcommerce')));
      } else if (equals(url, 'elements/4/export')) {
        return Promise.resolve(elementsData.filter(element => equals(element.key, 'bigcommerce-clone')));
      } else {
        return Promise.reject(new Error('not found'));
      }
    });
    http.delete.mockImplementation(url => {
      if (equals(url, 'elements/1')) {
        return Promise.resolve(elementsData.filter(element => equals(element.key, 'adpworkforcenow')));
      } else if (equals(url, 'elements/2')) {
        return Promise.resolve(elementsData.filter(element => equals(element.key, 'actessentials')));
      } else if (equals(url, 'elements/3')) {
        return Promise.resolve(elementsData.filter(element => equals(element.key, 'bigcommerce')));
      } else if (equals(url, 'elements/4')) {
        return Promise.resolve(elementsData.filter(element => equals(element.key, 'bigcommerce-clone')));
      }
    });
    await removeElements();
  });
  it('should be able to handle invalid element keys', async () => {
    let elementsData = await buildElementsFromDir(elementsDirectoryPath);
    expect(elementsData).not.toBeNull();
    elementsData = mapIndex((element, index) => ({...element, id: index}), elementsData);
    await removeElements('wow, how');
  });
  it('should be able to handle string element keys', async () => {
    let elementsData = await buildElementsFromDir(elementsDirectoryPath);
    expect(elementsData).not.toBeNull();
    elementsData = mapIndex((element, index) => ({...element, id: index}), elementsData);
    await removeElements(join(',', pluck('key', elementsData)));
  });
  it('should be able to handle array element keys ', async () => {
    let elementsData = await buildElementsFromDir(elementsDirectoryPath);
    expect(elementsData).not.toBeNull();
    elementsData = mapIndex((element, index) => ({...element, id: index}), elementsData);
    http.get.mockImplementation((url, qs) => {
      if (
        equals(url, 'elements') &&
        equals(qs, {
          where: "private='true' AND key in ('bigcommerce-clone')",
        })
      ) {
        return Promise.resolve([]);
      } else if (
        equals(url, 'elements') &&
        equals(qs, {where: "extended='true' AND key in ('adpwfnSDF','adpworkforcenow','actessentials','bigcommerce')"})
      ) {
        return Promise.resolve(elementsData.filter(element => !equals(element.key, 'bigcommerce-clone')));
      } else if (equals(url, 'elements/1')) {
        return Promise.resolve(elementsData.filter(element => equals(element.key, 'adpworkforcenow')));
      } else if (equals(url, 'elements/2')) {
        return Promise.resolve(elementsData.filter(element => equals(element.key, 'actessentials')));
      } else if (equals(url, 'elements/3')) {
        return Promise.resolve(elementsData.filter(element => equals(element.key, 'bigcommerce')));
      } else if (equals(url, 'elements/4')) {
        return Promise.resolve(elementsData.filter(element => equals(element.key, 'bigcommerce-clone')));
      } else if (equals(url, 'elements/1/export')) {
        return Promise.resolve(elementsData.filter(element => equals(element.key, 'adpworkforcenow')));
      } else if (equals(url, 'elements/2/export')) {
        return Promise.resolve(elementsData.filter(element => equals(element.key, 'actessentials')));
      } else if (equals(url, 'elements/3/export')) {
        return Promise.resolve(elementsData.filter(element => equals(element.key, 'bigcommerce')));
      } else if (equals(url, 'elements/4/export')) {
        return Promise.resolve(elementsData.filter(element => equals(element.key, 'bigcommerce-clone')));
      } else {
        return Promise.reject(new Error('not found'));
      }
    });
    await removeElements(
      pluck('key', elementsData).map(elementKey => ({
        key: elementKey,
        private: equals(elementKey, 'bigcommerce-clone'),
      })),
      1,
      2,
      JobType.PROMOTE_EXPORT,
    );
  });
});
