import { createExternalApiClient } from './externalClient';

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
export const externalApi = createExternalApiClient({
  baseURL:
    process.env.NEXT_EXTERNAL_API_BASE_URL || 'http://localhost:3000/api',
  headers: {
    'x-api-key': process.env.API_KEY || '',
  },
});
