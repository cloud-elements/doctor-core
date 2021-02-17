/* eslint-disable no-undef */
const path = require('path');
const {equals, pluck, addIndex, map, join} = require('ramda');
const canceledJob = require('../../src/events/cancelled-job');
const removeElement = require('../../src/core/elements/removeElement');
const readElementsFromDir = require('../../src/core/elements/readElementsFromDir');
const http = require('../../src/utils/http');

const mapIndex = addIndex(map);
const elementsDirectoryPath = path.resolve('./test/assets/snapshot_export_103230_2020-11-27T05_53_21/elements');

jest.mock('../../src/utils/http');
jest.mock('../../src/events/cancelled-job');

describe('removeElement', () => {
  it('should be able to handle empty element keys', async () => {
    let elementsData = await readElementsFromDir(elementsDirectoryPath);
    expect(elementsData).not.toBeNull();
    elementsData = mapIndex((element, index) => ({...element, id: index}), elementsData);
    http.get.mockImplementation((url, qs, account) => {
      if (!equals(account, __ACCOUNT__)) {
        return Promise.reject(new Error('This should never happen'));
      }
      if (
        equals(url, 'elements') &&
        (equals(qs, {
          where: "private='true'",
        }) ||
          equals(qs, {
            where: "private='true' AND key in ('wow')",
          }))
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
      } else {
        return Promise.reject(new Error('not found'));
      }
    });
    http.delete.mockImplementation((url, qs, account) => {
      if (!equals(account, __ACCOUNT__)) {
        return Promise.reject(new Error('This should never happen'));
      }
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
    await removeElement(__ACCOUNT__, {
      name: null,
      jobId: 1,
      processId: 2,
    });
  });
  it('should be able to handle invalid element keys', async () => {
    let elementsData = await readElementsFromDir(elementsDirectoryPath);
    expect(elementsData).not.toBeNull();
    elementsData = mapIndex((element, index) => ({...element, id: index}), elementsData);
    await removeElement(__ACCOUNT__, {
      name: 'wow',
      jobId: 1,
      processId: 2,
    });
  });
  it('should be able to handle string element keys', async () => {
    let elementsData = await readElementsFromDir(elementsDirectoryPath);
    expect(elementsData).not.toBeNull();
    elementsData = mapIndex((element, index) => ({...element, id: index}), elementsData);
    await removeElement(__ACCOUNT__, {
      name: join(',', pluck('key', elementsData)),
      jobId: 1,
      processId: 2,
    });
  });
  it('should be able to handle array element keys ', async () => {
    let elementsData = await readElementsFromDir(elementsDirectoryPath);
    expect(elementsData).not.toBeNull();
    elementsData = mapIndex((element, index) => ({...element, id: index}), elementsData);
    http.get.mockImplementation((url, qs, account) => {
      if (!equals(account, __ACCOUNT__)) {
        return Promise.reject(new Error('This should never happen'));
      }
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
          where: "extended='true' AND key in ('adpworkforcenow','actessentials','bigcommerce','bigcommerce-clone')",
        })
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
      } else {
        return Promise.reject(new Error('not found'));
      }
    });
    await removeElement(__ACCOUNT__, {
      name: pluck('key', elementsData).map(elementKey => ({
        key: elementKey,
        private: equals(elementKey, 'bigcommerce-clone'),
      })),
      jobId: 1,
      processId: 2,
    });
  });
  it('should stop execution if job gets canceled', async () => {
    const elementsData = await readElementsFromDir(elementsDirectoryPath);
    expect(elementsData).not.toBeNull();
    http.get.mockImplementation((url, qs, account) => {
      if (!equals(account, __ACCOUNT__)) {
        return Promise.reject(new Error('This should never happen'));
      }
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
          where: "extended='true' AND key in ('adpworkforcenow','actessentials','bigcommerce','bigcommerce-clone')",
        })
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
      } else {
        return Promise.reject(new Error('Failed to retrieve resource'));
      }
    });
    canceledJob.isJobCancelled.mockImplementation(() => true);
    await removeElement(__ACCOUNT__, {
      name: pluck('key', elementsData).map(elementKey => ({
        key: elementKey,
        private: equals(elementKey, 'bigcommerce-clone'),
      })),
      jobId: 1,
      processId: 2,
    });
  });
  it('should be to handle and throw exception incase of failure', async () => {
    let elementsData = await readElementsFromDir(elementsDirectoryPath);
    expect(elementsData).not.toBeNull();
    elementsData = mapIndex((element, index) => ({...element, id: index}), elementsData);
    const originalError = console.error;
    console.error = jest.fn();
    http.get.mockImplementation((url, qs, account) => {
      if (!equals(account, __ACCOUNT__)) {
        return Promise.reject(new Error('This should never happen'));
      }
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
          where: "extended='true' AND key in ('adpworkforcenow','actessentials','bigcommerce','bigcommerce-clone')",
        })
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
      } else {
        return Promise.reject(new Error('Failed to retrieve resource'));
      }
    });
    http.delete.mockImplementation((url, qs, account) => {
      if (!equals(account, __ACCOUNT__)) {
        return Promise.reject(new Error('This should never happen'));
      }
      if (equals(url, 'elements/4')) {
        return Promise.reject(new Error('Cannot perform this operation'));
      }
    });
    canceledJob.isJobCancelled.mockImplementation(() => false);
    try {
      await removeElement(__ACCOUNT__, {
        name: pluck('key', elementsData).map(elementKey => ({
          key: elementKey,
          private: equals(elementKey, 'bigcommerce-clone'),
        })),
        jobId: 1,
        processId: 2,
      });
    } catch (error) {
      expect(http.get).toHaveBeenCalledTimes(1);
      expect(http.delete).toHaveBeenCalledTimes(1);
      expect(error.message).toEqual('Cannot perform this operation');
    }
    expect.assertions(4);
    console.error = originalError;
  });
});
