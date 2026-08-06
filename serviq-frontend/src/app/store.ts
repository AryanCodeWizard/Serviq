import { configureStore } from "@reduxjs/toolkit";
import authReducer, { clearStoredSession, loadStoredSession, saveStoredSession } from "../features/auth/authSlice";

export const store = configureStore({
    reducer: {
        auth: authReducer,
    },
});

let lastSerializedSession = JSON.stringify(loadStoredSession());

store.subscribe(() => {
    const currentSession = store.getState().auth.session;
    const nextSerializedSession = JSON.stringify(currentSession);

    if (nextSerializedSession === lastSerializedSession) {
        return;
    }

    lastSerializedSession = nextSerializedSession;

    if (currentSession) {
        saveStoredSession(currentSession);
    } else {
        clearStoredSession();
    }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;