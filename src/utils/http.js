const rp = require('request-promise');
const {isNil, isEmpty, test} = require('ramda');
const {logError} = require('./logger');

const isNilOrEmpty = val => isNil(val) || isEmpty(val);
const buildURL = (baseUrl, endpoint) => `${baseUrl}/elements/api-v2/${endpoint}`;
const validateAccount = account => {
  if (isNilOrEmpty(account) || isNilOrEmpty(account.authorization) || isNilOrEmpty(account.baseUrl)) {
    logError('Missing authorization details');
    throw new Error('Missing authorization details');
  }
};

// TODO: Will be replacing request-promise with axios soon
module.exports = {
  get: async (path, qs = {}, account) => {
    validateAccount(account);
    const options = {
      method: 'GET',
      headers: {Authorization: account.authorization},
      url: buildURL(account.baseUrl, path),
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
  },
  post: async (path, body, account) => {
    validateAccount(account);
    const options = {
      method: 'POST',
      headers: {Authorization: account.authorization},
      url: buildURL(account.baseUrl, path),
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
  },
  update: async (path, body, account) => {
    validateAccount(account);
    const options = {
      method: 'PUT',
      headers: {Authorization: account.authorization},
      url: buildURL(account.baseUrl, path),
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
  },
  delete: async (path, qs = {}, account) => {
    validateAccount(account);
    const options = {
      method: 'DELETE',
      headers: {Authorization: account.authorization},
      url: buildURL(account.baseUrl, path),
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
