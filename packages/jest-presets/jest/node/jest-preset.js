/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  roots: ['<rootDir>'],

  /**
    https://kulshekhar.github.io/ts-jest/docs/guides/esm-support
    
    To use ts-jest with ESM support:

    Check ESM Jest documentation.
    Enable useESM true for ts-jest config.
    Include .ts in extensionsToTreatAsEsm Jest config option.
    Ensure that tsconfig has module with value for ESM, e.g. ES2015 or ES2020 etc...
   */
  transform: {
    // '^.+\\.[tj]sx?$' to process js/ts with `ts-jest`
    // '^.+\\.m?[tj]sx?$' to process js/ts/mjs/mts with `ts-jest`
    '^.+\\.tsx?$': [
      'ts-jest',
      {
        useESM: true,
      },
    ],
  },
  extensionsToTreatAsEsm: ['.ts', '.tsx'],

  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  modulePathIgnorePatterns: [
    //
    '<rootDir>/test/__fixtures__',
    '<rootDir>/node_modules',
    '<rootDir>/dist',
  ],
  preset: 'ts-jest',

  /**
    https://github.com/jestjs/jest/issues/13022#issuecomment-1183964334

    Jest only implements Node module resolution.
    In this case, you have to involve additional resolver.
    For instance, ts-jest-resolver should do the job.
   */
  resolver: 'ts-jest-resolver',
}
