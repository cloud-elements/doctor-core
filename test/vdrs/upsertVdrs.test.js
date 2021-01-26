/* eslint-disable no-undef */
const path = require('path');
const {JobType} = require('../../src/constants/artifact');
const canceledJob = require('../../src/events/cancelled-job');
const uploadMultipleVdrs = require('../../src/core/vdrs/uploadMultipleVdrs');
const buildVdrsFromDir = require('../../src/core/vdrs/readVdrsFromDir');
const http = require('../../src/utils/http');

const vdrsDirectoryPath = path.resolve('./test/assets/snapshot_export_103230_2020-11-27T05_53_21/vdrs');
jest.mock('../../src/utils/http');
jest.mock('../../src/events/cancelled-job');

describe('upsertVdrs', () => {
  it('should be to handle and throw exception incase of vdrs failure', async () => {
    const vdrsData = await buildVdrsFromDir(vdrsDirectoryPath);
    expect(vdrsData).not.toBeNull();
    http.update.mockImplementation(() => new Promise.reject(new Error('VDR not found')));
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
      expect(http.update).toHaveBeenCalledTimes(2);
    }
    console.error = originalError;
  });
  it('should be able to stop the import vdrs jobs', async () => {
    const vdrsData = await buildVdrsFromDir(vdrsDirectoryPath);
    expect(vdrsData).not.toBeNull();
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
