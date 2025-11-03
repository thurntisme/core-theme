import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';

type ExtendedAxiosInstance = AxiosInstance & {
  use: (
    middleware: (config: AxiosRequestConfig) => AxiosRequestConfig
  ) => ExtendedAxiosInstance;
};

const defaultHeaders = {
  'Content-Type': 'application/json',
  Accept: 'application/json',
};

export function createInternalApiClient(
  config: AxiosRequestConfig = {}
): ExtendedAxiosInstance {
  const mergedConfig: AxiosRequestConfig = {
    ...config,
    headers: {
      ...defaultHeaders,
      ...(config.headers || {}),
    },
    timeout: config.timeout ?? 10000,
  };

  const instance = axios.create(mergedConfig) as ExtendedAxiosInstance;

  return instance;
}
