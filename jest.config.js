module.exports = {
  roots: [
    'core',
    // 'fsm',
    'io',
    'signals',
    'tick',
    // 'tools',
  ].reduce((roots, name) => roots.concat(['src', 'tests'].map(dir => `<rootDir>/packages/${name}/${dir}`)), []),
  transform: { '^.+\.ts$': 'ts-jest' },
  testRegex: '/tests/.*\.spec\.ts$',
  moduleFileExtensions: ['ts', 'js'],
  collectCoverageFrom: ['packages/**/src/*.ts'],
};
