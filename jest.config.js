module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['**/tests/**/*.test.ts'],
  collectCoverage: true,
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/components/index.ts',  // Barrel export with no functions
    '!src/types/index.ts',       // Types-only file
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
      setupFilesAfterEnv: ['@testing-library/jest-dom/extend-expect'],
    },
  ],
};
