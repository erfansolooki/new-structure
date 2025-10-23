// AxiosAdapter.ts

import axios, {
  type AxiosInstance,
  type AxiosRequestConfig,
  type InternalAxiosRequestConfig,
  type AxiosResponse,
} from 'axios';
import Cookies from 'universal-cookie';

const _baseURL = 'http://80.210.47.180:7901';
type FailedRequest = {
  resolve: (value?: unknown) => void;
  reject: (error: unknown) => void;
  config: AxiosRequestConfig;
};

export class AxiosAdapter {
  private instance: AxiosInstance;
  private isRefreshing = false;
  private failedQueue: FailedRequest[] = [];

  constructor(baseURL?: string) {
    this.instance = axios.create({
      baseURL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  setHeaders() {
    // do nothing
  }

  private setupInterceptors() {
    this.instance.interceptors.request.use(this.handleRequest);
    this.instance.interceptors.response.use(this.handleResponseSuccess, this.handleResponseError);
  }

  private handleRequest(config: InternalAxiosRequestConfig): InternalAxiosRequestConfig {
    const cookies = new Cookies();
    const token = cookies.get(process.env.NEXT_PUBLIC_ACCESS_KEY);

    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }

    return config;
  }

  private handleResponseSuccess(response: AxiosResponse): AxiosResponse {
    return response;
  }

  private handleResponseError = async (error: any) => {
    const originalRequest = error.config;
    const cookies = new Cookies();

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      cookies.get(process.env.NEXT_PUBLIC_REFRESH_KEY)
    ) {
      originalRequest._retry = true;

      if (this.isRefreshing) {
        return new Promise((resolve, reject) => {
          this.failedQueue.push({ resolve, reject, config: originalRequest });
        });
      }

      this.isRefreshing = true;

      try {
        const refreshToken = cookies.get(process.env.NEXT_PUBLIC_REFRESH_KEY);

        const response = await axios.post(`${_baseURL}/api/auth/refresh-token`, {
          'refresh-token': refreshToken,
        });

        const newAccessToken = response.data.accessToken;
        cookies.remove(process.env.NEXT_PUBLIC_ACCESS_KEY);
        cookies.set(process.env.NEXT_PUBLIC_ACCESS_KEY, newAccessToken, {
          path: '/',
        });

        this.failedQueue.forEach(({ resolve, reject, config }) => {
          config.headers['Authorization'] = `Bearer ${newAccessToken}`;
          this.instance(config).then(resolve).catch(reject);
        });

        this.failedQueue = [];

        originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
        return this.instance(originalRequest);
      } catch (refreshError) {
        this.failedQueue.forEach(({ reject }) => reject(refreshError));
        this.failedQueue = [];

        cookies.remove(process.env.NEXT_PUBLIC_ACCESS_KEY);
        cookies.remove(process.env.NEXT_PUBLIC_REFRESH_KEY);
        window.location.href = '/login';

        return Promise.reject(refreshError);
      } finally {
        this.isRefreshing = false;
      }
    }

    return Promise.reject(error);
  };

  // Public Methods
  get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return this.instance.get<T>(url, config).then((res) => res.data);
  }

  post<T, D = unknown>(url: string, data?: D, config?: AxiosRequestConfig): Promise<T> {
    return this.instance.post<T>(url, data, config).then((res) => res.data);
  }

  put<T, D = unknown>(url: string, data?: D, config?: AxiosRequestConfig): Promise<T> {
    return this.instance.put<T>(url, data, config).then((res) => res.data);
  }

  patch<T, D = unknown>(url: string, data?: D, config?: AxiosRequestConfig): Promise<T> {
    return this.instance.patch<T>(url, data, config).then((res) => res.data);
  }

  delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    console.log(config);
    return this.instance
      .delete<T>(url, {
        data: config,
      })
      .then((res) => res.data);
  }
}
