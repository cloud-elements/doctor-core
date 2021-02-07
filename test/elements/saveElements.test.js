/* eslint-disable no-undef */
const fs = require('fs');
const fsExtra = require('fs-extra');
const path = require('path');
const {addIndex, equals, find, join, map, pluck} = require('ramda');
const canceledJob = require('../../src/events/cancelled-job');
const saveElements = require('../../src/core/elements/saveElements');
const buildElementsFromDir = require('../../src/core/elements/buildElementsFromDir');
const http = require('../../src/utils/http');

const mapIndex = addIndex(map);
const mockPath = path.resolve('./test/.temp/download/elements');
const elementsDirectoryPath = path.resolve('./test/assets/snapshot_export_103230_2020-11-27T05_53_21/elements');
jest.mock('../../src/utils/http');
jest.mock('../../src/events/cancelled-job');

describe('saveElements', () => {
  beforeEach(() => {
    if (!fs.existsSync(mockPath)) {
      fsExtra.ensureDirSync(mockPath);
    }
  });
  it('should be able to handle empty element keys', async () => {
    let elementsData = await buildElementsFromDir(elementsDirectoryPath);
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
      } else if (
        equals(url, 'elements') &&
        equals(qs, {
          where: "extended='true' AND key in ('wow')",
        })
      ) {
        return Promise.resolve([]);
      } else if (
        equals(url, 'elements') &&
        equals(qs, {
          where: "private='true' AND key in ('wow')",
        })
      ) {
        return Promise.resolve([]);
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
      } else if (equals(url, 'elements/1/export')) {
        return Promise.resolve(find(element => equals(element.key, 'adpworkforcenow'), elementsData));
      } else if (equals(url, 'elements/2/export')) {
        return Promise.resolve(find(element => equals(element.key, 'actessentials'), elementsData));
      } else if (equals(url, 'elements/3/export')) {
        return Promise.resolve(find(element => equals(element.key, 'bigcommerce'), elementsData));
      } else if (equals(url, 'elements/4/export')) {
        return Promise.resolve(find(element => equals(element.key, 'bigcommerce-clone'), elementsData));
      } else {
        console.log('url', url, qs);
        return Promise.reject(new Error('Not found'));
      }
    });
    http.update.mockImplementation((url, body, account) => {
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
    http.post.mockImplementation((url, body, account) => {
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
    await saveElements({
      account: __ACCOUNT__,
      options: {
        dir: mockPath,
        name: null,
        jobId: 1,
        processId: 2,
      },
    });
  });
  it('should be able to handle invalid element keys', async () => {
    let elementsData = await buildElementsFromDir(elementsDirectoryPath);
    expect(elementsData).not.toBeNull();
    elementsData = mapIndex((element, index) => ({...element, id: index}), elementsData);
    await saveElements({
      account: __ACCOUNT__,
      options: {
        dir: mockPath,
        name: 'wow',
        jobId: 1,
        processId: 2,
      },
    });
  });
  it('should be able to handle string element keys', async () => {
    let elementsData = await buildElementsFromDir(elementsDirectoryPath);
    expect(elementsData).not.toBeNull();
    elementsData = mapIndex((element, index) => ({...element, id: index}), elementsData);
    await saveElements({
      account: __ACCOUNT__,
      options: {
        dir: mockPath,
        name: join(',', pluck('key', elementsData)),
        jobId: 1,
        processId: 2,
      },
    });
  });
  it('should be able to handle array element keys where no private elements present ', async () => {
    let elementsData = await buildElementsFromDir(elementsDirectoryPath);
    expect(elementsData).not.toBeNull();
    elementsData = mapIndex((element, index) => ({...element, id: index}), elementsData);
    http.get.mockImplementation((url, qs, account) => {
      if (!equals(account, __ACCOUNT__)) {
        throw new Error('This should never happen');
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
          where:
            "extended='true' AND key in ('adpwfnSDF','adpworkforcenow','actessentials','bigcommerce','bigcommerce-clone')",
        })
      ) {
        return Promise.resolve(elementsData.filter(element => !equals(element.key, 'bigcommerce-clone')));
      } else if (
        equals(url, 'elements') &&
        equals(qs, {
          where: "extended='true' AND key in ('adpwfnSDF','adpworkforcenow','actessentials','bigcommerce')",
        })
      ) {
        return Promise.resolve(elementsData.filter(element => !equals(element.key, 'bigcommerce-clone')));
      } else if (equals(url, 'elements/1/export')) {
        return Promise.resolve(find(element => equals(element.key, 'adpworkforcenow'), elementsData));
      } else if (equals(url, 'elements/2/export')) {
        return Promise.resolve(find(element => equals(element.key, 'actessentials'), elementsData));
      } else if (equals(url, 'elements/3/export')) {
        return Promise.resolve(find(element => equals(element.key, 'bigcommerce'), elementsData));
      } else if (equals(url, 'elements/4/export')) {
        return Promise.resolve(find(element => equals(element.key, 'bigcommerce-clone'), elementsData));
      } else {
        return Promise.reject(new Error('Not found'));
      }
    });
    await saveElements({
      account: __ACCOUNT__,
      options: {
        dir: mockPath,
        name: pluck('key', elementsData).map(elementKey => ({
          key: elementKey,
          private: equals(elementKey, 'bigcommerce-clone'),
        })),
        jobId: 1,
        processId: 2,
      },
    });
  });
  it('should be able to handle array element keys where no extended elements present ', async () => {
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
        equals(qs, {
          where: "extended='true' AND key in ('adpwfnSDF','adpworkforcenow','actessentials','bigcommerce')",
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
    await saveElements({
      account: __ACCOUNT__,
      options: {
        dir: mockPath,
        name: pluck('key', elementsData).map(elementKey => ({
          key: elementKey,
          private: equals(elementKey, 'bigcommerce-clone'),
        })),
        jobId: 1,
        processId: 2,
      },
    });
  });
  it('should stop execution if job gets canceled', async () => {
    let elementsData = await buildElementsFromDir(elementsDirectoryPath);
    elementsData = mapIndex((element, index) => ({...element, id: index}), elementsData);
    expect(elementsData).not.toBeNull();
    canceledJob.isJobCancelled.mockResolvedValue(true);
    await saveElements({
      account: __ACCOUNT__,
      options: {
        dir: mockPath,
        name: pluck('key', elementsData).map(elementKey => ({
          key: elementKey,
          private: equals(elementKey, 'bigcommerce-clone'),
        })),
        jobId: 1,
        processId: 2,
      },
    });
    expect(http.get).toHaveBeenCalledTimes(2);
    expect(http.post).toHaveBeenCalledTimes(0);
    expect(http.update).toHaveBeenCalledTimes(0);
  });
  it('should be to handle and throw exception incase of failure', async () => {
    const elementsData = await buildElementsFromDir(elementsDirectoryPath);
    expect(elementsData).not.toBeNull();
    http.get.mockImplementation((url, qs, account) => {
      if (!equals(account, __ACCOUNT__)) {
        throw new Error('This should never happen');
      }
      throw new Error('Failed to retrieve resource');
    });
    http.update.mockImplementation((url, body, account) => {
      if (!equals(account, __ACCOUNT__)) {
        throw new Error('This should never happen');
      }
      throw new Error('Failed to retrieve resource');
    });
    http.post.mockImplementation((url, body, account) => {
      if (!equals(account, __ACCOUNT__)) {
        throw new Error('This should never happen');
      }
      throw new Error('Failed to retrieve resource');
    });
    const originalError = console.error;
    console.error = jest.fn();
    canceledJob.isJobCancelled.mockImplementation(() => false);
    try {
      await saveElements({
        account: __ACCOUNT__,
        options: {
          dir: mockPath,
          name: pluck('key', elementsData).map(elementKey => ({
            key: elementKey,
            private: equals(elementKey, 'bigcommerce-clone'),
          })),
          jobId: 1,
          processId: 2,
        },
      });
    } catch (error) {
      expect(http.get).toHaveBeenCalledTimes(1);
    }
    console.error = originalError;
  });
});
