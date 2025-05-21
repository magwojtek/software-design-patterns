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
    // Add setupFilesAfterEnv to run our setup file before tests
    setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
};
