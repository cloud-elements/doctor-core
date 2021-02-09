/* eslint-disable no-undef */
const fs = require('fs');
const fsExtra = require('fs-extra');
const path = require('path');
const {join} = require('ramda');
const {JobType, Assets} = require('../../src/constants/artifact');
const saveFormulas = require('../../src/core/formulas/saveFormulas');
const buildFormulasFromDir = require('../../src/core/formulas/buildFormulasFromDir');
const http = require('../../src/utils/http');

const mockPath = path.resolve('./test/.temp/download/formulas');
const formulasDirectoryPath = path.resolve('./test/assets/snapshot_export_103230_2020-11-27T05_53_21/formulas');
jest.mock('../../src/utils/http');

describe('saveFormulas', () => {
  beforeEach(() => {
    if (!fs.existsSync(mockPath)) {
      fsExtra.ensureDirSync(mockPath);
    }
  });
  it('should be able to handle empty formula names', async () => {
    const formulasData = await buildFormulasFromDir(formulasDirectoryPath);
    expect(formulasData).not.toBeNull();
    http.get.mockReturnValue(formulasData);
    await saveFormulas({
      account: __ACCOUNT__,
      object: Assets.FORMULAS,
      options: {
        dir: mockPath,
        name: null,
        jobId: 1,
        jobType: JobType.EXPORT,
        processId: 2,
      },
    });
  });
  it('should be able to handle invalid formula names', async () => {
    const formulasData = await buildFormulasFromDir(formulasDirectoryPath);
    expect(formulasData).not.toBeNull();
    http.get.mockReturnValue(formulasData);
    await saveFormulas({
      account: __ACCOUNT__,
      object: Assets.FORMULAS,
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
  it('should be able to handle valid string formula names', async () => {
    const formulasData = await buildFormulasFromDir(formulasDirectoryPath);
    expect(formulasData).not.toBeNull();
    http.get.mockReturnValue(formulasData);
    await saveFormulas({
      account: __ACCOUNT__,
      object: Assets.FORMULAS,
      options: {
        dir: mockPath,
        name: join(',', Object.keys(formulasData)),
        jobId: 1,
        jobType: JobType.EXPORT,
        processId: 2,
      },
    });
  });
  it('should be able to handle valid array formula names', async () => {
    const formulasData = await buildFormulasFromDir(formulasDirectoryPath);
    expect(formulasData).not.toBeNull();
    http.get.mockReturnValue(formulasData);
    await saveFormulas({
      account: __ACCOUNT__,
      object: Assets.FORMULAS,
      options: {
        dir: mockPath,
        name: Object.keys(formulasData).map(vdrName => ({name: vdrName})),
        jobId: 1,
        jobType: JobType.PROMOTE_EXPORT,
        processId: 2,
      },
    });
  });
  it('should be to handle and throw exception incase of failure', async () => {
    const formulasData = await buildFormulasFromDir(formulasDirectoryPath);
    expect(formulasData).not.toBeNull();
    http.get.mockReturnValue(new Error('Formula not found'));
    const originalError = console.error;
    console.error = jest.fn();
    try {
      await saveFormulas({
        account: __ACCOUNT__,
        object: Assets.FORMULAS,
        options: {
          dir: mockPath,
          name: Object.keys(formulasData).map(vdrName => ({name: vdrName})),
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
