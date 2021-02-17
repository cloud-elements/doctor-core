/* eslint-disable no-undef */
const path = require('path');
const {equals, pluck, addIndex, map, join} = require('ramda');
const canceledJob = require('../../src/events/cancelled-job');
const importElements = require('../../src/core/elements/importElements');
const readElementsFromDir = require('../../src/core/elements/readElementsFromDir');
const http = require('../../src/utils/http');

const mapIndex = addIndex(map);
const elementsDirectoryPath = path.resolve('./test/assets/snapshot_export_103230_2020-11-27T05_53_21/elements');
jest.mock('../../src/utils/http');
jest.mock('../../src/events/cancelled-job');

describe('importElements', () => {
  it('should be able to handle empty element keys', async () => {
    let elementsData = await readElementsFromDir(elementsDirectoryPath);
    expect(elementsData).not.toBeNull();
    elementsData = mapIndex((element, index) => ({...element, id: index}), elementsData);
    http.get.mockImplementation((url, qs, account) => {
      if (!equals(account, __ACCOUNT__)) {
        throw new Error('This should never happen');
      }
      if (
        equals(url, 'elements') &&
        equals(qs, {
          where:
            "private='true' AND abridged='true' AND key in ('adpwfnSDF','adpworkforcenow','actessentials','bigcommerce','bigcommerce-clone')",
        })
      ) {
        return Promise.resolve(elementsData.filter(element => equals(element.key, 'bigcommerce-clone')));
      } else if (
        equals(url, 'elements') &&
        equals(qs, {
          where:
            "extended='true' AND abridged='true' AND key in ('adpwfnSDF','adpworkforcenow','actessentials','bigcommerce','bigcommerce-clone')",
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
    http.update.mockImplementation((path, qs, account) => {
      if (!equals(account, __ACCOUNT__)) {
        throw new Error('This should never happen');
      }
      if (equals(path, 'elements/adpwfnSDF')) {
        return Promise.resolve(
          head(
            pluck(
              'resources',
              elementsData.filter(element => equals(element.key, 'adpwfnSDF')),
            ),
          ),
        );
      }
    });
    http.post.mockImplementation((path, qs, account) => {
      if (!equals(account, __ACCOUNT__)) {
        throw new Error('This should never happen');
      }
      if (equals(path, 'elements/bigcommerce')) {
        return Promise.resolve(
          head(
            pluck(
              'resources',
              elementsData.filter(element => equals(element.key, 'bigcommerce')),
            ),
          ),
        );
      }
    });
    await importElements(__ACCOUNT__, {
      dir: elementsDirectoryPath,
      name: null,
      jobId: 1,
      processId: 2,
    });
    expect(http.get).toHaveBeenCalledTimes(5);
    expect(http.post).toHaveBeenCalledTimes(38);
    expect(http.update).toHaveBeenCalledTimes(1);
  });
  it('should be able to handle invalid element keys', async () => {
    let elementsData = await readElementsFromDir(elementsDirectoryPath);
    expect(elementsData).not.toBeNull();
    elementsData = mapIndex((element, index) => ({...element, id: index}), elementsData);
    await importElements(__ACCOUNT__, {
      dir: elementsDirectoryPath,
      name: 'wow',
      jobId: 1,
      processId: 2,
    });
  });
  it('should be able to handle empty file/directory', async () => {
    let elementsData = await readElementsFromDir(elementsDirectoryPath);
    expect(elementsData).not.toBeNull();
    elementsData = mapIndex((element, index) => ({...element, id: index}), elementsData);
    await importElements(__ACCOUNT__, {
      name: 'wow',
      jobId: 1,
      processId: 2,
    });
  });
  it('should be able to handle string element keys for file', async () => {
    let elementsData = await readElementsFromDir(elementsDirectoryPath);
    expect(elementsData).not.toBeNull();
    elementsData = mapIndex((element, index) => ({...element, id: index}), elementsData);
    await importElements(__ACCOUNT__, {
      file: `${elementsDirectoryPath}/bigcommerce/element.json`,
      name: join(',', pluck('key', elementsData)),
      jobId: 1,
      processId: 2,
    });
  });
  it('should be able to handle string element keys for directory', async () => {
    let elementsData = await readElementsFromDir(elementsDirectoryPath);
    expect(elementsData).not.toBeNull();
    elementsData = mapIndex((element, index) => ({...element, id: index}), elementsData);
    await importElements(__ACCOUNT__, {
      dir: elementsDirectoryPath,
      name: join(',', pluck('key', elementsData)),
      jobId: 1,
      processId: 2,
    });
  });
  it('should be able to handle array element keys where no private elements present', async () => {
    let elementsData = await readElementsFromDir(elementsDirectoryPath);
    expect(elementsData).not.toBeNull();
    elementsData = mapIndex((element, index) => ({...element, id: index}), elementsData);
    http.get.mockImplementation((url, qs, account) => {
      if (!equals(account, __ACCOUNT__)) {
        throw new Error('This should never happen');
      }
      if (
        equals(url, 'elements') &&
        equals(qs, {
          where:
            "private='true' AND abridged='true' AND key in ('adpworkforcenow','actessentials','bigcommerce','bigcommerce-clone')",
        })
      ) {
        return Promise.resolve([]);
      } else if (
        equals(url, 'elements') &&
        equals(qs, {
          where:
            "extended='true' AND abridged='true' AND key in ('adpworkforcenow','actessentials','bigcommerce','bigcommerce-clone')",
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
    await importElements(__ACCOUNT__, {
      dir: elementsDirectoryPath,
      name: pluck('key', elementsData).map(elementKey => ({
        key: elementKey,
        private: equals(elementKey, 'bigcommerce-clone'),
      })),
      jobId: 1,
      processId: 2,
    });
  });
  it('should be able to handle array element keys where no extended elements present', async () => {
    let elementsData = await readElementsFromDir(elementsDirectoryPath);
    expect(elementsData).not.toBeNull();
    elementsData = mapIndex((element, index) => ({...element, id: index}), elementsData);
    http.get.mockImplementation((url, qs, account) => {
      if (!equals(account, __ACCOUNT__)) {
        throw new Error('This should never happen');
      }
      if (
        equals(url, 'elements') &&
        equals(qs, {
          where:
            "private='true' AND abridged='true' AND key in ('adpworkforcenow','actessentials','bigcommerce','bigcommerce-clone')",
        })
      ) {
        return Promise.resolve([]);
      } else if (
        equals(url, 'elements') &&
        equals(qs, {
          where:
            "extended='true' AND abridged='true' AND key in ('adpworkforcenow','actessentials','bigcommerce','bigcommerce-clone')",
        })
      ) {
        return Promise.resolve([]);
      } else if (equals(url, 'elements') && equals(qs, {where: "key = 'adpworkforcenow'"})) {
        return Promise.resolve(elementsData.filter(element => equals(element.key, 'adpworkforcenow')));
      } else if (equals(url, 'elements') && equals(qs, {where: "key = 'actessentials'"})) {
        return Promise.resolve(elementsData.filter(element => equals(element.key, 'actessentials')));
      } else if (equals(url, 'elements') && equals(qs, {where: "key = 'bigcommerce'"})) {
        return Promise.resolve(
          elementsData.filter(
            element => equals(element.key, 'bigcommerce') || equals(element.key, 'bigcommerce-clone'),
          ),
        );
      } else if (equals(url, 'elements') && equals(qs, {where: "key = 'bigcommerce-clone'"})) {
        return Promise.resolve(elementsData.filter(element => equals(element.key, 'bigcommerce-clone')));
      } else {
        return Promise.reject(new Error('not found'));
      }
    });
    await importElements(__ACCOUNT__, {
      dir: elementsDirectoryPath,
      name: pluck('key', elementsData).map(elementKey => ({
        key: elementKey,
        private: equals(elementKey, 'bigcommerce-clone'),
      })),
      jobId: 1,
      processId: 2,
    });
  });
  it('should stop execution if job gets canceled', async () => {
    let elementsData = await readElementsFromDir(elementsDirectoryPath);
    elementsData = mapIndex((element, index) => ({...element, id: index}), elementsData);
    expect(elementsData).not.toBeNull();
    canceledJob.isJobCancelled.mockResolvedValue(true);
    await importElements(__ACCOUNT__, {
      dir: elementsDirectoryPath,
      name: pluck('key', elementsData).map(elementKey => ({
        key: elementKey,
        private: equals(elementKey, 'bigcommerce-clone'),
      })),
      jobId: 1,
      processId: 2,
    });
    expect(http.get).toHaveBeenCalledTimes(2);
    expect(http.post).toHaveBeenCalledTimes(0);
    expect(http.update).toHaveBeenCalledTimes(0);
  });
  it('should be to handle and throw exception incase of failure', async () => {
    const elementsData = await readElementsFromDir(elementsDirectoryPath);
    expect(elementsData).not.toBeNull();
    http.get.mockImplementation((url, qs, account) => {
      if (!equals(account, __ACCOUNT__)) {
        throw new Error('This should never happen');
      }
      if (
        equals(url, 'elements') &&
        equals(qs, {
          where:
            "private='true' AND abridged='true' AND key in ('adpworkforcenow','actessentials','bigcommerce','bigcommerce-clone')",
        })
      ) {
        return Promise.resolve(elementsData.filter(element => equals(element.key, 'bigcommerce-clone')));
      } else if (
        equals(url, 'elements') &&
        equals(qs, {
          where:
            "extended='true' AND abridged='true' AND key in ('adpworkforcenow','actessentials','bigcommerce','bigcommerce-clone')",
        })
      ) {
        return Promise.resolve(elementsData.filter(element => !equals(element.key, 'bigcommerce-clone')));
      } else {
        return Promise.reject(new Error('Failed to retrieve resource'));
      }
    });
    http.update.mockImplementation((url, qs, account) => {
      if (!equals(account, __ACCOUNT__)) {
        throw new Error('This should never happen');
      }
      throw new Error('Failed to update resource');
    });
    const originalError = console.error;
    console.error = jest.fn();
    canceledJob.isJobCancelled.mockImplementation(() => false);
    try {
      await importElements(__ACCOUNT__, {
        dir: elementsDirectoryPath,
        name: pluck('key', elementsData).map(elementKey => ({
          key: elementKey,
          private: equals(elementKey, 'bigcommerce-clone'),
        })),
        jobId: 1,
        processId: 2,
      });
    } catch (error) {
      expect(http.get).toHaveBeenCalledTimes(5);
      expect(http.post).toHaveBeenCalledTimes(0);
      expect(http.update).toHaveBeenCalledTimes(1);
      expect(error.message).toEqual('Failed to update resource');
    }
    expect.assertions(5);
    console.error = originalError;
  });
});
