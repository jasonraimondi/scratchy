const { pathsToModuleNameMapper } = require("ts-jest/utils");
const { compilerOptions } = require("./tsconfig");
const path = require('path');

module.exports = {
  moduleFileExtensions: [
    "js",
    "json",
    "ts",
  ],
  modulePathIgnorePatterns: ['<rootDir>/dist'],
  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, {
    prefix: "<rootDir>",
  }),
  rootDir: "./",
  testRegex: ".spec.ts$",
  transform: {
    "^.+\\.(t|j)s$": "ts-jest",
  },
  // coverageDirectory: "<rootDir>/coverage",
  // collectCoverage: true,
  // coverageReporters: ["lcov"],
  setupFiles: [
    "<rootDir>/test/jest_setup.ts",
  ],
  testEnvironment: "<rootDir>/prisma/prisma-test-environment.js",
};
