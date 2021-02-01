const exportOperation = require('./src/actions/export');
const importOperation = require('./src/actions/import');
const deleteOperation = require('./src/actions/delete');
const serviceEventEmitter = require('./src/events/emitter');
// Export the import and export functionality for doctor service
module.exports = {
  exportAsset: exportOperation,
  importAsset: importOperation,
  deleteAsset: deleteOperation,
  eventHandler: serviceEventEmitter,
};
