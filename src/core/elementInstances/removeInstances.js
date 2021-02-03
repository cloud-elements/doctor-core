const {pipeP, map, prop, pipe} = require('ramda');
const http = require('../../utils/http');

const getInstances = () => http.get('instances');
const makePath = id => `instances/${id}`;

module.exports = pipeP(getInstances, map(pipe(prop('id'), makePath, http.delete)));