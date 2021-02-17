/* eslint-disable no-undef */
const path = require('path');
const readFormulasFromDir = require('../../src/core/formulas/readFormulasFromDir');

const formulasDirectoryPath = path.resolve('./test/assets/snapshot_export_103230_2020-11-27T05_53_21/formulas');

describe('readFormulasFromDir', () => {
  it('should return the elements data from elements directory path', async () => {
    const formulasData = await readFormulasFromDir(formulasDirectoryPath);
    expect(formulasData).not.toBeNull();
  });
});
