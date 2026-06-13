module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['**/tests/**/*.test.ts'],
  collectCoverage: true,
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/components/index.ts',
    '!src/types/index.ts',
  ],
  coverageDirectory: 'coverage',
  coverageReporters: ['json-summary', 'text', 'lcov'],
  coverageThreshold: {
    global: {
      lines: 80,
      statements: 80,
      functions: 80,
      branches: 75,
    },
  },
  coveragePathIgnorePatterns: ['/node_modules/', '/dist/'],
  projects: [
    {
      displayName: 'node',
      preset: 'ts-jest',
      testEnvironment: 'node',
      testMatch: ['**/tests/**/*.test.ts', '!**/tests/**/*.component.test.tsx'],
    },
    {
      displayName: 'jsdom',
      preset: 'ts-jest',
      testEnvironment: 'jsdom',
      testMatch: ['**/tests/**/*.component.test.tsx'],
      setupFilesAfterEnv: ['@testing-library/jest-dom'],
    },
  ],
};
