import axios from "axios";
import { getAuthToken } from "./features/auth/authSlice";

const userBaseURL = process.env.NEXT_PUBLIC_API_URL_USER;
const eventBaseURL = process.env.NEXT_PUBLIC_API_URL_EVENT;

// Clientes
export const apiUser = axios.create({ baseURL: userBaseURL });
export const apiEvent = axios.create({ baseURL: eventBaseURL });

// Fuerza JSON en mutaciones (igual que Swagger)
const jsonHeaders = { "Content-Type": "application/json" } as const;
apiUser.defaults.headers.post = { ...(apiUser.defaults.headers.post || {}), ...jsonHeaders };
apiUser.defaults.headers.put = { ...(apiUser.defaults.headers.put || {}), ...jsonHeaders };
apiUser.defaults.headers.patch = { ...(apiUser.defaults.headers.patch || {}), ...jsonHeaders };
apiEvent.defaults.headers.post = { ...(apiEvent.defaults.headers.post || {}), ...jsonHeaders };
apiEvent.defaults.headers.put = { ...(apiEvent.defaults.headers.put || {}), ...jsonHeaders };
apiEvent.defaults.headers.patch = { ...(apiEvent.defaults.headers.patch || {}), ...jsonHeaders };

// Utilidad para setear/leer token (reutiliza tu authSlice si prefieres)
export const setAuthToken = (token: string) => {
    try { localStorage.setItem("auth_token", token); } catch { }
};
const getToken = () => {
    try { return localStorage.getItem("auth_token") || ""; } catch { return ""; }
};

// Interceptor Authorization compartido
const withAuth = (config: any) => {
    const token = getToken();
    if (token) {
        config.headers = { ...(config.headers || {}), Authorization: `Bearer ${token}` };
    }
    return config;
};

apiUser.interceptors.request.use(withAuth);
apiEvent.interceptors.request.use(withAuth);

let hasRedirected401 = false;

const handleError = (baseURL: string) => (err: any) => {
    const status = err?.response?.status;
    const reqUrl = err?.config?.url || "";
    const isBrowser = typeof window !== "undefined";
    const path = isBrowser ? window.location.pathname.toLowerCase() : "";
    const onLoginPage = path === "/login" || path === "/Login";

    console.error("API error:", {
        baseURL,
        url: reqUrl,
        method: err?.config?.method,
        status,
        data: err?.response?.data,
    });


    const isAuthEndpoint =
        reqUrl.toLowerCase().includes("/auth") ||
        reqUrl.toLowerCase().includes("/login") ||
        reqUrl.toLowerCase().includes("/signin");

    if (status === 401 && isBrowser && !onLoginPage && !isAuthEndpoint && !hasRedirected401) {
        hasRedirected401 = true;
        window.location.href = "/Login";
        setTimeout(() => { hasRedirected401 = false; }, 5000);
    }

    return Promise.reject(err);
};

apiUser.interceptors.response.use(r => r, handleError(userBaseURL || ""));
apiEvent.interceptors.response.use(r => r, handleError(eventBaseURL || ""));


export const eventApi = {
    createFull: (payload: any) => apiEvent.post("/api/event/create-full", payload, {
        headers: { "Content-Type": "application/json" },
    }),
    listVenues: () => apiEvent.get("/api/venue"),
    listLocations: () => apiEvent.get("/api/location"),
    listCitiesByLocation: (id: string) => apiEvent.get(`/api/location/${id}/cities`),
};