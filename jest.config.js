const { join } = require("path");
const { pathsToModuleNameMapper } = require("ts-jest/utils");
const { compilerOptions } = require("./tsconfig");

module.exports = {

  moduleFileExtensions: [
    "js",
    "json",
    "ts",
  ],
  rootDir: "./",
  testRegex: ".spec.ts$",
  transform: {
    "^.+\\.(t|j)s$": "ts-jest",
  },
  coverageDirectory: "../coverage",
  testEnvironment: "node",
  setupFiles: [
    "<rootDir>/test/jest_setup.ts",
  ],

  // preset: "ts-jest",
  // collectCoverageFrom: ["src/**/*.{ts,js}"],
  // moduleFileExtensions: ["ts", "js", "json"],
  // moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, {
  //   prefix: "<rootDir>/",
  // }),
  // setupFiles: [join(__dirname, "/test/jest_setup.ts")],
};

// "jest": {
//   "moduleFileExtensions": [
//     "js",
//     "json",
//     "ts"
//   ],
//     "rootDir": "./",
//     "testRegex": ".spec.ts$",
//     "transform": {
//     "^.+\\.(t|j)s$": "ts-jest"
//   },
//   "coverageDirectory": "../coverage",
//     "testEnvironment": "node",
//     "setupFiles": [
//     "<rootDir>/test/jest_setup.ts"
//   ]
// }