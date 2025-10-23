// src/services/adapters/FetchAdapter.ts

import type { HttpClient } from './httpClient';

export class FetchAdapter implements HttpClient {
  private baseURL: string;

  constructor(baseURL?: string) {
    this.baseURL = baseURL || '';
  }
  private customHeaders: Record<string, string> = {};

  setHeaders(headers: Record<string, string>): void {
    this.customHeaders = headers;
  }

  private async request<T>(url: string, method: string, data?: any, config?: any): Promise<T> {
    const token = localStorage.getItem('token');
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...this.customHeaders,
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(config?.headers || {}),
    };

    const res = await fetch(this.baseURL + url, {
      method,
      headers,
      body: data ? JSON.stringify(data) : undefined,
      ...config,
    });

    if (!res.ok) {
      if (res.status === 401) {
        console.warn('🚫 خطای احراز هویت 401 - باید redirect کنیم به login.');
      } else if (res.status === 500) {
        console.error('💥 خطای سرور 500 - مشکلی سمت سرور هست.');
      }

      throw new Error(`HTTP Error: ${res.status}`);
    }

    return res.json();
  }

  get<T>(url: string, config?: any): Promise<T> {
    return this.request<T>(url, 'GET', undefined, config);
  }

  post<T, D = unknown>(url: string, data?: D, config?: any): Promise<T> {
    return this.request<T>(url, 'POST', data, config);
  }

  put<T, D = unknown>(url: string, data?: D, config?: any): Promise<T> {
    return this.request<T>(url, 'PUT', data, config);
  }

  patch<T, D = unknown>(url: string, data?: D, config?: any): Promise<T> {
    return this.request<T>(url, 'PATCH', data, config);
  }

  delete<T>(url: string, config?: any): Promise<T> {
    return this.request<T>(url, 'DELETE', undefined, config);
  }
}
