/**
 * Application configuration with environment variable validation
 * This ensures all required environment variables are present and valid
 */

interface Config {
  API_BASE_URL: string;
  WS_BASE_URL: string;
  MOCK_API: boolean;
  NODE_ENV: 'development' | 'production' | 'test';
  APP_VERSION: string;
  SENTRY_DSN?: string;
  ANALYTICS_ID?: string;
}

/**
 * Validates a URL string
 */
const isValidUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

/**
 * Gets and validates environment variables
 */
const getEnvVar = (key: string, defaultValue?: string, required = false): string => {
  const value = import.meta.env[key] || defaultValue;

  if (required && !value) {
    throw new Error(`Required environment variable ${key} is not set`);
  }

  return value || '';
};

/**
 * Validates and creates the application configuration
 */
const createConfig = (): Config => {
  const apiBase = getEnvVar('VITE_API_BASE', 'http://localhost:8000/api');
  const wsBase = getEnvVar('VITE_WS_BASE', 'ws://localhost:8000/ws');

  // Validate URLs
  if (!isValidUrl(apiBase)) {
    throw new Error(`Invalid API base URL: ${apiBase}`);
  }

  if (!isValidUrl(wsBase)) {
    throw new Error(`Invalid WebSocket base URL: ${wsBase}`);
  }

  return {
    API_BASE_URL: apiBase,
    WS_BASE_URL: wsBase,
    MOCK_API: getEnvVar('VITE_MOCK_API') === 'true',
    NODE_ENV: (getEnvVar('NODE_ENV', 'development') as Config['NODE_ENV']),
    APP_VERSION: getEnvVar('VITE_APP_VERSION', '1.0.0'),
    SENTRY_DSN: getEnvVar('VITE_SENTRY_DSN'),
    ANALYTICS_ID: getEnvVar('VITE_ANALYTICS_ID'),
  };
};

// Create and export the configuration
export const config = createConfig();

// Export individual config values for convenience
export const {
  API_BASE_URL,
  WS_BASE_URL,
  MOCK_API,
  NODE_ENV,
  APP_VERSION,
  SENTRY_DSN,
  ANALYTICS_ID,
} = config;

// Development helpers
export const isDevelopment = NODE_ENV === 'development';
export const isProduction = NODE_ENV === 'production';
export const isTest = NODE_ENV === 'test';