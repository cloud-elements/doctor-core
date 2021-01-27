/* eslint-disable no-undef */
const request = require('request-promise');
const http = require('../../src/utils/http');

jest.mock('request-promise');

describe('http', () => {
  it('should be able to make HTTP GET API call', async () => {
    request.mockImplementation(() => Promise.resolve([]));
    await http.get('/elements');
    expect(request).toHaveBeenCalledTimes(1);
  });
  it('should be able to make HTTP GET API call and catch exception', async () => {
    const originalError = console.error;
    console.error = jest.fn();
    request.mockImplementation(() => Promise.reject({error: {message: new Error('Invalid')}}));
    try {
      await http.get('/elements');
    } catch (error) {
      expect(request).toHaveBeenCalledTimes(1);
    }
    console.error = originalError;
  });
  it('should be able to make HTTP GET API call and catch No found exception', async () => {
    const originalError = console.error;
    console.error = jest.fn();
    request.mockImplementation(() => Promise.reject({error: {message: 'No element found'}}));
    try {
      await http.get('/elements');
    } catch (error) {
      expect(request).toHaveBeenCalledTimes(1);
    }
    console.error = originalError;
  });
  it('should be able to make HTTP POST API call', async () => {
    request.mockImplementation(() => Promise.resolve([]));
    await http.post('/elements', {});
    expect(request).toHaveBeenCalledTimes(1);
  });
  it('should be able to make HTTP POST API call and catch exception', async () => {
    const originalError = console.error;
    console.error = jest.fn();
    request.mockImplementation(() => Promise.reject({message: 'No element found'}));
    try {
      await http.post('/elements', {});
    } catch (error) {
      expect(request).toHaveBeenCalledTimes(1);
    }
    console.error = originalError;
  });
  it('should be able to make HTTP POST API call and catch exception with message', async () => {
    const originalError = console.error;
    console.error = jest.fn();
    request.mockImplementation(() => Promise.reject({message: 'No element found'}));
    try {
      await http.post('/elements', {name: 'sfdc'});
    } catch (error) {
      expect(request).toHaveBeenCalledTimes(1);
    }
    console.error = originalError;
  });
  it('should be able to make HTTP PUT API call', async () => {
    request.mockImplementation(() => Promise.resolve([]));
    await http.update('/elements', {});
    expect(request).toHaveBeenCalledTimes(1);
  });
  it('should be able to make HTTP PUT API call and catch exception', async () => {
    const originalError = console.error;
    console.error = jest.fn();
    request.mockImplementation(() => Promise.reject(new Error('Invalid')));
    try {
      await http.update('/elements', {});
    } catch (error) {
      expect(request).toHaveBeenCalledTimes(1);
    }
    console.error = originalError;
  });
  it('should be able to make HTTP DELETE API call', async () => {
    request.mockImplementation(() => Promise.resolve([]));
    await http.delete('/elements');
    expect(request).toHaveBeenCalledTimes(1);
  });
  it('should be able to make HTTP DELETE API call and catch exception', async () => {
    const originalError = console.error;
    console.error = jest.fn();
    request.mockImplementation(() => Promise.reject(new Error('Invalid')));
    try {
      await http.delete('/elements');
    } catch (error) {
      expect(request).toHaveBeenCalledTimes(1);
    }
    console.error = originalError;
  });
});
