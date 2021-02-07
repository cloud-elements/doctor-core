/* eslint-disable no-undef */
const path = require('path');
const {pluck, addIndex, map, join} = require('ramda');
const canceledJob = require('../../src/events/cancelled-job');
const importFormulas = require('../../src/core/formulas/importFormulas');
const buildFormulasFromDir = require('../../src/core/formulas/buildFormulasFromDir');
const http = require('../../src/utils/http');

const mapIndex = addIndex(map);
const formulasDirectoryPath = path.resolve('./test/assets/snapshot_export_103230_2020-11-27T05_53_21/formulas');
jest.mock('../../src/utils/http');
jest.mock('../../src/events/cancelled-job');

describe('importFormulas', () => {
  it('should be able to handle empty formula names', async () => {
    let formulasData = await buildFormulasFromDir(formulasDirectoryPath);
    expect(formulasData).not.toBeNull();
    formulasData = mapIndex((formula, index) => ({...formula, id: index}), formulasData);
    http.post.mockResolvedValue({id: 1});
    await importFormulas(__ACCOUNT__, {
      dir: formulasDirectoryPath,
      name: null,
      jobId: 1,
      processId: 2,
    });
  });
  it('should be able to handle invalid formula names', async () => {
    let formulasData = await buildFormulasFromDir(formulasDirectoryPath);
    expect(formulasData).not.toBeNull();
    formulasData = mapIndex(
      (formula, index) => ({
        ...formula,
        steps: [
          ...formula.steps,
          {
            name: 'sub-formula',
            onFailure: [],
            onSuccess: [],
            properties: {},
            type: 'formula',
          },
        ],
        id: index,
      }),
      formulasData,
    );
    http.post.mockResolvedValue({id: 1});
    await importFormulas(__ACCOUNT__, {
      dir: formulasDirectoryPath,
      name: 'wow',
      jobId: 1,
      processId: 2,
    });
  });
  it('should be able to handle string formula names', async () => {
    let formulasData = await buildFormulasFromDir(formulasDirectoryPath);
    expect(formulasData).not.toBeNull();
    formulasData = mapIndex((formula, index) => ({...formula, id: index}), formulasData);
    http.post.mockResolvedValue({id: 1});
    await importFormulas(__ACCOUNT__, {
      dir: formulasDirectoryPath,
      name: join(',', pluck('name', formulasData)),
      jobId: 1,
      processId: 2,
    });
  });
  it('should be able to handle array formula names', async () => {
    let formulasData = await buildFormulasFromDir(formulasDirectoryPath);
    expect(formulasData).not.toBeNull();
    formulasData = mapIndex((formula, index) => ({...formula, id: index}), formulasData);
    http.post.mockResolvedValue({id: 1});
    await importFormulas(__ACCOUNT__, {
      dir: formulasDirectoryPath,
      name: pluck('name', formulasData).map(formulaName => ({
        name: formulaName,
      })),
      jobId: 1,
      processId: 2,
    });
  });
  it('should be to handle and throw exception incase of failure', async () => {
    const formulasData = await buildFormulasFromDir(formulasDirectoryPath);
    expect(formulasData).not.toBeNull();
    http.post.mockRejectedValue(new Error('Failed to create formula'));
    http.update.mockRejectedValue(new Error('Failed to update formula'));
    const originalError = console.error;
    console.error = jest.fn();
    try {
      await importFormulas(__ACCOUNT__, {
        dir: formulasDirectoryPath,
        name: pluck('name', formulasData).map(formulaName => ({
          name: formulaName,
        })),
        jobId: 1,
        processId: 2,
      });
    } catch (error) {
      expect(http.get).toHaveBeenCalledTimes(1);
    }
    expect.assertions(2);
    console.error = originalError;
  });
  it('should stop execution if job gets canceled', async () => {
    let formulasData = await buildFormulasFromDir(formulasDirectoryPath);
    formulasData = mapIndex((formula, index) => ({...formula, id: index}), formulasData);
    expect(formulasData).not.toBeNull();
    canceledJob.isJobCancelled.mockResolvedValue(true);
    await importFormulas(__ACCOUNT__, {
      dir: formulasDirectoryPath,
      name: pluck('name', formulasData).map(formulaName => ({
        name: formulaName,
      })),
      jobId: 1,
      processId: 2,
    });
    expect(http.get).toHaveBeenCalledTimes(1);
    expect(http.post).toHaveBeenCalledTimes(0);
    expect(http.update).toHaveBeenCalledTimes(0);
  });
});
