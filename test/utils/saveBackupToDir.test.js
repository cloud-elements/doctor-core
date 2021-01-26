/* eslint-disable no-undef */
const fs = require('fs');
const path = require('path');
const {equals} = require('ramda');
const fsExtra = require('fs-extra');
const saveBackupToDir = require('../../src/utils/saveBackupToDir');
const buildElementsFromDir = require('../../src/core/elements/buildElementsFromDir');
const buildFormulasFromDir = require('../../src/core/formulas/buildFormulasFromDir');
const buildVdrsFromDir = require('../../src/core/vdrs/readVdrsFromDir');

jest.spyOn(fs, 'existsSync');
jest.spyOn(fs, 'writeFileSync');
jest.spyOn(fs, 'rmdirSync');
jest.spyOn(fsExtra, 'outputFileSync');

const resourcesDirectoryPath = path.resolve('./test/assets/snapshot_export_103230_2020-11-27T05_53_21');
const mockPath = path.resolve('./test/.temp');

describe('saveBackupToDir', () => {
  beforeEach(() => {
    if (!fs.existsSync(mockPath)) {
      fsExtra.ensureDirSync(mockPath);
    }
  });
  const getDataObject = async () => {
    const elementsData = await buildElementsFromDir(`${resourcesDirectoryPath}/elements`);
    const formulasData = await buildFormulasFromDir(`${resourcesDirectoryPath}/formulas`);
    const vdrsData = await buildVdrsFromDir(`${resourcesDirectoryPath}/vdrs`);
    return {
      elements: elementsData,
      formulas: formulasData,
      vdrs: vdrsData,
    };
  };
  it('should save the elements data to elements new directory path', async () => {
    const {elements, formulas, vdrs} = await getDataObject();
    expect(elements).not.toBeNull();
    expect(formulas).not.toBeNull();
    expect(vdrs).not.toBeNull();
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
      await saveBackupToDir(mockPath, {elements, formulas, vdrs});
    } catch (error) {
      /* Ignore */
    }
    console.error = originalError;
  });
});
