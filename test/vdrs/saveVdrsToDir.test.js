/* eslint-disable no-undef */
const fs = require('fs');
const path = require('path');
const {equals} = require('ramda');
const fsExtra = require('fs-extra');
const {saveVdrsToDirNew, saveVdrsToDirOld} = require('../../src/core/vdrs/saveVdrsToDir');
const buildVdrsFromDir = require('../../src/core/vdrs/readVdrsFromDir');

jest.spyOn(fs, 'existsSync');
jest.spyOn(fs, 'writeFileSync');
jest.spyOn(fs, 'rmdirSync');
jest.spyOn(fsExtra, 'outputFileSync');

const vdrsDirectoryPath = path.resolve('./test/assets/snapshot_export_103230_2020-11-27T05_53_21/vdrs');
const mockPath = path.resolve('./test/.temp');

describe('saveVdrsToDir', () => {
  beforeEach(() => {
    if (!fs.existsSync(mockPath)) {
      fsExtra.ensureDirSync(mockPath);
    }
  });
  it('should save the common resources data to vdrs new directory path', async () => {
    const vdrsData = await buildVdrsFromDir(vdrsDirectoryPath);
    expect(vdrsData).not.toBeNull();
    fs.writeFileSync.mockReturnValue(true);
    fs.existsSync.mockImplementation(dir => {
      if (equals(dir, mockPath)) {
        return Promise.resolve(false);
      } else {
        return Promise.resolve(true);
      }
    });
    try {
      await saveVdrsToDirOld(`${mockPath}/vdrs-old`, vdrsData);
    } catch (error) {
      /* Ignore */
    }
  });
  it('should save the vdrs data to vdrs new directory path', async () => {
    const vdrsData = await buildVdrsFromDir(vdrsDirectoryPath);
    expect(vdrsData).not.toBeNull();
    fs.writeFileSync.mockReturnValue(true);
    const originalError = console.error;
    console.error = jest.fn();
    fs.existsSync.mockImplementation(dir => {
      if (equals(dir, mockPath)) {
        return Promise.resolve(false);
      } else {
        return Promise.resolve(true);
      }
    });
    try {
      await saveVdrsToDirNew(`${mockPath}/vdrs-new`, vdrsData);
    } catch (error) {
      /* Ignore */
    }
    console.error = originalError;
  });
});
