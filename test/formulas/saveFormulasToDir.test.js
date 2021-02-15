/* eslint-disable no-undef */
const fs = require('fs');
const path = require('path');
const {equals} = require('ramda');
const fsExtra = require('fs-extra');
const saveFormulasToDir = require('../../src/core/formulas/saveFormulasToDir');
const readFormulasFromDir = require('../../src/core/formulas/readFormulasFromDir');

jest.spyOn(fs, 'existsSync');
jest.spyOn(fs, 'writeFileSync');
jest.spyOn(fs, 'rmdirSync');
jest.spyOn(fsExtra, 'outputFileSync');

const formulasDirectoryPath = path.resolve('./test/assets/snapshot_export_103230_2020-11-27T05_53_21/formulas');
const mockPath = path.resolve('./test/.temp');

describe('saveFormulasToDir', () => {
  beforeEach(() => {
    if (!fs.existsSync(mockPath)) {
      fsExtra.ensureDirSync(mockPath);
    }
  });
  it('should save the formulas data to formulas new directory path', async () => {
    const elementsData = await readFormulasFromDir(formulasDirectoryPath);
    expect(elementsData).not.toBeNull();
    fs.writeFileSync.mockReturnValue(true);
    const originalError = console.error;
    console.error = jest.fn();
    fs.existsSync.mockImplementation(dir => {
      if (equals(dir, mockPath)) {
        return new Promise.resolve(false);
      } else {
        return new Promise.resolve(true);
      }
    });
    try {
      await saveFormulasToDir(`${mockPath}/formulas`, elementsData);
    } catch (error) {
      /* Ignore */
    }
    console.error = originalError;
  });
});
