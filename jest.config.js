module.exports = {
  clearMocks: true,
  // An array of file extensions your modules use
  moduleFileExtensions: ['js', 'json'],
  coveragePathIgnorePatterns: [
    '<rootDir>/dist/',
    '<rootDir>/node_modules/',
  ],
  testPathIgnorePatterns: [
    '<rootDir>/dist/',
    '<rootDir>/node_modules/',
  ]
};