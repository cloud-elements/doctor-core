const {logDebug} = require('../../utils/logger');
const mapP = require('../../utils/mapP');

const makePath = (elementKey, objectName) => `organizations/elements/${elementKey}/transformations/${objectName}`;
const remove = require('../../utils/remove');

module.exports = async transformations => {
  await mapP(async elementKey => {
    await mapP(async objectName => {
      logDebug(`Deleted Transformation: ${objectName} - ${elementKey}`);
      await remove(makePath(elementKey, objectName));
    })(Object.keys(transformations[elementKey]));
  })(Object.keys(transformations));
};
