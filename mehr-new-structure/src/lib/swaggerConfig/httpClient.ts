export interface HttpClient {
  get<T>(url: string, config?: any): Promise<T>;
  post<T, D = unknown>(url: string, data?: D, config?: any): Promise<T>;
  put<T, D = unknown>(url: string, data?: D, config?: any): Promise<T>;
  patch<T, D = unknown>(url: string, data?: D, config?: any): Promise<T>;
  delete<T>(url: string, config?: any): Promise<T>;
  //-----------------------------------------------
  setHeaders(headers: Record<string, string>): void;
}
