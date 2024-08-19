import config from "@/app/config";

export * from "./connection";
export * from "./node";
export * from "./persistence";
export * from "./queue";

/**
 * Returns the full backend API URL
 * @param endpoint - The API endpoint
 * @returns The full URL
 */
export const getBackendUrl = (endpoint: string): string =>
  `${config.protocol}//${config.host}${endpoint}`;
