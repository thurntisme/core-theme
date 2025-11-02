import axios from 'axios';

// Create an Axios instance
const apiClient = axios.create({
  baseURL:
    typeof window !== 'undefined'
      ? process.env?.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000/api'
      : 'http://localhost:3000/api', // Replace with your API base URL
  timeout: 10000, // Request timeout in milliseconds
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor
apiClient.interceptors.request.use(
  (config) => {
    // Add authorization token if available
    const token = localStorage.getItem('token'); // Replace with your token storage logic
    if (token) {
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
apiClient.interceptors.response.use(
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

export default apiClient;
