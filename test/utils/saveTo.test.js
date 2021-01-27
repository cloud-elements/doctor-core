/* eslint-disable no-undef */
const saveTo = require('../../src/utils/saveTo');

describe('saveTo', () => {
  it('should handle the save to directory path', async () => {
    await saveTo(
      (name, jobId, processId, jobType) => {
        expect(name).not.toBeNull();
        expect(jobId).not.toBeNull();
        expect(processId).not.toBeNull();
        expect(jobType).not.toBeNull();
        return [];
      },
      (filePath, data) => {
        expect(filePath).toBeNull();
        expect(data).toBeNull();
      },
      (dirPath, data) => {
        expect(dirPath).not.toBeNull();
        expect(data).not.toBeNull();
        return [];
      },
    )({
      dir: '/elements/',
      name: ['wow'],
      jobId: 1,
      processId: 2,
      jobType: 'export',
    });
  });
  it('should handle the save to file path', async () => {
    await saveTo(
      (name, jobId, processId, jobType) => {
        expect(name).not.toBeNull();
        expect(jobId).not.toBeNull();
        expect(processId).not.toBeNull();
        expect(jobType).not.toBeNull();
        return [];
      },
      (filePath, data) => {
        expect(filePath).not.toBeNull();
        expect(data).not.toBeNull();
        return [];
      },
      (dirPath, data) => {
        expect(dirPath).toBeNull();
        expect(data).toBeNull();
      },
    )({
      file: '/elements/',
      name: ['wow'],
      jobId: 1,
      processId: 2,
      jobType: 'export',
    });
  });
});
