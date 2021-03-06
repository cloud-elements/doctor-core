/* eslint-disable no-undef */
const fs = require('fs');
const fsExtra = require('fs-extra');
const path = require('path');
const {equals, join} = require('ramda');
const {JobType, Assets} = require('../../src/constants/artifact');
const exportVdrs = require('../../src/core/vdrs/exportVdrs');
const buildVdrsFromDir = require('../../src/core/vdrs/readVdrsFromDir');
const http = require('../../src/utils/http');

const mockPath = path.resolve('./test/.temp/download/vdrs');
const vdrsDirectoryPath = path.resolve('./test/assets/snapshot_export_103230_2020-11-27T05_53_21/vdrs');
jest.mock('../../src/utils/http');

describe('exportVdrs', () => {
  beforeEach(() => {
    if (!fs.existsSync(mockPath)) {
      fsExtra.ensureDirSync(mockPath);
    }
  });
  it('should be able to handle empty vdr names', async () => {
    const vdrsData = await buildVdrsFromDir(vdrsDirectoryPath);
    expect(vdrsData).not.toBeNull();
    http.get.mockImplementation((url, qs, account) => {
      if (!equals(account, __ACCOUNT__)) {
        throw new Error('This should never happen');
      }
      if (equals(url, 'vdrs') && equals(qs, {where: "objectName in ('ErpCatalogCategory')"})) {
        return Promise.resolve(vdrsData['ErpCatalogCategory']);
      } else if (equals(url, 'vdrs') && equals(qs, {where: "objectName in ('autotaskVDR')"})) {
        return Promise.resolve(vdrsData['autotaskVDR']);
      } else if (equals(url, 'vdrs') && equals(qs, {where: "objectName in ('ErpCatalogCategory','autotaskVDR')"})) {
        return Promise.resolve(vdrsData);
      } else if (equals(url, 'vdrs') && (equals(qs, {where: "objectName in ('')"}) || equals(qs, ''))) {
        return Promise.resolve(vdrsData);
      } else if (equals(url, '/vdrs/ErpCatalogCategory/export')) {
        return Promise.resolve(vdrsData['ErpCatalogCategory']);
      } else if (equals(url, '/vdrs/autotaskVDR/export')) {
        return Promise.resolve(vdrsData['autotaskVDR']);
      } else {
        return Promise.reject(new Error('not found'));
      }
    });
    await exportVdrs({
      account: __ACCOUNT__,
      object: Assets.VDRS,
      options: {
        dir: mockPath,
        name: null,
        useNew: true,
        jobId: 1,
        jobType: JobType.EXPORT,
        processId: 2,
      },
    });
  });
  it('should be able to handle invalid vdr names', async () => {
    const vdrsData = await buildVdrsFromDir(vdrsDirectoryPath);
    expect(vdrsData).not.toBeNull();
    http.get.mockImplementation((url, qs, account) => {
      if (!equals(account, __ACCOUNT__)) {
        throw new Error('This should never happen');
      }
      if (equals(url, 'vdrs') && equals(qs, {where: "objectName in ('ErpCatalogCategory')"})) {
        return Promise.resolve(vdrsData['ErpCatalogCategory']);
      } else if (equals(url, 'vdrs') && equals(qs, {where: "objectName in ('autotaskVDR')"})) {
        return Promise.resolve(vdrsData['autotaskVDR']);
      } else if (equals(url, 'vdrs') && equals(qs, {where: "objectName in ('ErpCatalogCategory','autotaskVDR')"})) {
        return Promise.resolve(vdrsData);
      } else if (equals(url, 'vdrs') && equals(qs, '')) {
        return Promise.resolve(vdrsData);
      }
      if (equals(url, '/vdrs/ErpCatalogCategory/export')) {
        return Promise.resolve(vdrsData['ErpCatalogCategory']);
      } else if (equals(url, '/vdrs/autotaskVDR/export')) {
        return Promise.resolve(vdrsData['autotaskVDR']);
      } else {
        return Promise.resolve([]);
      }
    });
    await exportVdrs({
      account: __ACCOUNT__,
      object: Assets.VDRS,
      options: {
        dir: mockPath,
        name: 'wow',
        version: 'v1',
        useNew: true,
        jobId: 1,
        jobType: JobType.EXPORT,
        processId: 2,
      },
    });
  });
  it('should be able to handle valid/empty file or directory', async () => {
    const vdrsData = await buildVdrsFromDir(vdrsDirectoryPath);
    expect(vdrsData).not.toBeNull();
    http.get.mockImplementation((url, qs, account) => {
      if (!equals(account, __ACCOUNT__)) {
        throw new Error('This should never happen');
      }
      if (equals(url, 'vdrs') && equals(qs, {where: "objectName in ('ErpCatalogCategory')"})) {
        return Promise.resolve(vdrsData['ErpCatalogCategory']);
      } else if (equals(url, 'vdrs') && equals(qs, {where: "objectName in ('autotaskVDR')"})) {
        return Promise.resolve(vdrsData['autotaskVDR']);
      } else if (equals(url, 'vdrs') && equals(qs, {where: "objectName in ('ErpCatalogCategory','autotaskVDR')"})) {
        return Promise.resolve(vdrsData);
      } else if (equals(url, 'vdrs') && equals(qs, '')) {
        return Promise.resolve(vdrsData);
      }
      if (equals(url, '/vdrs/ErpCatalogCategory/export')) {
        return Promise.resolve(vdrsData['ErpCatalogCategory']);
      } else if (equals(url, '/vdrs/autotaskVDR/export')) {
        return Promise.resolve(vdrsData['autotaskVDR']);
      } else {
        return Promise.reject(new Error('not found'));
      }
    });
    await exportVdrs({
      account: __ACCOUNT__,
      object: Assets.VDRS,
      options: {
        name: join(',', Object.keys(vdrsData)),
        useNew: true,
        jobId: 1,
        jobType: JobType.EXPORT,
        processId: 2,
      },
    });
  });
  it('should be able to handle valid string vdr names for file', async () => {
    const vdrsData = await buildVdrsFromDir(vdrsDirectoryPath);
    expect(vdrsData).not.toBeNull();
    http.get.mockImplementation((url, qs, account) => {
      if (!equals(account, __ACCOUNT__)) {
        throw new Error('This should never happen');
      }
      if (equals(url, 'vdrs') && equals(qs, {where: "objectName in ('ErpCatalogCategory')"})) {
        return Promise.resolve(vdrsData['ErpCatalogCategory']);
      } else if (equals(url, 'vdrs') && equals(qs, {where: "objectName in ('autotaskVDR')"})) {
        return Promise.resolve(vdrsData['autotaskVDR']);
      } else if (equals(url, 'vdrs') && equals(qs, {where: "objectName in ('ErpCatalogCategory','autotaskVDR')"})) {
        return Promise.resolve(vdrsData);
      } else if (equals(url, 'vdrs') && equals(qs, '')) {
        return Promise.resolve(vdrsData);
      }
      if (equals(url, '/vdrs/ErpCatalogCategory/export')) {
        return Promise.resolve(vdrsData['ErpCatalogCategory']);
      } else if (equals(url, '/vdrs/autotaskVDR/export')) {
        return Promise.resolve(vdrsData['autotaskVDR']);
      } else {
        return Promise.reject(new Error('not found'));
      }
    });
    await exportVdrs({
      account: __ACCOUNT__,
      object: Assets.VDRS,
      options: {
        file: `${mockPath}/file/vdr.json`,
        name: join(',', Object.keys(vdrsData)),
        useNew: true,
        jobId: 1,
        jobType: JobType.EXPORT,
        processId: 2,
      },
    });
  });
  it('should be able to handle valid string vdr names for directory', async () => {
    const vdrsData = await buildVdrsFromDir(vdrsDirectoryPath);
    expect(vdrsData).not.toBeNull();
    http.get.mockImplementation((url, qs, account) => {
      if (!equals(account, __ACCOUNT__)) {
        throw new Error('This should never happen');
      }
      if (equals(url, 'vdrs') && equals(qs, {where: "objectName in ('ErpCatalogCategory')"})) {
        return Promise.resolve(vdrsData['ErpCatalogCategory']);
      } else if (equals(url, 'vdrs') && equals(qs, {where: "objectName in ('autotaskVDR')"})) {
        return Promise.resolve(vdrsData['autotaskVDR']);
      } else if (equals(url, 'vdrs') && equals(qs, {where: "objectName in ('ErpCatalogCategory','autotaskVDR')"})) {
        return Promise.resolve(vdrsData);
      } else if (equals(url, 'vdrs') && equals(qs, '')) {
        return Promise.resolve(vdrsData);
      }
      if (equals(url, '/vdrs/ErpCatalogCategory/export')) {
        return Promise.resolve(vdrsData['ErpCatalogCategory']);
      } else if (equals(url, '/vdrs/autotaskVDR/export')) {
        return Promise.resolve(vdrsData['autotaskVDR']);
      } else {
        return Promise.reject(new Error('not found'));
      }
    });
    await exportVdrs({
      account: __ACCOUNT__,
      object: Assets.VDRS,
      options: {
        dir: mockPath,
        name: join(',', Object.keys(vdrsData)),
        useNew: true,
        jobId: 1,
        jobType: JobType.EXPORT,
        processId: 2,
      },
    });
  });
  it('should be able to handle valid array vdr names', async () => {
    const vdrsData = await buildVdrsFromDir(vdrsDirectoryPath);
    expect(vdrsData).not.toBeNull();
    http.get.mockImplementation((url, qs, account) => {
      if (!equals(account, __ACCOUNT__)) {
        throw new Error('This should never happen');
      }
      if (equals(url, 'vdrs') && equals(qs, {where: "objectName in ('ErpCatalogCategory')"})) {
        return Promise.resolve(vdrsData['ErpCatalogCategory']);
      } else if (equals(url, 'vdrs') && equals(qs, {where: "objectName in ('autotaskVDR')"})) {
        return Promise.resolve(vdrsData['autotaskVDR']);
      } else if (equals(url, 'vdrs') && equals(qs, {where: "objectName in ('ErpCatalogCategory','autotaskVDR')"})) {
        return Promise.resolve(vdrsData);
      } else if (equals(url, 'vdrs') && equals(qs, '')) {
        return Promise.resolve(vdrsData);
      }
      if (equals(url, '/vdrs/ErpCatalogCategory/export')) {
        return Promise.resolve(vdrsData['ErpCatalogCategory']);
      } else if (equals(url, '/vdrs/autotaskVDR/export')) {
        return Promise.resolve(vdrsData['autotaskVDR']);
      } else {
        return Promise.reject(new Error('not found'));
      }
    });
    await exportVdrs({
      account: __ACCOUNT__,
      object: Assets.VDRS,
      options: {
        dir: mockPath,
        name: Object.keys(vdrsData).map(vdrName => ({name: vdrName})),
        useNew: true,
        jobId: 1,
        jobType: JobType.PROMOTE_EXPORT,
        processId: 2,
      },
    });
  });
  it('should be to handle and throw exception incase of failure', async () => {
    const vdrsData = await buildVdrsFromDir(vdrsDirectoryPath);
    expect(vdrsData).not.toBeNull();
    http.get.mockImplementation((url, qs, account) => {
      if (!equals(account, __ACCOUNT__)) {
        throw new Error('This should never happen');
      }
      throw new Error('VDR not found');
    });
    const originalError = console.error;
    console.error = jest.fn();
    try {
      await exportVdrs({
        account: __ACCOUNT__,
        object: Assets.VDRS,
        options: {
          dir: mockPath,
          name: Object.keys(vdrsData).map(vdrName => ({name: vdrName})),
          useNew: true,
          jobId: 1,
          jobType: JobType.PROMOTE_EXPORT,
          processId: 2,
        },
      });
    } catch (error) {
      expect(http.get).toHaveBeenCalledTimes(1);
    }
    expect.assertions(2);
    console.error = originalError;
  });
});
