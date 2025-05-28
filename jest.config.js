/** @type {import('jest').Config} */
module.exports = {
  preset: "jest-preset-angular",
  setupFilesAfterEnv: ["<rootDir>/setup-jest.js"],
  testMatch: ["**/+(*.)+(spec).+(ts)"],
  transform: {
    "^.+\\.(ts|js|html)$": "jest-preset-angular",
  },
  globals: {
    "ts-jest": {
      tsconfig: "<rootDir>/tsconfig.spec.json",
      stringifyContentPathRegex: "\\.html$",
    },
  },
  transformIgnorePatterns: ["node_modules/(?!(@angular|rxjs|tslib)/)"],
  moduleFileExtensions: ["ts", "js", "html"],
  testEnvironment: "jsdom",
};
