const {__, curry, filter, map, pipe, pipeP, propEq, prop, tap} = require('ramda');
const getElements = require('./getElements');
const http = require('../../utils/http');

const makePath = id => `elements/${id}`;
const makeMessage = name => `Deleted Element: ${name}.`;
const log = map(pipe(prop('name'), makeMessage, console.log));
const deleteElement = curry((path, account) => http.delete(path, {}, account));

module.exports = async (account, ...options) =>
  pipeP(
    getElements,
    filter(propEq('private', true)),
    tap(log),
    map(pipe(prop('id'), makePath, deleteElement(__, account))),
  )(account, ...options);
