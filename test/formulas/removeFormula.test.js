/* eslint-disable no-undef */
const path = require('path');
const {pluck, addIndex, map, join} = require('ramda');
const canceledJob = require('../../src/events/cancelled-job');
const removeFormula = require('../../src/core/formulas/removeFormula');
const buildFormulasFromDir = require('../../src/core/formulas/buildFormulasFromDir');
const http = require('../../src/utils/http');

const mapIndex = addIndex(map);
const formulasDirectoryPath = path.resolve('./test/assets/snapshot_export_103230_2020-11-27T05_53_21/formulas');

jest.mock('../../src/utils/http');
jest.mock('../../src/events/cancelled-job');

describe('removeFormula', () => {
  it('should be able to handle empty formula name', async () => {
    let formulasData = await buildFormulasFromDir(formulasDirectoryPath);
    expect(formulasData).not.toBeNull();
    formulasData = mapIndex((formula, index) => ({...formula, id: index}), formulasData);
    http.get.mockResolvedValue(formulasData);
    http.delete.mockResolvedValue(true);
    await removeFormula({
      name: null,
      jobId: 1,
      processId: 2,
    });
  });
  it('should be able to handle invalid formula name', async () => {
    let formulasData = await buildFormulasFromDir(formulasDirectoryPath);
    expect(formulasData).not.toBeNull();
    formulasData = mapIndex((formula, index) => ({...formula, id: index}), formulasData);
    http.get.mockResolvedValue(formulasData);
    http.delete.mockResolvedValue(true);
    await removeFormula({
      name: 'wow',
      jobId: 1,
      processId: 2,
    });
  });
  it('should be able to handle string formula name', async () => {
    let formulasData = await buildFormulasFromDir(formulasDirectoryPath);
    expect(formulasData).not.toBeNull();
    formulasData = mapIndex((formula, index) => ({...formula, id: index}), formulasData);
    http.get.mockResolvedValue(formulasData);
    http.delete.mockResolvedValue(true);
    await removeFormula({
      name: join(',', pluck('name', formulasData)),
      jobId: 1,
      processId: 2,
    });
  });
  it('should be able to handle array formula name ', async () => {
    let formulasData = await buildFormulasFromDir(formulasDirectoryPath);
    expect(formulasData).not.toBeNull();
    formulasData = mapIndex((formula, index) => ({...formula, id: index}), formulasData);
    http.get.mockResolvedValue(formulasData);
    http.delete.mockResolvedValue(true);
    await removeFormula({
      name: pluck('name', formulasData).map(formulaName => ({
        name: formulaName,
      })),
      jobId: 1,
      processId: 2,
    });
  });
  it('should stop execution if job gets canceled at GET operation', async () => {
    let formulasData = await buildFormulasFromDir(formulasDirectoryPath);
    expect(formulasData).not.toBeNull();
    formulasData = mapIndex((formula, index) => ({...formula, id: index}), formulasData);
    const originalError = console.error;
    console.error = jest.fn();
    http.get.mockResolvedValue(formulasData);
    http.delete.mockImplementation(() => Promise.resolve(true));
    canceledJob.isJobCancelled.mockImplementation(() => true);
    try {
      await removeFormula({
        name: pluck('name', formulasData).map(formulaName => ({
          name: formulaName,
        })),
        jobId: 1,
        processId: 2,
      });
    } catch (error) {
      expect(http.get).toHaveBeenCalledTimes(1);
      expect(http.delete).toHaveBeenCalledTimes(2);
    }
    console.error = originalError;
  });
  it('should stop execution if job gets canceled at DELETE operation', async () => {
    let formulasData = await buildFormulasFromDir(formulasDirectoryPath);
    expect(formulasData).not.toBeNull();
    formulasData = mapIndex((formula, index) => ({...formula, id: index}), formulasData);
    const originalError = console.error;
    console.error = jest.fn();
    http.get.mockResolvedValue(formulasData);
    http.delete.mockImplementation(() => Promise.resolve(true));
    canceledJob.isJobCancelled.mockImplementation(() => true);
    try {
      await removeFormula({
        name: null,
        jobId: 1,
        processId: 2,
      });
    } catch (error) {
      expect(http.get).toHaveBeenCalledTimes(1);
      expect(http.delete).toHaveBeenCalledTimes(2);
    }
    console.error = originalError;
  });
  it('should be to handle and throw exception incase of failure', async () => {
    let formulasData = await buildFormulasFromDir(formulasDirectoryPath);
    expect(formulasData).not.toBeNull();
    formulasData = mapIndex((formula, index) => ({...formula, id: index}), formulasData);
    const originalError = console.error;
    console.error = jest.fn();
    http.get.mockResolvedValue(formulasData);
    http.delete.mockImplementation(() => Promise.reject(new Error('Invalid')));
    canceledJob.isJobCancelled.mockImplementation(() => false);
    try {
      await removeFormula({
        name: pluck('name', formulasData).map(formulaName => ({
          name: formulaName,
        })),
        jobId: 1,
        processId: 2,
      });
    } catch (error) {
      expect(http.get).toHaveBeenCalledTimes(2);
      expect(http.delete).toHaveBeenCalledTimes(2);
    }
    console.error = originalError;
  });
});
