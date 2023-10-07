// @ts-check

/**
  https://github.com/JamieMason/syncpack/issues/121#issuecomment-1641898993
*/

/** @type {import("syncpack").RcFile} */
const config = {
  versionGroups: [
    {
      packages: ['**'],
      dependencies: ['@robo/*', 'tsconfig', 'ui', 'logger'],
      dependencyTypes: ['dev'],
      pinVersion: 'workspace:*',
    },
  ],
}

module.exports = config
