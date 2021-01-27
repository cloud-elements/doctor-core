/* eslint-disable no-undef */
const path = require('path');
const {equals} = require('ramda');
const {JobType} = require('../../src/constants/artifact');
const canceledJob = require('../../src/events/cancelled-job');
const exportVdrs = require('../../src/core/vdrs/exportVdrs');
const buildVdrsFromDir = require('../../src/core/vdrs/readVdrsFromDir');
const http = require('../../src/utils/http');

const vdrsDirectoryPath = path.resolve('./test/assets/snapshot_export_103230_2020-11-27T05_53_21/vdrs');
jest.mock('../../src/utils/http');
jest.mock('../../src/events/cancelled-job');

describe('exportVdrs', () => {
  it('should be able to handle empty vdr names', async () => {
    const vdrsData = await buildVdrsFromDir(vdrsDirectoryPath);
    const vdrNames = Object.keys(vdrsData);
    expect(vdrsData).not.toBeNull();
    http.get.mockImplementation(url => {
      if (equals(url, '/vdrs/ErpCatalogCategory/export')) {
        return Promise.resolve(vdrsData['ErpCatalogCategory']);
      } else if (equals(url, '/vdrs/autotaskVDR/export')) {
        return Promise.resolve(vdrsData['autotaskVDR']);
      } else {
        return Promise.reject(new Error('not found'));
      }
    });
    await exportVdrs(vdrNames, [], 1, 2, JobType.EXPORT);
  });
  it('should be able to handle invalid vdr names', async () => {
    const vdrsData = await buildVdrsFromDir(vdrsDirectoryPath);
    const vdrNames = Object.keys(vdrsData);
    expect(vdrsData).not.toBeNull();
    http.get.mockImplementation(url => {
      if (equals(url, '/vdrs/ErpCatalogCategory/export')) {
        return Promise.resolve(vdrsData['ErpCatalogCategory']);
      } else if (equals(url, '/vdrs/autotaskVDR/export')) {
        return Promise.resolve(vdrsData['autotaskVDR']);
      } else {
        return Promise.reject(new Error('not found'));
      }
    });
    await exportVdrs(vdrNames, ['wow'], 1, 2, JobType.EXPORT);
  });
  it('should be able to handle string vdr names', async () => {
    const vdrsData = await buildVdrsFromDir(vdrsDirectoryPath);
    const vdrNames = Object.keys(vdrsData);
    expect(vdrsData).not.toBeNull();
    http.get.mockImplementation(url => {
      if (equals(url, '/vdrs/ErpCatalogCategory/export')) {
        return Promise.resolve(vdrsData['ErpCatalogCategory']);
      } else if (equals(url, '/vdrs/autotaskVDR/export')) {
        return Promise.resolve(vdrsData['autotaskVDR']);
      } else {
        return Promise.reject(new Error('not found'));
      }
    });
    await exportVdrs(vdrNames, 'ErpCatalogCategory', 1, 2, JobType.PROMOTE_EXPORT);
  });
  it('should be able to handle array vdr names for single input', async () => {
    const vdrsData = await buildVdrsFromDir(vdrsDirectoryPath);
    const vdrNames = Object.keys(vdrsData);
    expect(vdrsData).not.toBeNull();
    http.get.mockImplementation(url => {
      if (equals(url, '/vdrs/ErpCatalogCategory/export')) {
        return Promise.resolve(vdrsData['ErpCatalogCategory']);
      } else if (equals(url, '/vdrs/autotaskVDR/export')) {
        return Promise.resolve(vdrsData['autotaskVDR']);
      } else {
        return Promise.reject(new Error('not found'));
      }
    });
    await exportVdrs(vdrNames, [{name: 'ErpCatalogCategory'}], 1, 2, JobType.PROMOTE_EXPORT);
  });
  it('should be able to handle array vdr names for multiple input', async () => {
    const vdrsData = await buildVdrsFromDir(vdrsDirectoryPath);
    const vdrNames = Object.keys(vdrsData);
    expect(vdrsData).not.toBeNull();
    http.get.mockImplementation(url => {
      if (equals(url, '/vdrs/ErpCatalogCategory/export')) {
        return Promise.resolve([]);
      } else if (equals(url, '/vdrs/autotaskVDR/export')) {
        return Promise.resolve(vdrsData);
      } else {
        return Promise.reject(new Error('not found'));
      }
    });
    await exportVdrs(vdrNames, [{name: 'ErpCatalogCategory', name: 'autotaskVDR'}], 1, 2, JobType.PROMOTE_EXPORT);
  });
  it('should stop execution if job gets canceled', async () => {
    const vdrsData = await buildVdrsFromDir(vdrsDirectoryPath);
    const vdrNames = Object.keys(vdrsData);
    expect(vdrsData).not.toBeNull();
    http.get.mockImplementation(url => {
      if (equals(url, '/vdrs/ErpCatalogCategory/export')) {
        return Promise.resolve(vdrsData['ErpCatalogCategory']);
      } else if (equals(url, '/vdrs/autotaskVDR/export')) {
        return Promise.resolve(vdrsData['autotaskVDR']);
      } else {
        return Promise.reject(new Error('not found'));
      }
    });
    canceledJob.isJobCancelled.mockResolvedValue(true);
    await exportVdrs(vdrNames, [{name: 'ErpCatalogCategory', name: 'autotaskVDR'}], 1, 2, JobType.PROMOTE_EXPORT);
  });
  it('should be to handle and throw exception incase of failure', async () => {
    const vdrsData = await buildVdrsFromDir(vdrsDirectoryPath);
    const vdrNames = Object.keys(vdrsData);
    expect(vdrsData).not.toBeNull();
    http.get.mockImplementation(url => {
      if (equals(url, '/vdrs/ErpCatalogCategory/export')) {
        return Promise.reject(vdrsData['ErpCatalogCategory']);
      } else if (equals(url, '/vdrs/autotaskVDR/export')) {
        return Promise.resolve(vdrsData['autotaskVDR']);
      } else {
        return Promise.reject(new Error('not found'));
      }
    });
    const originalError = console.error;
    console.error = jest.fn();
    canceledJob.isJobCancelled.mockImplementation(() => false);
    try {
      await exportVdrs(vdrNames, [{name: 'ErpCatalogCategory', name: 'autotaskVDR'}], 1, 2, JobType.PROMOTE_EXPORT);
    } catch (error) {
      expect(http.get).toHaveBeenCalledTimes(2);
    }
    console.error = originalError;
  });
});
