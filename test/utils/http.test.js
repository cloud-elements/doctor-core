/* eslint-disable no-undef */
const request = require('request-promise');
const http = require('../../src/utils/http');

jest.mock('request-promise');

describe('http', () => {
  it('should be able to make HTTP GET API call', async () => {
    request.mockImplementation(() => Promise.resolve([]));
    await http.get('/elements', {name: 'some'}, __ACCOUNT__);
    expect(request).toHaveBeenCalledTimes(1);
  });
  it('should be able to make HTTP GET API call and catch exception', async () => {
    const originalError = console.error;
    console.error = jest.fn();
    request.mockImplementation(() => Promise.reject({error: {message: new Error('Invalid')}}));
    try {
      await http.get('/elements', {}, __ACCOUNT__);
    } catch (error) {
      expect(request).toHaveBeenCalledTimes(1);
    }
    expect.assertions(1);
    console.error = originalError;
  });
  it('should be able to make HTTP GET API call and catch No found exception', async () => {
    const originalError = console.error;
    console.error = jest.fn();
    request.mockImplementation(options => Promise.reject({error: {message: 'No element found'}}));
    const result = await http.get('/elements', {}, __ACCOUNT__);
    expect(result).toEqual({});
    expect(request).toHaveBeenCalledTimes(1);
    expect.assertions(2);
    console.error = originalError;
  });
  it('should throw error for HTTP GET if incorrect/missing authorization details', async () => {
    const originalError = console.error;
    console.error = jest.fn();
    try {
      await http.get('/elements');
    } catch (error) {
      expect(request).toHaveBeenCalledTimes(0);
      expect(error.message).toEqual('Missing authorization details');
    }
    expect.assertions(2);
    console.error = originalError;
  });
  it('should be able to make HTTP POST API call', async () => {
    request.mockImplementation(() => Promise.resolve([]));
    await http.post('/elements', {}, __ACCOUNT__);
    expect(request).toHaveBeenCalledTimes(1);
  });
  it('should be able to make HTTP POST API call and catch exception', async () => {
    const originalError = console.error;
    console.error = jest.fn();
    request.mockImplementation(() => Promise.reject({message: 'Error creating'}));
    try {
      await http.post('/elements', {}, __ACCOUNT__);
    } catch (error) {
      expect(request).toHaveBeenCalledTimes(1);
      expect(error.message).toEqual('Error creating');
    }
    expect.assertions(2);
    console.error = originalError;
  });
  it('should be able to make HTTP POST API call and catch exception with message', async () => {
    const originalError = console.error;
    console.error = jest.fn();
    request.mockImplementation(() => Promise.reject({message: 'Error creating'}));
    try {
      await http.post('/elements', {name: 'sfdc'}, __ACCOUNT__);
    } catch (error) {
      expect(request).toHaveBeenCalledTimes(1);
      expect(error.message).toEqual('Error creating');
    }
    expect.assertions(2);
    console.error = originalError;
  });
  it('should be able to make HTTP PUT API call', async () => {
    request.mockImplementation(() => Promise.resolve([]));
    await http.update('/elements', {}, __ACCOUNT__);
    expect(request).toHaveBeenCalledTimes(1);
  });
  it('should be able to make HTTP PUT API call and catch exception', async () => {
    const originalError = console.error;
    console.error = jest.fn();
    request.mockImplementation(() => Promise.reject(new Error('Invalid')));
    try {
      await http.update('/elements', {}, __ACCOUNT__);
    } catch (error) {
      expect(request).toHaveBeenCalledTimes(1);
      expect(error.message).toEqual('Invalid');
    }
    expect.assertions(2);
    console.error = originalError;
  });
  it('should be able to make HTTP DELETE API call', async () => {
    request.mockImplementation(() => Promise.resolve([]));
    await http.delete('/elements', {}, __ACCOUNT__);
    expect(request).toHaveBeenCalledTimes(1);
  });
  it('should be able to make HTTP DELETE API call and catch exception', async () => {
    const originalError = console.error;
    console.error = jest.fn();
    request.mockImplementation(() => Promise.reject(new Error('Invalid')));
    try {
      await http.delete('/elements', {}, __ACCOUNT__);
    } catch (error) {
      expect(request).toHaveBeenCalledTimes(1);
      expect(error.message).toEqual('Invalid');
    }
    expect.assertions(2);
    console.error = originalError;
  });
  it('should throw error for HTTP DELETE if incorrect/missing authorization details', async () => {
    const originalError = console.error;
    console.error = jest.fn();
    try {
      await http.delete('/elements');
    } catch (error) {
      expect(request).toHaveBeenCalledTimes(0);
      expect(error.message).toEqual('Missing authorization details');
    }
    expect.assertions(2);
    console.error = originalError;
  });
});
