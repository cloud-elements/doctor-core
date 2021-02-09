const http = require('../../utils/http');
const {logDebug} = require('../../utils/logger');
const mapP = require('../../utils/mapP');

const makePath = (elementKey, objectName) => `organizations/elements/${elementKey}/transformations/${objectName}`;

module.exports = async (transformations, account) => {
  await mapP(async elementKey => {
    await mapP(async objectName => {
      logDebug(`Deleted Transformation: ${objectName} - ${elementKey}`);
      await http.delete(makePath(elementKey, objectName), {}, account);
    })(Object.keys(transformations[elementKey]));
  })(Object.keys(transformations));
};
