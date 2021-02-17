const fs = require('fs');
const fsExtra = require('fs-extra');
const path = require('path');
const mockPath = path.resolve('./test/.temp');

beforeAll(() => {
  if (!fs.existsSync(mockPath)) {
    fsExtra.ensureDirSync(mockPath);
  }
});

afterAll(() => {
  jest.resetAllMocks();
});
