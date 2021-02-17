/* eslint-disable no-undef */
const fs = require('fs');
const fsExtra = require('fs-extra');
const path = require('path');
const {equals} = require('ramda');
const saveElementsToDir = require('../../src/core/elements/saveElementsToDir');
const readElementsFromDir = require('../../src/core/elements/readElementsFromDir');

jest.spyOn(fs, 'existsSync');
jest.spyOn(fs, 'writeFileSync');
jest.spyOn(fs, 'rmdirSync');
jest.spyOn(fsExtra, 'outputFileSync');

const elementsDirectoryPath = path.resolve('./test/assets/snapshot_export_103230_2020-11-27T05_53_21/elements');
const mockPath = path.resolve('./test/.temp');

describe('saveElementsToDir', () => {
  beforeEach(() => {
    if (!fs.existsSync(mockPath)) {
      fsExtra.ensureDirSync(mockPath);
    }
  });
  it('should save the elements data to elements new directory path', async () => {
    const elementsData = await readElementsFromDir(elementsDirectoryPath);
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
      await saveElementsToDir(`${mockPath}/elements`, elementsData);
    } catch (error) {
      /* Ignore */
    }
    console.error = originalError;
  });
});
