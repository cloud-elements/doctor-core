const {pipeP, map, prop, pipe} = require('ramda');
const get = require('../../utils/get');

const getInstances = () => get('instances', '');
const remove = require('../../utils/remove');

const makePath = id => `instances/${id}`;

module.exports = pipeP(getInstances, map(pipe(prop('id'), makePath, remove)));
