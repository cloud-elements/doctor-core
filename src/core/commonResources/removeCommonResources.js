const {pipeP} = require('ramda');
const deleteTransformations = require('./deleteTransformations');
const deleteObjectDefinitions = require('./deleteObjectDefinitions');
const findTransformations = require('./findTransformations');

module.exports = pipeP(findTransformations, deleteTransformations, deleteObjectDefinitions);
