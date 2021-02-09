module.exports = {
  globals: {
    '__ACCOUNT__': {
      baseUrl: 'https://snapshot.cloud-elements.com',
      authorization: 'User pcRw+6BrX/w9f690tHM3JyNsA2Phc=, Organization bfd32a27122e5d0516d126f6271591af'
    }
  },
  clearMocks: true,
  verbose: true,
  testTimeout: 5000,
  // An array of file extensions your modules use
  moduleFileExtensions: ['js', 'json'],
  coveragePathIgnorePatterns: [
    '<rootDir>/dist/',
    '<rootDir>/node_modules/',
  ],
  testPathIgnorePatterns: [
    '<rootDir>/dist/',
    '<rootDir>/node_modules/',
  ],
  setupFiles: [
    "<rootDir>/.jest/setEnvVars.js"
  ],
  setupFilesAfterEnv: ["<rootDir>/.jest/setAfterEnv.js"],
  coverageReporters: ['json-summary', 'text', 'lcov', 'clover'],
  coverageThreshold: {
    global: {
      lines: 100,
      statements: 100,
      branches: 95.82,
      functions: 100,
    }
  }
};