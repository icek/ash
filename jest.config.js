module.exports = {
  projects: ['core', 'fsm', 'io', 'signals', 'tick', 'tools'].map(dir => ({
    roots: [
      `<rootDir>/packages/${dir}/src`,
      `<rootDir>/packages/${dir}/tests`,
    ],
    transform: { '^.+\.ts$': 'ts-jest' },
    testRegex: '/tests/.*\.spec\.ts$',
    moduleFileExtensions: ['ts', 'js'],
  })),
  collectCoverageFrom: ['packages/**/src/*.ts'],
};
