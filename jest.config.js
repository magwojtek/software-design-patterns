module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['**/*.test.ts'],
  collectCoverage: true,
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov'],
  
  // Add moduleNameMapper to support the ~ path alias
  moduleNameMapper: {
    '^~/(.*)$': '<rootDir>/src/$1'
  },
};