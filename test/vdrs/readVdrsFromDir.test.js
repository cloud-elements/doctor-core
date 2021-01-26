/* eslint-disable no-undef */
const path = require('path');
const buildVdrsFromDir = require('../../src/core/vdrs/readVdrsFromDir');

const vdrsDirectoryPath = path.resolve('./test/assets/snapshot_export_103230_2020-11-27T05_53_21/vdrs');
const commonResourcesDirectoryPath = path.resolve(
  './test/assets/snapshot_export_103230_2020-11-27T05_53_21/commonResources',
);

describe('buildVdrsFromDir', () => {
  it('should return the vdrs data from common resources directory path', async () => {
    const commonResourcesData = await buildVdrsFromDir(commonResourcesDirectoryPath);
    expect(commonResourcesData).not.toBeNull();
    expect(commonResourcesData).toHaveProperty('objectDefinitions');
    expect(commonResourcesData).toHaveProperty('transformations');
  });
  it('should return the vdrs data from vdrs directory path', async () => {
    const vdrsData = await buildVdrsFromDir(vdrsDirectoryPath);
    expect(vdrsData).not.toBeNull();
    expect(vdrsData).not.toHaveProperty('objectDefinitions');
    expect(vdrsData).not.toHaveProperty('transformations');
  });
});
