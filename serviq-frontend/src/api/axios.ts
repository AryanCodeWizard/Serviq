import axios, { type AxiosError, type InternalAxiosRequestConfig } from "axios";
import type { AuthSession } from "../types/auth";
import { clearStoredSession, loadStoredSession } from "../features/auth/authSlice";

const DEFAULT_BASE_URL = "http://localhost:3000/api/v1";

type UnauthorizedHandler = () => void;

let onUnauthorized: UnauthorizedHandler | undefined;

export const configureApiClient = (handler: UnauthorizedHandler) => {
    onUnauthorized = handler;
};

const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL ?? DEFAULT_BASE_URL,
    withCredentials: true,
    timeout: 15000,
});

api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
    const session = loadStoredSession();

    config.headers = config.headers ?? {};
    config.headers.Accept = "application/json";

    if (session?.accessToken) {
        config.headers.Authorization = `Bearer ${session.accessToken}`;
    }

    return config;
});

api.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
        const status = error.response?.status;
        const originalRequest = error.config as (InternalAxiosRequestConfig & { __retryCount?: number }) | undefined;

        if (status === 401) {
            clearStoredSession();
            onUnauthorized?.();
        }

        const method = originalRequest?.method?.toLowerCase();
        const isRetryableRequest = method === "get" || method === "head";
        const shouldRetry = Boolean(
            originalRequest &&
            isRetryableRequest &&
            status &&
            [502, 503, 504].includes(status) &&
            (originalRequest.__retryCount ?? 0) < 1
        );

        if (shouldRetry && originalRequest) {
            originalRequest.__retryCount = (originalRequest.__retryCount ?? 0) + 1;
            return api(originalRequest);
        }

        return Promise.reject(error);
    }
);

export const readSessionFromStorage = (): AuthSession | null => loadStoredSession();

export const persistSessionToStorage = (session: AuthSession | null) => {
    if (!session) {
        clearStoredSession();
        return;
    }

    localStorage.setItem("serviq.auth.session", JSON.stringify(session));
};

export const clearSessionStorage = () => {
    clearStoredSession();
};

export default api;