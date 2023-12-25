/*
 * For a detailed explanation regarding each configuration property and type check, visit:
 * https://jestjs.io/docs/configuration
 */

export default {
  preset: 'ts-jest',
  testEnvironment: 'node',
  transform: {
    '^.+\\.ts?$': 'ts-jest',
    '^.+\\.(js)$': 'babel-jest',
  },
  // setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  clearMocks: true,
  collectCoverage: true,
  coverageDirectory: 'coverage',
  coverageProvider: 'v8',
  testMatch: ['**/__tests__/**/*.test.ts'],
  testPathIgnorePatterns: ['node_modules'],
  extensionsToTreatAsEsm: ['.ts'],
  moduleNameMapper: {
    'libs/(.*)': '<rootDir>/src/libs/$1',
  },
};
