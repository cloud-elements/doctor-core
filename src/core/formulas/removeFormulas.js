const {prop, pipeP, map, pipe, tap} = require('ramda');
const http = require('../../utils/http');
const getFormulas = require('./getFormulas');

const makePath = id => `formulas/${id}`;
const makeMessage = name => `Deleted Formula: ${name}.`;
const log = map(pipe(prop('name'), makeMessage, console.log));

module.exports = pipeP(getFormulas, tap(log), map(pipe(prop('id'), makePath, http.delete)));
