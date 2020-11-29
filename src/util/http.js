'use strict';

const rp = require('request-promise');
const authHeader = require('./authHeader');
const baseUrl = require('./baseUrl');
const { curry, test } = require('ramda');

// TODO: Will be replacing request-promise with axios soon
module.exports = {
	get: curry(async (path, qs = {}) => {
		let options = {
			method: "GET",
			headers: { Authorization: authHeader() },
			url: baseUrl(path),
			qs,
			json: true,
			strictSSL: false
		}

		try {
			return await rp(options);
		} catch (err) {
			if (test(/^No (.*) found$/, err.error.message)) {
				return {}
			} else {
				throw err
			}
		}
	}),
	post: curry(async (path, body) => {
		let options = {
			method: "POST",
			headers: { Authorization: authHeader() },
			url: baseUrl(path),
			body: body,
			json: true,
			strictSSL: false
		}

		try {
			return (await rp(options));
		} catch (err) {
			console.error(`Failed to create ${path} with name ${body ? body.name : body}. \n${err.message}`);
			throw err;
		}
	}),
	update: curry(async (path, body) => {
		let options = {
			method: "PUT",
			headers: { Authorization: authHeader() },
			url: baseUrl(path),
			body: body,
			json: true,
			strictSSL: false
		}

		try {
			return (await rp(options));
		} catch (err) {
			console.error(err.message);
			throw err;
		}
	}),
	delete: async (path, qs) => {
		let options = {
			method: "DELETE",
			headers: { Authorization: authHeader() },
			url: baseUrl(path),
			qs,
			json: true,
			strictSSL: false
		}

		try {
			return (await rp(options));
		} catch (err) {
			console.error(err.message);
		}
	}
};