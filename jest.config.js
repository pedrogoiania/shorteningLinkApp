// Jest configuration for Expo React Native project
// Note: To run tests, you'll need to install additional dependencies:
// npm install --save-dev jest-expo react-test-renderer

module.exports = {
  preset: 'jest-expo', // Requires: npm install --save-dev jest-expo
  setupFilesAfterEnv: ['@testing-library/jest-native/extend-expect'],
  transformIgnorePatterns: [
    'node_modules/(?!((jest-)?react-native|@react-native(-community)?|expo(nent)?|@expo(nent)?/.*|@expo-google-fonts/.*|react-navigation|@react-navigation/.*|@unimodules/.*|unimodules|sentry-expo|native-base|react-native-svg))',
  ],
  collectCoverageFrom: [
    '**/*.{ts,tsx}',
    '!**/*.d.ts',
    '!**/node_modules/**',
    '!**/coverage/**',
    '!jest.config.js',
  ],
};
