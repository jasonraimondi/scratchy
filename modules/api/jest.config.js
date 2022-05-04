module.exports = {
  preset: 'ts-jest',
  moduleNameMapper: {
    '^~/(.*)$': '<rootDir>/src/$1',
    '^~test/(.*)$': '<rootDir>/test/$1',
  },
  // coverageDirectory: "<rootDir>/coverage",
  // collectCoverage: true,
  // coverageReporters: ["lcov"],
  setupFiles: [
    "<rootDir>/test/jest_setup.ts",
  ],
};
