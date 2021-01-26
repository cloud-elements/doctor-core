/* eslint-disable no-undef */
const path = require('path');
const buildFormulasFromDir = require('../../src/core/formulas/buildFormulasFromDir');

const formulasDirectoryPath = path.resolve('./test/assets/snapshot_export_103230_2020-11-27T05_53_21/formulas');

describe('buildFormulasFromDir', () => {
  it('should return the elements data from elements directory path', async () => {
    const formulasData = await buildFormulasFromDir(formulasDirectoryPath);
    expect(formulasData).not.toBeNull();
  });
});
