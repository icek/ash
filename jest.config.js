module.exports = {
  projects: ['core', 'fsm', 'io', 'signals', 'tick', 'tools'].map(dir => ({
    roots: [
      `<rootDir>/packages/${dir}/src`,
      `<rootDir>/packages/${dir}/tests`,
    ],
    moduleNameMapper: {
      '^@ash\.ts/(.*)': '<rootDir>/packages/$1',
    },
    preset: 'ts-jest',
  })),
  collectCoverageFrom: ['packages/**/src/**/*.ts'],
};
