const {__, curry, map, pipeP, prop, pipe} = require('ramda');
const http = require('../../utils/http');

const getInstances = account => http.get('instances', {}, account);
const deleteInstance = curry((path, account) => http.delete(path, {}, account));
const makePath = id => `instances/${id}`;

module.exports = account =>
  pipeP(getInstances, map(pipe(prop('id'), makePath, deleteInstance(__, account))))(account);
