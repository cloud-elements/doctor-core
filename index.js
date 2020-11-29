'use strict';

// Export the import and export functionality for doctor service
module.exports = {
    exportAsset: require('./src/actions/export'),
    importAsset: require('./src/actions/import'),
    deleteAsset: require('./src/actions/delete'),
    eventHandler: require('./src/events/emitter')
};