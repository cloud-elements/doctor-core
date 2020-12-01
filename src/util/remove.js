'use strict';

const rp = require('request-promise');
const authHeader = require('./authHeader');
const baseUrl = require('./baseUrl');
const { logError } = require('./logger');

module.exports = async (path, qs) => {
  let options = {
    json: true,
    headers: {
      Authorization: authHeader(),
    },
    url: baseUrl(path),
    strictSSL: false,
    method: "DELETE",
    qs : qs ? qs : {}
  };
  try {
    return (await rp(options));
  } catch (err) {
    logError(err.message);
  }
}