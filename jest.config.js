/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  clearMocks: true,
  moduleFileExtensions: ['js', 'ts'],
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['**/*.test.ts'],
  verbose: true
};
