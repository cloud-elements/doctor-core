/* eslint-disable no-undef */
const path = require('path');
const {equals, pluck, addIndex, map, join} = require('ramda');
const {JobType} = require('../../src/constants/artifact');
const canceledJob = require('../../src/events/cancelled-job');
const getElements = require('../../src/core/elements/getElements');
const readElementsFromDir = require('../../src/core/elements/readElementsFromDir');
const http = require('../../src/utils/http');

const mapIndex = addIndex(map);
const elementsDirectoryPath = path.resolve('./test/assets/snapshot_export_103230_2020-11-27T05_53_21/elements');
jest.mock('../../src/utils/http');
jest.mock('../../src/events/cancelled-job');

describe('getElements', () => {
  it('should be able to handle empty element keys', async () => {
    let elementsData = await readElementsFromDir(elementsDirectoryPath);
    expect(elementsData).not.toBeNull();
    elementsData = mapIndex((element, index) => ({...element, id: index}), elementsData);
    http.get.mockImplementation((url, qs, account) => {
      if (
        equals(url, 'elements') &&
        equals(qs, {
          where: "private='true'",
        }) &&
        equals(account, __ACCOUNT__)
      ) {
        return Promise.resolve(elementsData.filter(element => equals(element.key, 'bigcommerce-clone')));
      } else if (
        equals(url, 'elements') &&
        equals(qs, {
          where: "extended='true'",
        }) &&
        equals(account, __ACCOUNT__)
      ) {
        return Promise.resolve(elementsData.filter(element => !equals(element.key, 'bigcommerce-clone')));
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
    await getElements(__ACCOUNT__);
  });
  it('should be able to handle string element keys', async () => {
    let elementsData = await readElementsFromDir(elementsDirectoryPath);
    expect(elementsData).not.toBeNull();
    elementsData = mapIndex((element, index) => ({...element, id: index}), elementsData);
    http.get.mockImplementation((url, qs) => {
      if (
        equals(url, 'elements') &&
        equals(qs, {
          where:
            "private='true' AND key in ('adpwfnSDF','adpworkforcenow','actessentials','bigcommerce','bigcommerce-clone')",
        })
      ) {
        return Promise.resolve(elementsData.filter(element => equals(element.key, 'bigcommerce-clone')));
      } else if (
        equals(url, 'elements') &&
        equals(qs, {
          where:
            "extended='true' AND key in ('adpwfnSDF','adpworkforcenow','actessentials','bigcommerce','bigcommerce-clone')",
        })
      ) {
        return Promise.resolve(elementsData.filter(element => !equals(element.key, 'bigcommerce-clone')));
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
    await getElements(__ACCOUNT__, join(',', pluck('key', elementsData)));
  });
  it('should be able to handle array element keys where no private elements present ', async () => {
    let elementsData = await readElementsFromDir(elementsDirectoryPath);
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
        equals(qs, {
          where: "extended='true' AND key in ('adpwfnSDF','adpworkforcenow','actessentials','bigcommerce')",
        })
      ) {
        return Promise.resolve(elementsData.filter(element => !equals(element.key, 'bigcommerce-clone')));
      } else if (equals(url, 'elements/1/export')) {
        return Promise.resolve(elementsData.filter(element => equals(element.key, 'adpworkforcenow')));
      } else if (equals(url, 'elements/2/export')) {
        return Promise.resolve([]);
      } else if (equals(url, 'elements/3/export')) {
        return Promise.resolve(elementsData.filter(element => equals(element.key, 'bigcommerce')));
      } else if (equals(url, 'elements/4/export')) {
        return Promise.resolve(elementsData.filter(element => equals(element.key, 'bigcommerce-clone')));
      } else {
        return Promise.reject(new Error('not found'));
      }
    });
    await getElements(
      __ACCOUNT__,
      pluck('key', elementsData).map(elementKey => ({
        key: elementKey,
        private: equals(elementKey, 'bigcommerce-clone'),
      })),
      1,
      2,
      JobType.PROMOTE_EXPORT,
    );
  });
  it('should be able to handle array element keys where no extended elements present ', async () => {
    let elementsData = await readElementsFromDir(elementsDirectoryPath);
    expect(elementsData).not.toBeNull();
    elementsData = mapIndex((element, index) => ({...element, id: index}), elementsData);
    http.get.mockImplementation((url, qs) => {
      if (
        equals(url, 'elements') &&
        equals(qs, {
          where: "private='true' AND key in ('bigcommerce-clone')",
        })
      ) {
        return Promise.resolve(elementsData.filter(element => equals(element.key, 'bigcommerce-clone')));
      } else if (
        equals(url, 'elements') &&
        equals(qs, {
          where: "extended='true' AND key in ('adpwfnSDF','adpworkforcenow','actessentials','bigcommerce')",
        })
      ) {
        return Promise.resolve([]);
      } else if (equals(url, 'elements/1/export')) {
        return Promise.resolve(elementsData.filter(element => equals(element.key, 'adpworkforcenow')));
      } else if (equals(url, 'elements/2/export')) {
        return Promise.resolve([]);
      } else if (equals(url, 'elements/3/export')) {
        return Promise.resolve(elementsData.filter(element => equals(element.key, 'bigcommerce')));
      } else if (equals(url, 'elements/4/export')) {
        return Promise.resolve(elementsData.filter(element => equals(element.key, 'bigcommerce-clone')));
      } else {
        return Promise.reject(new Error('not found'));
      }
    });
    await getElements(
      __ACCOUNT__,
      pluck('key', elementsData).map(elementKey => ({
        key: elementKey,
        private: equals(elementKey, 'bigcommerce-clone'),
      })),
      1,
      2,
      JobType.PROMOTE_EXPORT,
    );
  });
  it('should stop execution if job gets canceled', async () => {
    let elementsData = await readElementsFromDir(elementsDirectoryPath);
    elementsData = mapIndex((element, index) => ({...element, id: index}), elementsData);
    expect(elementsData).not.toBeNull();
    http.get.mockImplementation((url, qs) => {
      if (
        equals(url, 'elements') &&
        equals(qs, {
          where:
            "private='true' AND key in ('adpwfnSDF','adpworkforcenow','actessentials','bigcommerce','bigcommerce-clone')",
        })
      ) {
        return Promise.resolve(elementsData.filter(element => equals(element.key, 'bigcommerce-clone')));
      } else if (
        equals(url, 'elements') &&
        equals(qs, {
          where:
            "extended='true' AND key in ('adpwfnSDF','adpworkforcenow','actessentials','bigcommerce','bigcommerce-clone')",
        })
      ) {
        return Promise.resolve(elementsData.filter(element => !equals(element.key, 'bigcommerce-clone')));
      } else {
        return Promise.reject(new Error('not found'));
      }
    });
    canceledJob.isJobCancelled.mockResolvedValue(true);
    await getElements(__ACCOUNT__, join(',', pluck('key', elementsData)), 1, 2);
  });
  it('should throw error without account', async () => {
    let elementsData = await readElementsFromDir(elementsDirectoryPath);
    expect(elementsData).not.toBeNull();
    elementsData = mapIndex((element, index) => ({...element, id: index}), elementsData);
    http.get.mockImplementation((url, qs, account) => {
      if (
        equals(url, 'elements') &&
        equals(qs, {
          where: "private='true'",
        }) &&
        equals(account, __ACCOUNT__)
      ) {
        return Promise.resolve(elementsData.filter(element => equals(element.key, 'bigcommerce-clone')));
      } else {
        return Promise.reject(new Error('not found'));
      }
    });
    try {
      await getElements();
    } catch (error) {
      expect(http.get).toHaveBeenCalledTimes(1);
    }
  });
  it('should be to handle and throw exception incase of failure', async () => {
    const elementsData = await readElementsFromDir(elementsDirectoryPath);
    expect(elementsData).not.toBeNull();
    http.get.mockImplementation((url, qs) => {
      if (
        equals(url, 'elements') &&
        equals(qs, {
          where:
            "private='true' AND key in ('adpwfnSDF','adpworkforcenow','actessentials','bigcommerce','bigcommerce-clone')",
        })
      ) {
        return Promise.resolve(elementsData.filter(element => equals(element.key, 'bigcommerce-clone')));
      } else if (
        equals(url, 'elements') &&
        equals(qs, {
          where:
            "extended='true' AND key in ('adpwfnSDF','adpworkforcenow','actessentials','bigcommerce','bigcommerce-clone')",
        })
      ) {
        return Promise.resolve(elementsData.filter(element => !equals(element.key, 'bigcommerce-clone')));
      } else if (equals(url, 'elements/1/export')) {
        return Promise.resolve(elementsData.filter(element => equals(element.key, 'adpworkforcenow')));
      } else if (equals(url, 'elements/2/export')) {
        return Promise.resolve(elementsData.filter(element => equals(element.key, 'actessentials')));
      } else if (equals(url, 'elements/3/export')) {
        return Promise.resolve(elementsData.filter(element => equals(element.key, 'bigcommerce')));
      } else if (equals(url, 'elements/4/export')) {
        return Promise.reject(new Error('not found'));
      } else {
        return Promise.reject(new Error('not found'));
      }
    });
    const originalError = console.error;
    console.error = jest.fn();
    canceledJob.isJobCancelled.mockImplementation(() => false);
    try {
      await getElements(__ACCOUNT__, join(',', pluck('key', elementsData)), 1, 2, JobType.PROMOTE_EXPORT);
    } catch (error) {
      expect(http.get).toHaveBeenCalledTimes(3);
    }
    console.error = originalError;
  });
});
