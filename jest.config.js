module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  globals: {
    'ts-jest': {
      tsconfig: 'tsconfig.test.json'
    }
  },
  setupFiles: ["./__tests__/setup.ts"],
  testPathIgnorePatterns: [
    "mocks",
    "configs",
    "setup.ts",
    "fakers.ts",
    "fixtures.ts",
    "coverage",
  ],
};
