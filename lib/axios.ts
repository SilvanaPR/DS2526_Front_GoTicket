import axios from "axios";
import { getAuthToken } from "./features/auth/authSlice";

const userBaseURL = process.env.NEXT_PUBLIC_API_URL_USER;
const eventBaseURL = process.env.NEXT_PUBLIC_API_URL_EVENT;

// Clientes
export const apiUser = axios.create({ baseURL: userBaseURL });
export const apiEvent = axios.create({ baseURL: eventBaseURL });

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

    // Evita redirigir si ya estás en /Login o si la petición es del propio login
    const isAuthEndpoint =
        reqUrl.toLowerCase().includes("/auth") ||
        reqUrl.toLowerCase().includes("/login") ||
        reqUrl.toLowerCase().includes("/signin");

    if (status === 401 && isBrowser && !onLoginPage && !isAuthEndpoint && !hasRedirected401) {
        hasRedirected401 = true;
        // no uses alert; solo redirige una vez
        window.location.href = "/Login";
        // resetea el flag después de unos segundos para permitir futuros intentos
        setTimeout(() => { hasRedirected401 = false; }, 5000);
    }

    return Promise.reject(err);
};

apiUser.interceptors.response.use(r => r, handleError(userBaseURL || ""));
apiEvent.interceptors.response.use(r => r, handleError(eventBaseURL || ""));

// Endpoints (event y venue comparten host)
export const eventApi = {
    createFull: (payload: any) => apiEvent.post("/api/event/create-full", payload),
    listVenues: () => apiEvent.get("/api/venue"),
    listLocations: () => apiEvent.get("/api/location"),
    listCitiesByLocation: (id: string) => apiEvent.get(`/api/location/${id}/cities`),
};