import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { AuthSession } from "../../types/auth";

const storageKey = "serviq.auth.session";

export const loadStoredSession = (): AuthSession | null => {
    if (typeof window === "undefined") {
        return null;
    }

    const rawSession = window.localStorage.getItem(storageKey);
    if (!rawSession) {
        return null;
    }

    try {
        return JSON.parse(rawSession) as AuthSession;
    } catch {
        window.localStorage.removeItem(storageKey);
        return null;
    }
};

export const saveStoredSession = (session: AuthSession | null) => {
    if (typeof window === "undefined") {
        return;
    }

    if (!session) {
        window.localStorage.removeItem(storageKey);
        return;
    }

    window.localStorage.setItem(storageKey, JSON.stringify(session));
};

export const clearStoredSession = () => saveStoredSession(null);

interface AuthState {
    session: AuthSession | null;
    hydrated: boolean;
}

const initialState: AuthState = {
    session: loadStoredSession(),
    hydrated: true,
};

export const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setSession: (_state, action: PayloadAction<AuthSession>) => ({
            session: action.payload,
            hydrated: true,
        }),
        clearAuth: () => ({
            session: null,
            hydrated: true,
        }),
        hydrateAuth: (_state, action: PayloadAction<AuthSession | null>) => ({
            session: action.payload,
            hydrated: true,
        }),
    },
});

export const { setSession, clearAuth, hydrateAuth } = authSlice.actions;

export const selectAuthSession = (state: { auth: AuthState }) => state.auth.session;
export const selectAuthUser = (state: { auth: AuthState }) => state.auth.session?.user ?? null;
export const selectIsAuthenticated = (state: { auth: AuthState }) => Boolean(state.auth.session?.accessToken);

export default authSlice.reducer;