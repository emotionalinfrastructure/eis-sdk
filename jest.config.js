module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['**/tests/**/*.test.ts'],
  collectCoverage: true,
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    // Exclude React components and UI types (require React Testing Library)
    '!src/components/**',
    '!src/types/**',
    // Exclude barrel exports which don't contain testable functions
    '!src/index.ts',
  ],
  coverageThreshold: {
    global: {
      lines: 90,
      statements: 90,
      functions: 90,
      branches: 85,
    },
  },
  coveragePathIgnorePatterns: [
    '/node_modules/',
    '/dist/',
  ],
};
