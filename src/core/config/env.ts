/**
 * Environment variable configuration
 *
 * To add a new environment variable:
 * 1. Add an entry to ENV_CONFIG with the variable name, Expo key, and default value
 * 2. Add the corresponding property to the ENV export object
 * 3. Run `yarn generate-env` or `npm run generate-env` to update .env and TypeScript declarations
 *
 * Example:
 * SHORTENER_SERVICE_BASE_URL: {
 *   key: 'EXPO_PUBLIC_SHORTENER_SERVICE_BASE_URL',
 *   defaultValue: 'https://url-shortener-server.onrender.com/api/',
 * },
 */
const ENV_CONFIG = {
  SHORTENER_SERVICE_BASE_URL: {
    key: 'EXPO_PUBLIC_SHORTENER_SERVICE_BASE_URL',
    defaultValue: 'https://url-shortener-server.onrender.com/api/',
  },
} as const;

// Type for environment variable keys
type EnvKey = keyof typeof ENV_CONFIG;

// Helper function to get environment variable value
function getEnvValue<T extends EnvKey>(key: T): string {
  const config = ENV_CONFIG[key];
  return process.env[config.key] || config.defaultValue;
}

// Export the environment variables
export const ENV = {
  SHORTENER_SERVICE_BASE_URL: getEnvValue('SHORTENER_SERVICE_BASE_URL'),
} as const;

// Export configuration for external tools/scripts
export { ENV_CONFIG };
export type { EnvKey };

