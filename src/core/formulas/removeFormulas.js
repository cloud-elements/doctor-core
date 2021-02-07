const {__, curry, map, prop, pipeP, pipe, tap} = require('ramda');
const http = require('../../utils/http');
const getFormulas = require('./getFormulas');

const makePath = id => `formulas/${id}`;
const makeMessage = name => `Deleted Formula: ${name}.`;
const log = map(pipe(prop('name'), makeMessage, console.log));
const deleteFormula = curry((path, account) => http.delete(path, {}, account));

module.exports = account =>
  pipeP(getFormulas, tap(log), map(pipe(prop('id'), makePath, deleteFormula(__, account))))(account);
