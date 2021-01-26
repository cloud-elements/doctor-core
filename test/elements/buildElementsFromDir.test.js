/* eslint-disable no-undef */
const path = require('path');
const {indexBy, prop} = require('ramda');
const buildElementsFromDir = require('../../src/core/elements/buildElementsFromDir');

const elementsDirectoryPath = path.resolve('./test/assets/snapshot_export_103230_2020-11-27T05_53_21/elements');

describe('buildElementsFromDir', () => {
  it('should return the elements data from elements directory path', async () => {
    const expectedElementsKey = ['adpwfnSDF', 'adpworkforcenow', 'actessentials', 'bigcommerce', 'bigcommerce'];
    const elementsData = await buildElementsFromDir(elementsDirectoryPath);
    expect(elementsData).not.toBeNull();
    expect(elementsData).toHaveLength(expectedElementsKey.length);
    expectedElementsKey.forEach(elementKey => {
      const normalizeElementsData = indexBy(prop('key'), elementsData);
      const elementData = normalizeElementsData[elementKey];
      expect(elementData).toHaveProperty('active');
      expect(elementData).toHaveProperty('authentication');
      expect(elementData).toHaveProperty('configuration');
      expect(elementData).toHaveProperty('description');
      expect(elementData).toHaveProperty('parameters');
      expect(elementData).toHaveProperty('deleted');
      expect(elementData).toHaveProperty('extended');
      expect(elementData).toHaveProperty('hooks');
      expect(elementData).toHaveProperty('resources');
      elementData.resources.forEach(resource => {
        expect(resource).toHaveProperty('description');
        expect(resource).toHaveProperty('hooks');
        expect(resource).toHaveProperty('kind');
        expect(resource).toHaveProperty('method');
        expect(resource).toHaveProperty('path');
        expect(resource).toHaveProperty('vendorMethod');
        expect(resource).toHaveProperty('vendorPath');
        expect(resource).toHaveProperty('type');
      });
    });
  });
});
