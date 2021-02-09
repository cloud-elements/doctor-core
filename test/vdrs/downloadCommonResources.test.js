/* eslint-disable no-undef */
const path = require('path');
const {equals, join} = require('ramda');
const {JobType, Assets} = require('../../src/constants/artifact');
const downloadVdrs = require('../../src/core/vdrs/downloadVdrs');
const buildVdrsFromDir = require('../../src/core/vdrs/readVdrsFromDir');
const http = require('../../src/utils/http');

const mockPath = path.resolve('./test/.temp/download/commonResources');
const vdrsDirectoryPath = path.resolve('./test/assets/snapshot_export_103230_2020-11-27T05_53_21/vdrs');
jest.mock('../../src/utils/http');

describe('downloadCommonResources', () => {
  it('should be able to handle empty common resources names', async () => {
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
    await downloadVdrs({
      account: __ACCOUNT__,
      object: Assets.VDRS,
      options: {
        dir: mockPath,
        name: null,
        jobId: 1,
        jobType: JobType.EXPORT,
        processId: 2,
      },
    });
  });
  it('should be able to handle invalid common resources names', async () => {
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
    await downloadVdrs({
      account: __ACCOUNT__,
      object: Assets.VDRS,
      options: {
        dir: mockPath,
        name: 'wow',
        version: 'v1',
        jobId: 1,
        jobType: JobType.EXPORT,
        processId: 2,
      },
    });
  });
  it('should be able to handle valid string common resources names', async () => {
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
    await downloadVdrs({
      account: __ACCOUNT__,
      object: Assets.VDRS,
      options: {
        dir: mockPath,
        name: join(',', Object.keys(vdrsData)),
        jobId: 1,
        jobType: JobType.EXPORT,
        processId: 2,
      },
    });
  });
  it('should be able to handle valid array common resources names', async () => {
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
    await downloadVdrs({
      account: __ACCOUNT__,
      object: Assets.VDRS,
      options: {
        dir: mockPath,
        name: Object.keys(vdrsData).map(vdrName => ({name: vdrName})),
        jobId: 1,
        jobType: JobType.PROMOTE_EXPORT,
        processId: 2,
      },
    });
  });
  it('should be to handle and throw exception incase of failure', async () => {
    const vdrsData = await buildVdrsFromDir(vdrsDirectoryPath);
    expect(vdrsData).not.toBeNull();
    http.get.mockReturnValue(new Error('VDR not found'));
    const originalError = console.error;
    console.error = jest.fn();
    try {
      await downloadVdrs({
        account: __ACCOUNT__,
        object: Assets.VDRS,
        options: {
          dir: mockPath,
          name: Object.keys(vdrsData).map(vdrName => ({name: vdrName})),
          jobId: 1,
          jobType: JobType.PROMOTE_EXPORT,
          processId: 2,
        },
      });
    } catch (error) {
      expect(http.get).toHaveBeenCalledTimes(1);
    }
    console.error = originalError;
  });
});
