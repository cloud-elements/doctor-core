const { Assets } = require("../../src/constants/artifact");
const getPrivateElements = require("../../src/util/elements/getPrivateElements");
const http = require("../../src/util/http");

jest.mock('../../src/util/http');

describe('Test getPrivateElements', () => {
	it('should return private elements with keys', async () => {
		const resp = [{ name: 'jira', private: true }];
		http.get.mockResolvedValue(resp);

		const result = await getPrivateElements(`'acton', 'jira'`, 123);
		expect(result).toEqual(resp);
		expect(http.get).toHaveBeenCalledWith(Assets.ELEMENTS, { "where": "private='true' AND key in (''acton'',' 'jira'')" });
	});

	it('should return private elements with element objects', async () => {
		const resp = [{ name: 'jira', private: true }];
		http.get.mockResolvedValue(resp);

		const result = await getPrivateElements([{ key: 'jira', private: true }, { key: 'acton' }], 123);
		expect(result).toEqual(resp);
		expect(http.get).toHaveBeenCalledWith(Assets.ELEMENTS, { "where": "private='true' AND key in ('jira')" });
	});

	it('should not get private elements and return empty', async () => {
		http.get.mockResolvedValue([{ name: 'jira' }]);

		const result = await getPrivateElements([], 123);
		expect(result).toHaveLength(0);
		expect(http.get).toHaveBeenCalledTimes(0);
	});

	it('should return private elements with jobId null', async () => {
		const resp = [{ name: 'jira' }]
		http.get.mockResolvedValue(resp);

		const result = await getPrivateElements([], null);
		expect(result).toEqual(resp);
		expect(http.get).toHaveBeenCalledTimes(1);
		expect(http.get).toHaveBeenCalledWith(Assets.ELEMENTS, { "where": "private='true'" });
	});
});