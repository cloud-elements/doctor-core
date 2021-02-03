const rp = require('request-promise');
const {curry, test} = require('ramda');
const {logError} = require('./logger');
const buildURL = (baseUrl, endpoint) => `${baseUrl}/elements/api-v2/${endpoint}`;

// TODO: Will be replacing request-promise with axios soon
module.exports = {
  get: curry(async (endpoint, qs = {}, account) => {
    const options = {
      method: 'GET',
      headers: {Authorization: account.authorization},
      url: buildURL(account.baseUrl, endpoint),
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
  post: curry(async (endpoint, body, account) => {
    const options = {
      method: 'POST',
      headers: {Authorization: account.authorization},
      url: buildURL(account.baseUrl, endpoint),
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
  update: curry(async (endpoint, body, account) => {
    const options = {
      method: 'PUT',
      headers: {Authorization: account.authorization},
      url: buildURL(account.baseUrl, endpoint),
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
  delete: async (endpoint, qs = {}, account) => {
    const options = {
      method: 'DELETE',
      headers: {Authorization: account.authorization},
      url: buildURL(account.baseUrl, endpoint),
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
