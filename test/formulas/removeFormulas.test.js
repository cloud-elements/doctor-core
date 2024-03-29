/* eslint-disable no-undef */
const path = require('path');
const {pluck, addIndex, map, join} = require('ramda');
const {JobType} = require('../../src/constants/artifact');
const canceledJob = require('../../src/events/cancelled-job');
const removeFormulas = require('../../src/core/formulas/removeFormulas');
const readFormulasFromDir = require('../../src/core/formulas/readFormulasFromDir');
const http = require('../../src/utils/http');

const mapIndex = addIndex(map);
const formulasDirectoryPath = path.resolve('./test/assets/snapshot_export_103230_2020-11-27T05_53_21/formulas');

jest.mock('../../src/utils/http');
jest.mock('../../src/events/cancelled-job');

describe('removeFormulas', () => {
  it('should be able to handle empty formula name', async () => {
    let formulasData = await readFormulasFromDir(formulasDirectoryPath);
    expect(formulasData).not.toBeNull();
    formulasData = mapIndex((formula, index) => ({...formula, id: index}), formulasData);
    http.get.mockResolvedValue(formulasData);
    await removeFormulas(__ACCOUNT__);
    expect(http.delete).toHaveBeenCalledTimes(3);
  });
  it('should be able to handle invalid formula name', async () => {
    let formulasData = await readFormulasFromDir(formulasDirectoryPath);
    expect(formulasData).not.toBeNull();
    formulasData = mapIndex((formula, index) => ({...formula, id: index}), formulasData);
    http.get.mockResolvedValue(formulasData);
    http.delete.mockResolvedValue(true);
    await removeFormulas(__ACCOUNT__, 'wow', 1, 2, JobType.EXPORT);
    expect(http.delete).toHaveBeenCalledTimes(3);
  });
  it('should be able to handle string formula name', async () => {
    let formulasData = await readFormulasFromDir(formulasDirectoryPath);
    expect(formulasData).not.toBeNull();
    formulasData = mapIndex((formula, index) => ({...formula, id: index}), formulasData);
    http.get.mockResolvedValue(formulasData);
    http.delete.mockResolvedValue(true);
    await removeFormulas(__ACCOUNT__, join(',', pluck('name', formulasData)), 1, 2, JobType.PROMOTE_EXPORT);
    expect(http.delete).toHaveBeenCalledTimes(3);
  });
  it('should be able to handle array formula name ', async () => {
    let formulasData = await readFormulasFromDir(formulasDirectoryPath);
    expect(formulasData).not.toBeNull();
    formulasData = mapIndex((formula, index) => ({...formula, id: index}), formulasData);
    http.get.mockResolvedValue(formulasData);
    http.delete.mockResolvedValue(true);
    await removeFormulas(
      __ACCOUNT__,
      pluck('name', formulasData).map(formulaName => ({
        name: formulaName,
      })),
      1,
      2,
      JobType.PROMOTE_EXPORT,
    );
    expect(http.delete).toHaveBeenCalledTimes(3);
  });
  it('should stop execution if job gets canceled', async () => {
    let formulasData = await readFormulasFromDir(formulasDirectoryPath);
    expect(formulasData).not.toBeNull();
    formulasData = mapIndex((formula, index) => ({...formula, id: index}), formulasData);
    http.get.mockResolvedValue(formulasData);
    http.delete.mockResolvedValue(true);
    canceledJob.isJobCancelled.mockReturnValue(true);
    await removeFormulas(
      __ACCOUNT__,
      pluck('name', formulasData).map(formulaName => ({
        name: formulaName,
      })),
      1,
      2,
      JobType.PROMOTE_EXPORT,
    );
  });
  it('should be to handle and throw exception incase of failure', async () => {
    let formulasData = await readFormulasFromDir(formulasDirectoryPath);
    expect(formulasData).not.toBeNull();
    formulasData = mapIndex((formula, index) => ({...formula, id: index}), formulasData);
    http.get.mockResolvedValue(new Error('Invalid'));
    canceledJob.isJobCancelled.mockReturnValue(false);
    const originalError = console.error;
    console.error = jest.fn();
    try {
      await removeFormulas(
        pluck('name', formulasData).map(formulaName => ({
          name: formulaName,
        })),
        1,
        2,
        JobType.EXPORT,
      );
    } catch (error) {}
    expect(http.get).toHaveBeenCalledTimes(1);
    expect(http.delete).toHaveBeenCalledTimes(0);
    console.error = originalError;
  });
});
