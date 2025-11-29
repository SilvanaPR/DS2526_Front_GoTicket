import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

const STORAGE_KEY = "auth_token";

export function setAuthToken(token: string | null) {
    if (typeof window === "undefined") return;
    if (token) localStorage.setItem(STORAGE_KEY, token);
    else localStorage.removeItem(STORAGE_KEY);
}

export function getAuthToken(): string | null {
    if (typeof window === "undefined") return null;
    return localStorage.getItem(STORAGE_KEY);
}

interface KeycloakTokenPayload {
    sub: string;
    email?: string;
    preferred_username?: string;
    name?: string;
    given_name?: string;
    family_name?: string;
    realm_access?: { roles?: string[] };
    resource_access?: Record<string, { roles?: string[] }>;
}

interface AuthState {
    token: string | null;
    userInfo: KeycloakTokenPayload | null;
    loading: boolean;
    error: string | null;
}

// Inicializa desde localStorage
const initialToken = typeof window !== "undefined" ? getAuthToken() : null;
let initialUserInfo: KeycloakTokenPayload | null = null;
if (initialToken) {
    try { initialUserInfo = jwtDecode<KeycloakTokenPayload>(initialToken); } catch { }
}

const initialState: AuthState = {
    token: initialToken,
    userInfo: initialUserInfo,
    loading: false,
    error: null,
};

const KEYCLOAK_TOKEN_URL =
    process.env.NEXT_PUBLIC_KEYCLOAK_TOKEN_URL;

const KEYCLOAK_CLIENT_ID =
    process.env.NEXT_PUBLIC_KEYCLOAK_CLIENT_ID;

const KEYCLOAK_CLIENT_SECRET =
    process.env.NEXT_PUBLIC_KEYCLOAK_CLIENT_SECRET;


export const fetchServiceToken = createAsyncThunk<string>(
    "auth/fetchServiceToken",
    async (_, { rejectWithValue }) => {
        try {
            const body = new URLSearchParams({
                grant_type: "client_credentials",
                client_id: KEYCLOAK_CLIENT_ID,
                client_secret: KEYCLOAK_CLIENT_SECRET,
            });
            const { data } = await axios.post(KEYCLOAK_TOKEN_URL, body.toString(), {
                headers: { "Content-Type": "application/x-www-form-urlencoded" },
            });
            const token = data?.access_token;
            if (!token) throw new Error("No se recibió access_token");
            setAuthToken(token);
            return token;
        } catch (err: any) {
            return rejectWithValue(
                err?.response?.data?.error_description ??
                err?.message ??
                "Error obteniendo token"
            );
        }
    }
);

export const refreshToken = createAsyncThunk<string, string>(
    "auth/refreshToken",
    async (refreshToken, { rejectWithValue }) => {
        try {
            const body = new URLSearchParams({
                grant_type: "refresh_token",
                client_id: KEYCLOAK_CLIENT_ID,
                client_secret: KEYCLOAK_CLIENT_SECRET,
                refresh_token: refreshToken,
            });
            const { data } = await axios.post(KEYCLOAK_TOKEN_URL, body.toString(), {
                headers: { "Content-Type": "application/x-www-form-urlencoded" },
            });
            const token = data?.access_token;
            if (!token) throw new Error("No se recibió access_token");
            setAuthToken(token);
            return token;
        } catch (err: any) {
            return rejectWithValue(
                err?.response?.data?.error_description ??
                err?.message ??
                "Error al refrescar token"
            );
        }
    }
);

export const loginWithPassword = createAsyncThunk<
    string,
    { username: string; password: string }
>("auth/loginWithPassword", async ({ username, password }, { rejectWithValue }) => {
    try {
        const body = new URLSearchParams({
            grant_type: "password",
            client_id: KEYCLOAK_CLIENT_ID,
            client_secret: KEYCLOAK_CLIENT_SECRET,
            username,
            password,
        });
        const { data } = await axios.post(KEYCLOAK_TOKEN_URL, body.toString(), {
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
        });
        const token = data?.access_token;
        if (!token) throw new Error("No se recibió access_token");
        setAuthToken(token);
        return token;
    } catch (err: any) {
        return rejectWithValue(
            err?.response?.data?.error_description ?? err?.message ?? "Credenciales inválidas"
        );
    }
});

const slice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        logout(state) {
            state.token = null;
            state.userInfo = null;
            setAuthToken(null);
        },
        hydrateFromStorage(state) { // opcional para forzar rehidratación
            const t = getAuthToken();
            state.token = t;
            state.userInfo = t ? jwtDecode<KeycloakTokenPayload>(t) : null;
        }
    },
    extraReducers: (b) => {
        b.addCase(fetchServiceToken.pending, (s) => { s.loading = true; s.error = null; });
        b.addCase(fetchServiceToken.fulfilled, (s, a: PayloadAction<string>) => { s.loading = false; s.token = a.payload; });
        b.addCase(fetchServiceToken.rejected, (s, a) => { s.loading = false; s.error = String(a.payload ?? a.error.message ?? "Error"); });
        b
            .addCase(loginWithPassword.pending, (s) => { s.loading = true; s.error = null; })
            .addCase(loginWithPassword.fulfilled, (s, a: PayloadAction<string>) => {
                s.loading = false;
                s.token = a.payload;
                setAuthToken(a.payload);
                try { s.userInfo = jwtDecode<KeycloakTokenPayload>(a.payload); } catch { s.userInfo = null; }
            })
            .addCase(loginWithPassword.rejected, (s, a) => { s.loading = false; s.error = String(a.payload ?? a.error.message ?? "Error"); });
    },
});

export const { logout, hydrateFromStorage } = slice.actions;
export default slice.reducer;