/* eslint-disable no-undef */
const path = require('path');
const {equals, head, map, addIndex} = require('ramda');
const canceledJob = require('../../src/events/cancelled-job');
const createFormulas = require('../../src/core/formulas/createFormulas');
const readFormulasFromDir = require('../../src/core/formulas/readFormulasFromDir');
const http = require('../../src/utils/http');

const mapIdex = addIndex(map);
const formulasDirectoryPath = path.resolve('./test/assets/snapshot_export_103230_2020-11-27T05_53_21/formulas');
jest.mock('../../src/utils/http');
jest.mock('../../src/events/cancelled-job');

describe('createFormulas', () => {
  it('should be able to handle empty formulas', async () => {
    const formulasData = await readFormulasFromDir(formulasDirectoryPath);
    expect(formulasData).not.toBeNull();
    http.get.mockResolvedValue(Promise.resolve(formulasData));
    http.post.mockResolvedValue(Promise.resolve(head(formulasData)));
    http.update.mockResolvedValue(Promise.resolve(head(formulasData)));
    await createFormulas(__ACCOUNT__, [], 1, 2);
    expect(http.post).toHaveBeenCalledTimes(0);
    expect(http.update).toHaveBeenCalledTimes(0);
    expect(http.get).toHaveBeenCalledWith(expect.anything(), expect.anything(), __ACCOUNT__);
  });
  it('should be able to update existing formulas', async () => {
    let formulasData = await readFormulasFromDir(formulasDirectoryPath);
    formulasData = mapIdex((formula, index) => ({...formula, id: index}), formulasData);
    expect(formulasData).not.toBeNull();
    http.get.mockResolvedValue(Promise.resolve(formulasData));
    http.post.mockResolvedValue(Promise.resolve(head(formulasData)));
    http.update.mockResolvedValue(Promise.resolve(head(formulasData)));
    await createFormulas(__ACCOUNT__, formulasData, 1, 2);
    expect(http.post).toHaveBeenCalledTimes(0);
    expect(http.update).toHaveBeenCalledTimes(2);
    expect(http.get).toHaveBeenCalledWith(expect.anything(), expect.anything(), __ACCOUNT__);
    expect(http.update).toHaveBeenCalledWith(expect.anything(), expect.anything(), __ACCOUNT__);
  });
  it('should be able to create new formulas', async () => {
    let formulasData = await readFormulasFromDir(formulasDirectoryPath);
    formulasData = mapIdex((formula, index) => ({...formula, id: index}), formulasData);
    expect(formulasData).not.toBeNull();
    http.get.mockResolvedValue(Promise.resolve([]));
    http.post.mockResolvedValue(Promise.resolve(head(formulasData)));
    http.update.mockResolvedValue(Promise.resolve(head(formulasData)));
    await createFormulas(__ACCOUNT__, formulasData, 1, 2);
    expect(http.post).toHaveBeenCalledTimes(2);
    expect(http.update).toHaveBeenCalledTimes(2);
    expect(http.get).toHaveBeenCalledWith(expect.anything(), expect.anything(), __ACCOUNT__);
    expect(http.post).toHaveBeenCalledWith(expect.anything(), expect.anything(), __ACCOUNT__);
  });
  it('should be to handle and throw exception incase of update failure', async () => {
    let formulasData = await readFormulasFromDir(formulasDirectoryPath);
    formulasData = mapIdex((formula, index) => ({...formula, id: index}), formulasData);
    expect(formulasData).not.toBeNull();
    http.get.mockResolvedValue(Promise.resolve(formulasData));
    http.post.mockRejectedValue(new Error('Failed to create formula'));
    http.update.mockRejectedValue(new Error('Failed to update formula'));
    const originalError = console.error;
    console.error = jest.fn();
    try {
      await createFormulas(__ACCOUNT__, formulasData, 1, 2);
    } catch (error) {
      expect(http.get).toHaveBeenCalledTimes(1);
      expect(http.update).toHaveBeenCalledTimes(2);
      expect(http.get).toHaveBeenCalledWith(expect.anything(), expect.anything(), __ACCOUNT__);
      expect(http.update).toHaveBeenCalledWith(expect.anything(), expect.anything(), __ACCOUNT__);
    }
    expect.assertions(5);
    console.error = originalError;
  });
  it('should be to handle and throw exception incase of create failure', async () => {
    let formulasData = await readFormulasFromDir(formulasDirectoryPath);
    formulasData = mapIdex(
      (formula, index) =>
        equals(index, 0) ? {...formula, id: index, subFormulas: {...formula, id: index}} : {...formula, id: index},
      formulasData,
    );
    expect(formulasData).not.toBeNull();
    http.get.mockResolvedValue(Promise.resolve([]));
    http.post.mockRejectedValue(new Error('Failed to create formula'));
    http.update.mockRejectedValue(new Error('Failed to update formula'));
    const originalError = console.error;
    console.error = jest.fn();
    try {
      await createFormulas(__ACCOUNT__, formulasData, 1, 2);
    } catch (error) {
      expect(http.get).toHaveBeenCalledTimes(1);
      expect(http.post).toHaveBeenCalledTimes(2);
      expect(http.get).toHaveBeenCalledWith(expect.anything(), expect.anything(), __ACCOUNT__);
      expect(http.post).toHaveBeenCalledWith(expect.anything(), expect.anything(), __ACCOUNT__);
    }
    expect.assertions(5);
    console.error = originalError;
  });
  it('should stop execution if job gets canceled', async () => {
    let formulasData = await readFormulasFromDir(formulasDirectoryPath);
    formulasData = mapIdex((formula, index) => ({...formula, id: index}), formulasData);
    expect(formulasData).not.toBeNull();
    http.get.mockResolvedValue(Promise.resolve(formulasData));
    http.post.mockResolvedValue(Promise.resolve(head(formulasData)));
    http.update.mockResolvedValue(Promise.resolve(head(formulasData)));
    canceledJob.isJobCancelled.mockResolvedValue(true);
    canceledJob.addCancelledJobId.mockResolvedValue(true);
    canceledJob.removeCancelledJobId.mockResolvedValue(true);
    await createFormulas(__ACCOUNT__, formulasData, 1, 2);
  });
});
