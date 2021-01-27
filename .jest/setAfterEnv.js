const fs = require('fs');
const path = require('path');
const mockPath = path.resolve('./test/.temp');

afterAll(() => {
  jest.resetAllMocks();
  fs.rmdirSync(mockPath, {recursive: true});
});
