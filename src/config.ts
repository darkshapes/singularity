/**
 * Returns the full backend API URL
 * @param endpoint - The API endpoint
 * @returns The full URL
 */
const getBackendUrl = (endpoint: string): string =>
  `${config.protocol}//${config.host}${endpoint}`;

const config = {
  host: "127.0.0.1:8188",
  protocol: "http:",
  getBackendUrl
};

export default config;