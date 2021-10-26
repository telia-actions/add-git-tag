import type { Config } from '@jest/types';

const config: Config.InitialOptions = {
  clearMocks: true,
  restoreMocks: true,
  preset: 'jest-preset-typescript',
  testEnvironment: 'node',
  collectCoverage: true,
  coverageReporters: ['text-summary', 'text'],
  moduleNameMapper: {
    '^@src/(.*)$': '<rootDir>/src/$1',
  },
};

export default config;
