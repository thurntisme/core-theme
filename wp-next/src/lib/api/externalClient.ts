import axios, { AxiosInstance, AxiosRequestHeaders } from 'axios';

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

export function createExternalApiClient({
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
