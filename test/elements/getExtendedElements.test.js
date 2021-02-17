/* eslint-disable no-undef */
const {Assets} = require('../../src/constants/artifact');
const getExtendedElements = require('../../src/core/elements/getExtendedElements');
const http = require('../../src/utils/http');

jest.mock('../../src/utils/http');

describe('getExtendedElements', () => {
  it('should return extended elements with keys', async () => {
    const resp = [
      {name: 'jira', extended: true},
      {name: 'acton', extended: false},
      {name: 'hola', private: true},
    ];
    http.get.mockResolvedValue(resp);
    const result = await getExtendedElements(`'acton', 'jira'`, 123, __ACCOUNT__);
    expect(result).toEqual([{name: 'jira', extended: true}]);
    expect(http.get).toHaveBeenCalledWith(
      Assets.ELEMENTS,
      {where: "extended='true' AND abridged='true' AND key in (''acton'',' 'jira'')"},
      __ACCOUNT__,
    );
  });
  it('should return extended elements with element objects', async () => {
    http.get.mockResolvedValue([{name: 'Bob', extended: true}]);
    const result = await getExtendedElements([{key: 'jira', private: true}, {key: 'acton'}], 123, __ACCOUNT__);
    expect(result).toHaveLength(1);
    expect(http.get).toHaveBeenCalled();
    expect(http.get).toHaveBeenCalledWith(
      Assets.ELEMENTS,
      {where: "extended='true' AND abridged='true' AND key in ('acton')"},
      __ACCOUNT__,
    );
  });
  it('should not get extended elements and return empty', async () => {
    http.get.mockResolvedValue([{name: 'Bob'}]);
    const result = await getExtendedElements([], 123);
    expect(result).toHaveLength(0);
    expect(http.get).toHaveBeenCalledTimes(0);
  });
  it('should return extended elements with jobId null', async () => {
    http.get.mockResolvedValue([{name: 'Bob'}]);
    const result = await getExtendedElements([], null, __ACCOUNT__);
    expect(result).toHaveLength(0);
    expect(http.get).toHaveBeenCalledTimes(1);
    expect(http.get).toHaveBeenCalledWith(Assets.ELEMENTS, {where: "extended='true' AND abridged='true'"}, __ACCOUNT__);
  });
  it('should throw exception incase of failure', async () => {
    http.get.mockRejectedValue(() => new Error('Failed'));
    const originalError = console.error;
    console.error = jest.fn();
    try {
      const result = await getExtendedElements({wow: 'wow'}, null, __ACCOUNT__);
      expect(result).toHaveLength(0);
    } catch (error) {
      expect(http.get).toHaveBeenCalledTimes(1);
      expect(http.get).toHaveBeenCalledWith(
        Assets.ELEMENTS,
        {where: "extended='true' AND abridged='true'"},
        __ACCOUNT__,
      );
    }
    console.error = originalError;
  });
});
