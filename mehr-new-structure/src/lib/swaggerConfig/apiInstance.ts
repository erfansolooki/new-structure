import { AxiosAdapter } from './axiosAdapter';
import { FetchAdapter } from './fetchAdapter';
import type { HttpClient } from './httpClient';

type Method =
  | 'get'
  | 'post'
  | 'put'
  | 'patch'
  | 'delete'
  | 'Post'
  | 'POST'
  | 'Get'
  | 'GET'
  | 'Put'
  | 'PUT'
  | 'Delete'
  | 'DELETE'
  | 'PATCH';

type ClientType = 'axios' | 'fetch';

interface ApiInstanceParams {
  url: string;
  method: Method;
  client?: ClientType;
  data?: any;
  params?: Record<string, any>;
  headers?: Record<string, string>;
  baseURL?: string;
  signal?: AbortSignal;
}
const _baseURL = 'http://80.210.47.180:7901';

// Original apiInstance function
export const apiInstanceOriginal = async <T>({
  url,
  method,
  client = 'axios',
  data,
  params,
  headers = {},
  baseURL = _baseURL,
}: ApiInstanceParams): Promise<T> => {
  let httpClient: HttpClient;
  // ----------------------------
  switch (client) {
    case 'fetch':
      httpClient = new FetchAdapter(baseURL);
      break;
    case 'axios':
    default:
      httpClient = new AxiosAdapter(baseURL);
      break;
  }
  // ----------------------------

  httpClient.setHeaders({
    ...headers,
    Authorization: `Bearer ${localStorage.getItem('token')}`,
  });
  // ----------------------------

  let fullUrl = url;
  if (params && typeof params === 'object') {
    const query = new URLSearchParams(params).toString();
    fullUrl += `?${query}`;
  }
  // ----------------------------

  switch (method.toLowerCase()) {
    case 'get':
      return httpClient.get<T>(fullUrl);
    case 'post':
      return httpClient.post<T>(fullUrl, data);
    case 'put':
      return httpClient.put<T>(fullUrl, data);
    case 'patch':
      return httpClient.patch<T>(fullUrl, data);
    case 'delete':
      return httpClient.delete<T>(fullUrl, data);
    default:
      throw new Error(`Unsupported HTTP method: ${method}`);
  }
};

// Orval mutator - compatible with Orval's expected signature
export const apiInstance = <T>(config: ApiInstanceParams): Promise<T> => {
  return apiInstanceOriginal<T>(config);
};
