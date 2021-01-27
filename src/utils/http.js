const rp = require('request-promise');
const {curry, test} = require('ramda');
const authHeader = require('./authHeader');
const baseUrl = require('./baseUrl');
const {logError} = require('./logger');

// TODO: Will be replacing request-promise with axios soon
module.exports = {
  get: curry(async (path, qs = {}) => {
    const options = {
      method: 'GET',
      headers: {Authorization: authHeader()},
      url: baseUrl(path),
      qs,
      json: true,
      strictSSL: false,
    };
    try {
      return await rp(options);
    } catch (err) {
      if (test(/^No (.*) found$/, err.error.message)) {
        return {};
      }
      throw err;
    }
  }),
  post: curry(async (path, body) => {
    const options = {
      method: 'POST',
      headers: {Authorization: authHeader()},
      url: baseUrl(path),
      body,
      json: true,
      strictSSL: false,
    };
    try {
      return await rp(options);
    } catch (err) {
      logError(`Failed to create ${path} with name ${body.name ? body.name : body}. \n${err.message}`);
      throw err;
    }
  }),
  update: curry(async (path, body) => {
    const options = {
      method: 'PUT',
      headers: {Authorization: authHeader()},
      url: baseUrl(path),
      body,
      json: true,
      strictSSL: false,
    };
    try {
      return await rp(options);
    } catch (err) {
      logError(err.message);
      throw err;
    }
  }),
  delete: async (path, qs) => {
    const options = {
      method: 'DELETE',
      headers: {Authorization: authHeader()},
      url: baseUrl(path),
      qs,
      json: true,
      strictSSL: false,
    };
    try {
      return await rp(options);
    } catch (err) {
      logError(err.message);
      throw err;
    }
  },
};
