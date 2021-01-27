/* eslint-disable no-undef */
const authHeader = require('../../src/utils/authHeader');

describe('authHeader', () => {
  const originalAuthentication = process.env.AUTHENTICATION;
  const originalUserSecret = process.env.USER_SECRET;
  const originalOrgSecret = process.env.ORG_SECRET;
  it('should be able to get authentication header if AUTHENTICATION env is present', async () => {
    expect(authHeader()).toEqual(originalAuthentication);
  });
  it('should be able to get authentication header if AUTHENTICATION env is not present', async () => {
    process.env.AUTHENTICATION = '';
    expect(authHeader()).toEqual(`User ${originalUserSecret}, Organization ${originalOrgSecret}`);
    process.env.AUTHENTICATION = originalAuthentication;
  });
});
