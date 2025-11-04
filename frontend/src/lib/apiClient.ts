import axios, { type AxiosInstance, type AxiosRequestHeaders } from 'axios';

import { API_SECRET_KEY, API_URL } from '@/constants/site';

type CreateApiClientOptions = {
  baseURL: string;
  headers?: Record<string, string>;
};

const defaultHeaders = {
  'Content-Type': 'application/json',
  Accept: 'application/json',
};

function getAuthToken(): string | null {
  if (typeof window !== 'undefined' && window.localStorage) {
    return window.localStorage.getItem('token');
  }
  return null;
}

export function createApiClient({
  baseURL,
  headers = {},
}: CreateApiClientOptions): AxiosInstance {
  const instance = axios.create({
    baseURL,
    headers: { ...defaultHeaders, ...headers } as AxiosRequestHeaders,
    timeout: 10000,
  });

  // Add a request interceptor
  instance.interceptors.request.use(
    (config) => {
      // Add authorization token if available
      const token = getAuthToken();
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      // Handle request error
      return Promise.reject(error);
    }
  );

  // Add a response interceptor
  instance.interceptors.response.use(
    (response) => {
      // Handle successful response
      return response.data;
    },
    (error) => {
      // Handle response error
      if (error.response) {
        // Server responded with a status other than 2xx
        console.error('API Error:', error.response.data);
      } else if (error.request) {
        // No response received
        console.error('No response received:', error.request);
      } else {
        // Error setting up the request
        console.error('Request setup error:', error.message);
      }
      return Promise.reject(error);
    }
  );

  return instance;
}

/**
 * An instance of the external API client configured with the base URL and authorization headers.
 *
 * @constant
 * @type {object}
 * @property {string} baseURL - The base URL for the external API, defaulting to 'http://localhost:3000/api' if not provided.
 * @property {object} headers - The headers for the API client.
 * @property {string} headers.Authorization - The authorization header containing the Bearer token from the environment variable `EXTERNAL_API_KEY`.
 *
 * @example
 * import { externalApi } from './external';
 *
 * // Example for GET request
 * async function fetchData() {
 *   const response = await externalApi.get('/endpoint');
 *   console.log(response.data);
 * }
 *
 * // Example for POST request
 * async function createData() {
 *   const response = await externalApi.post('/endpoint', { key: 'value' });
 *   console.log(response.data);
 * }
 *
 * // Example for PUT request
 * async function updateData() {
 *   const response = await externalApi.put('/endpoint/1', { key: 'newValue' });
 *   console.log(response.data);
 * }
 *
 * // Example for DELETE request
 * async function deleteData() {
 *   const response = await externalApi.delete('/endpoint/1');
 *   console.log(response.data);
 * }
 */
export const apiClient = createApiClient({
  baseURL: API_URL,
  headers: {
    'x-api-key': API_SECRET_KEY,
  },
});
