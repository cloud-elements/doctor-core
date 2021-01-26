/* eslint-disable no-undef */
const path = require('path');
const {equals, join} = require('ramda');
const {JobType} = require('../../src/constants/artifact');
const canceledJob = require('../../src/events/cancelled-job');
const uploadMultipleVdrs = require('../../src/core/vdrs/uploadMultipleVdrs');
const buildVdrsFromDir = require('../../src/core/vdrs/readVdrsFromDir');
const http = require('../../src/utils/http');

const vdrsDirectoryPath = path.resolve('./test/assets/snapshot_export_103230_2020-11-27T05_53_21/vdrs');
const commonResourcesDirectoryPath = path.resolve(
  './test/assets/snapshot_export_103230_2020-11-27T05_53_21/commonResources',
);
jest.mock('../../src/utils/http');
jest.mock('../../src/events/cancelled-job');

describe('uploadMultipleVdrs', () => {
  it('should be able to import vdrs for empty vdr names', async () => {
    const vdrsData = await buildVdrsFromDir(vdrsDirectoryPath);
    expect(vdrsData).not.toBeNull();
    http.get.mockImplementation((url, qs) => {
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
    http.update.mockReturnValue(vdrsData);
    await uploadMultipleVdrs({
      dir: vdrsDirectoryPath,
      name: null,
      jobId: 1,
      jobType: JobType.EXPORT,
      processId: 2,
    });
  });
  it('should not be able to import vdrs for invalid vdr names', async () => {
    const vdrsData = await buildVdrsFromDir(vdrsDirectoryPath);
    expect(vdrsData).not.toBeNull();
    http.get.mockImplementation((url, qs) => {
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
    http.update.mockReturnValue(vdrsData);
    await uploadMultipleVdrs({
      dir: vdrsDirectoryPath,
      name: 'wow',
      jobId: 1,
      jobType: JobType.EXPORT,
      processId: 2,
    });
  });
  it('should be able to import vdrs for string vdr names', async () => {
    const vdrsData = await buildVdrsFromDir(vdrsDirectoryPath);
    expect(vdrsData).not.toBeNull();
    http.get.mockImplementation((url, qs) => {
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
    http.update.mockReturnValue(vdrsData);
    await uploadMultipleVdrs({
      dir: vdrsDirectoryPath,
      name: join(',', Object.keys(vdrsData)),
      jobId: 1,
      jobType: JobType.EXPORT,
      processId: 2,
    });
  });
  it('should be able to import vdrs for array vdr names', async () => {
    const vdrsData = await buildVdrsFromDir(vdrsDirectoryPath);
    expect(vdrsData).not.toBeNull();
    http.get.mockImplementation((url, qs) => {
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
    http.update.mockReturnValue(vdrsData);
    await uploadMultipleVdrs({
      dir: vdrsDirectoryPath,
      name: Object.keys(vdrsData).map(vdrName => ({name: vdrName})),
      jobId: 1,
      jobType: JobType.PROMOTE_EXPORT,
      processId: 2,
    });
  });
  it('should be able to import common resources for empty vdr names', async () => {
    const vdrsData = await buildVdrsFromDir(vdrsDirectoryPath);
    expect(vdrsData).not.toBeNull();
    http.get.mockImplementation((url, qs) => {
      if (equals(url, 'vdrs') && equals(qs, {where: "objectName in ('ErpCatalogCategory')"})) {
        return Promise.resolve(vdrsData['ErpCatalogCategory']);
      } else if (equals(url, 'vdrs') && equals(qs, {where: "objectName in ('autotaskVDR')"})) {
        return Promise.resolve(vdrsData['autotaskVDR']);
      } else if (equals(url, 'vdrs') && equals(qs, {where: "objectName in ('ErpCatalogCategory','autotaskVDR')"})) {
        return Promise.resolve(vdrsData);
      } else if (equals(url, 'vdrs') && equals(qs, '')) {
        return Promise.resolve(vdrsData);
      } else if (equals(url, '/vdrs/ErpCatalogCategory/export')) {
        return Promise.resolve(vdrsData['ErpCatalogCategory']);
      } else if (equals(url, '/vdrs/autotaskVDR/export')) {
        return Promise.resolve(vdrsData['autotaskVDR']);
      } else if (equals(url, 'organizations/objects/definitions')) {
        return Promise.resolve([]);
      } else {
        return Promise.resolve([]);
      }
    });
    http.update.mockReturnValue(vdrsData);
    http.post.mockReturnValue(vdrsData);
    await uploadMultipleVdrs({
      dir: commonResourcesDirectoryPath,
      name: null,
      version: 'v1',
      jobId: 1,
      jobType: JobType.EXPORT,
      processId: 2,
    });
  });
  it('should be able to import common resources for empty vdr names', async () => {
    const vdrsData = await buildVdrsFromDir(vdrsDirectoryPath);
    expect(vdrsData).not.toBeNull();
    http.get.mockImplementation((url, qs) => {
      if (equals(url, 'vdrs') && equals(qs, {where: "objectName in ('ErpCatalogCategory')"})) {
        return Promise.resolve(vdrsData['ErpCatalogCategory']);
      } else if (equals(url, 'vdrs') && equals(qs, {where: "objectName in ('autotaskVDR')"})) {
        return Promise.resolve(vdrsData['autotaskVDR']);
      } else if (equals(url, 'vdrs') && equals(qs, {where: "objectName in ('ErpCatalogCategory','autotaskVDR')"})) {
        return Promise.resolve(vdrsData);
      } else if (equals(url, 'vdrs') && equals(qs, '')) {
        return Promise.resolve(vdrsData);
      } else if (equals(url, '/vdrs/ErpCatalogCategory/export')) {
        return Promise.resolve(vdrsData['ErpCatalogCategory']);
      } else if (equals(url, '/vdrs/autotaskVDR/export')) {
        return Promise.resolve(vdrsData['autotaskVDR']);
      } else if (equals(url, 'organizations/objects/definitions')) {
        return Promise.resolve(vdrsData);
      } else {
        return Promise.resolve(vdrsData);
      }
    });
    http.update.mockReturnValue(vdrsData);
    http.post.mockReturnValue(vdrsData);
    await uploadMultipleVdrs({
      dir: commonResourcesDirectoryPath,
      name: null,
      version: 'v1',
      jobId: 1,
      jobType: JobType.EXPORT,
      processId: 2,
    });
  });
  it('should be able to import common resources for string vdr names', async () => {
    const vdrsData = await buildVdrsFromDir(vdrsDirectoryPath);
    expect(vdrsData).not.toBeNull();
    http.get.mockImplementation((url, qs) => {
      if (equals(url, 'vdrs') && equals(qs, {where: "objectName in ('ErpCatalogCategory')"})) {
        return Promise.resolve(vdrsData['ErpCatalogCategory']);
      } else if (equals(url, 'vdrs') && equals(qs, {where: "objectName in ('autotaskVDR')"})) {
        return Promise.resolve(vdrsData['autotaskVDR']);
      } else if (equals(url, 'vdrs') && equals(qs, {where: "objectName in ('ErpCatalogCategory','autotaskVDR')"})) {
        return Promise.resolve(vdrsData);
      } else if (equals(url, 'vdrs') && equals(qs, '')) {
        return Promise.resolve(vdrsData);
      } else if (equals(url, '/vdrs/ErpCatalogCategory/export')) {
        return Promise.resolve(vdrsData['ErpCatalogCategory']);
      } else if (equals(url, '/vdrs/autotaskVDR/export')) {
        return Promise.resolve(vdrsData['autotaskVDR']);
      } else if (equals(url, 'organizations/objects/definitions')) {
        return Promise.resolve([]);
      } else {
        return Promise.resolve([]);
      }
    });
    http.update.mockReturnValue(vdrsData);
    http.post.mockReturnValue(vdrsData);
    await uploadMultipleVdrs({
      dir: commonResourcesDirectoryPath,
      name: join(',', Object.keys(vdrsData)),
      version: 'v1',
      jobId: 1,
      jobType: JobType.EXPORT,
      processId: 2,
    });
  });
  it('should be able to import common resources for array vdr names', async () => {
    const vdrsData = await buildVdrsFromDir(vdrsDirectoryPath);
    expect(vdrsData).not.toBeNull();
    http.get.mockImplementation((url, qs) => {
      if (equals(url, 'vdrs') && equals(qs, {where: "objectName in ('ErpCatalogCategory')"})) {
        return Promise.resolve(vdrsData['ErpCatalogCategory']);
      } else if (equals(url, 'vdrs') && equals(qs, {where: "objectName in ('autotaskVDR')"})) {
        return Promise.resolve(vdrsData['autotaskVDR']);
      } else if (equals(url, 'vdrs') && equals(qs, {where: "objectName in ('ErpCatalogCategory','autotaskVDR')"})) {
        return Promise.resolve(vdrsData);
      } else if (equals(url, 'vdrs') && equals(qs, '')) {
        return Promise.resolve(vdrsData);
      } else if (equals(url, '/vdrs/ErpCatalogCategory/export')) {
        return Promise.resolve(vdrsData['ErpCatalogCategory']);
      } else if (equals(url, '/vdrs/autotaskVDR/export')) {
        return Promise.resolve(vdrsData['autotaskVDR']);
      } else if (equals(url, 'organizations/objects/definitions')) {
        return Promise.resolve(vdrsData);
      } else {
        return Promise.resolve([]);
      }
    });
    http.update.mockReturnValue(vdrsData);
    http.post.mockReturnValue(vdrsData);
    await uploadMultipleVdrs({
      dir: commonResourcesDirectoryPath,
      name: Object.keys(vdrsData).map(vdrName => ({name: vdrName})),
      version: 'v1',
      jobId: 1,
      jobType: JobType.EXPORT,
      processId: 2,
    });
  });
  it('should be to handle and throw exception incase of vdrs failure', async () => {
    const vdrsData = await buildVdrsFromDir(vdrsDirectoryPath);
    expect(vdrsData).not.toBeNull();
    http.get.mockImplementation((url, qs) => {
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
    http.update.mockReturnValue(new Error('VDR not found'));
    const originalError = console.error;
    console.error = jest.fn();
    try {
      await uploadMultipleVdrs({
        dir: vdrsDirectoryPath,
        name: Object.keys(vdrsData).map(vdrName => ({name: vdrName})),
        useNew: true,
        jobId: 1,
        jobType: JobType.PROMOTE_EXPORT,
        processId: 2,
      });
    } catch (error) {
      expect(http.get).toHaveBeenCalledTimes(1);
    }
    console.error = originalError;
  });
  it('should be to handle and throw exception incase of common resources failure', async () => {
    const vdrsData = await buildVdrsFromDir(vdrsDirectoryPath);
    expect(vdrsData).not.toBeNull();
    http.get.mockImplementation((url, qs) => {
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
    http.update.mockReturnValue(new Error('VDR not found'));
    const originalError = console.error;
    console.error = jest.fn();
    try {
      await uploadMultipleVdrs({
        dir: commonResourcesDirectoryPath,
        name: Object.keys(vdrsData).map(vdrName => ({name: vdrName})),
        version: 'v1',
        jobId: 1,
        jobType: JobType.EXPORT,
        processId: 2,
      });
    } catch (error) {
      expect(http.get).toHaveBeenCalledTimes(1);
    }
    console.error = originalError;
  });
  it('should be able to stop the import vdrs jobs', async () => {
    const vdrsData = await buildVdrsFromDir(vdrsDirectoryPath);
    expect(vdrsData).not.toBeNull();
    http.get.mockImplementation((url, qs) => {
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
    http.update.mockReturnValue(vdrsData);
    canceledJob.isJobCancelled.mockImplementation(() => true);
    await uploadMultipleVdrs({
      dir: vdrsDirectoryPath,
      name: Object.keys(vdrsData).map(vdrName => ({name: vdrName})),
      jobId: 1,
      jobType: JobType.PROMOTE_EXPORT,
      processId: 2,
    });
  });
});
