module.exports = {
  globals: {
    '__ACCOUNT__': {
      baseUrl: 'Hello',
      authorization: 'World'
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
      branches: 95.76,
      functions: 100,
    }
  }
};