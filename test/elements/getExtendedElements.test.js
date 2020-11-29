const { Assets } = require("../../src/constants/artifact");
const getExtendedElements = require("../../src/util/elements/getExtendedElements");
const http = require("../../src/util/http");

jest.mock('../../src/util/http');

describe('Test getExtendedElements', () => {
	it('should return extended elements with keys', async () => {
		const resp = [{ name: 'jira', extended: true }, { name: 'acton', extended: false }, { name: 'hola', private: true }];
		http.get.mockResolvedValue(resp);

		const result = await getExtendedElements(`'acton', 'jira'`, 123);
		expect(result).toEqual([{ name: 'jira', extended: true }]);
		expect(http.get).toHaveBeenCalledWith(Assets.ELEMENTS, { "where": "extended='true' AND key in (''acton'',' 'jira'')" });
	});

	it('should return extended elements with element objects', async () => {
		http.get.mockResolvedValue([{ name: 'Bob', extended: true }]);

		const result = await getExtendedElements([{ key: 'jira', private: true }, { key: 'acton' }], 123);
		expect(result).toHaveLength(1);
		expect(http.get).toHaveBeenCalled();
		expect(http.get).toHaveBeenCalledWith(Assets.ELEMENTS, { "where": "extended='true' AND key in ('acton')" });
	});

	it('should not get extended elements and return empty', async () => {
		http.get.mockResolvedValue([{ name: 'Bob' }]);

		const result = await getExtendedElements([], 123);
		expect(result).toHaveLength(0);
		expect(http.get).toHaveBeenCalledTimes(0);
	});

	it('should return extended elements with jobId null', async () => {
		http.get.mockResolvedValue([{ name: 'Bob' }]);

		const result = await getExtendedElements([], null);
		expect(result).toHaveLength(0);
		expect(http.get).toHaveBeenCalledTimes(1);
		expect(http.get).toHaveBeenCalledWith(Assets.ELEMENTS, { "where": "extended='true'" });
	});
});