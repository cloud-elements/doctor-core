/* eslint-disable no-undef */
const {Assets} = require('../../src/constants/artifact');
const getPrivateElements = require('../../src/core/elements/getPrivateElements');
const http = require('../../src/utils/http');

jest.mock('../../src/utils/http');

describe('getPrivateElements', () => {
  it('should return private elements with keys', async () => {
    const resp = [{name: 'jira', private: true}];
    http.get.mockResolvedValue(resp);
    const result = await getPrivateElements(`'acton', 'jira'`, 123, __ACCOUNT__);
    expect(result).toEqual(resp);
    expect(http.get).toHaveBeenCalledWith(
      Assets.ELEMENTS,
      {where: "private='true' AND key in (''acton'',' 'jira'')"},
      __ACCOUNT__,
    );
  });
  it('should return private elements with element objects', async () => {
    const resp = [{name: 'jira', private: true}];
    http.get.mockResolvedValue(resp);
    const result = await getPrivateElements([{key: 'jira', private: true}, {key: 'acton'}], 123, __ACCOUNT__);
    expect(result).toEqual(resp);
    expect(http.get).toHaveBeenCalledWith(Assets.ELEMENTS, {where: "private='true' AND key in ('jira')"}, __ACCOUNT__);
  });
  it('should not get private elements and return empty', async () => {
    http.get.mockResolvedValue([{name: 'jira'}]);
    const result = await getPrivateElements([], 123, null);
    expect(result).toHaveLength(0);
    expect(http.get).toHaveBeenCalledTimes(0);
  });
  it('should return private elements with jobId null', async () => {
    const resp = [{name: 'jira'}];
    http.get.mockResolvedValue(resp);
    const result = await getPrivateElements([], null, __ACCOUNT__);
    expect(result).toEqual(resp);
    expect(http.get).toHaveBeenCalledTimes(1);
    expect(http.get).toHaveBeenCalledWith(Assets.ELEMENTS, {where: "private='true'"}, __ACCOUNT__);
  });
  it('should throw exception incase of failure', async () => {
    http.get.mockRejectedValue(() => new Error('Failed'));
    const originalError = console.error;
    console.error = jest.fn();
    try {
      const result = await getPrivateElements({wow: 'wow'}, null, __ACCOUNT__);
      expect(result).toHaveLength(0);
    } catch (error) {
      expect(http.get).toHaveBeenCalledTimes(1);
      expect(http.get).toHaveBeenCalledWith(Assets.ELEMENTS, {where: "private='true'"}, __ACCOUNT__);
    }
    console.error = originalError;
  });
});
