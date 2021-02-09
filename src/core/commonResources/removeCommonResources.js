const {__, curry, pipeP} = require('ramda');
const http = require('../../utils/http');
const deleteTransformations = require('./deleteTransformations');
const findTransformations = require('./findTransformations');

const deleteObjectDefinitions = account => http.delete('organizations/objects/definitions', {}, account);

module.exports = account =>
  pipeP(
    findTransformations,
    curry(deleteTransformations)(__, account),
    curry(deleteObjectDefinitions)(account),
  )(account);
