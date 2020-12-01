'use strict';

const {curry} = require('ramda');
const rp = require('request-promise');
const authHeader = require('./authHeader');
const baseUrl = require('./baseUrl');
const { logError } = require('./logger');

module.exports = curry(async (path, body) => {
  let options = {
    json: true,
    headers: {
      Authorization: authHeader(),
    },
    url: baseUrl(path),
    method: "PUT",
    strictSSL: false,
    body: body
  };
  try {
    return (await rp(options));
  } catch (err) {
    logError(err.message);
    throw err;
  }
});