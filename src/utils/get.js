const rp = require('request-promise');
const {curry, test, assoc} = require('ramda');
const authHeader = require('./authHeader');
const baseUrl = require('./baseUrl');

module.exports = curry(async (path, qs) => {
  let options = {
    json: true,
    headers: {
      Authorization: authHeader(),
    },
    url: baseUrl(path),
    method: 'GET',
    strictSSL: false,
  };
  options = qs ? assoc('qs', qs, options) : '';
  try {
    return await rp(options);
  } catch (err) {
    if (test(/^No (.*) found$/, err.error.message)) {
      return {};
    }
    throw err;
  }
});
