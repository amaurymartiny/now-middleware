/* eslint-disable */

const tsJest = require('ts-jest/jest-preset');

module.exports = {
  ...tsJest,
  collectCoverageFrom: ['**/src/**/*.ts'],
  testMatch: ['**/*.spec.ts']
};
