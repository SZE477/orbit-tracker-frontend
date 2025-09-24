import { AxiosInstance } from 'axios';
export declare const apiClient: AxiosInstance;
export declare const buildQueryString: (params: Record<string, any>) => string;
export declare const apiGet: <T>(url: string, params?: Record<string, any>) => Promise<T>;
export declare const apiPost: <T>(url: string, data?: any) => Promise<T>;
export declare const apiPut: <T>(url: string, data?: any) => Promise<T>;
export declare const apiPatch: <T>(url: string, data?: any) => Promise<T>;
export declare const apiDelete: <T>(url: string) => Promise<T>;
