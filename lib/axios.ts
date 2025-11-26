import axios from 'axios';
import { getAuthData } from "./utils/authHelpers";
import { deleteCookie } from 'cookies-next';


let logoutCallback: (() => void) | null = null;

export function setLogoutCallback(cb: () => void) {
    logoutCallback = cb;
}

export function getLogoutCallback() {
    return logoutCallback;
}

const validateLogout = () => {
    if (logoutCallback) {
        deleteCookie("access_token");
        logoutCallback();
    }
}

function applyAuthInterceptor(instance: any) {
    instance.interceptors.request.use((config: any) => {
        const { token } = getAuthData();
        if (token) {
            config.headers = config.headers || {};
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    });
    instance.interceptors.response.use(
        response => response,
        error => {
            // if (error.response && error.response.status === 401) {
            //   validateLogout();
            // }
            return Promise.reject(error);
        }
    );
}

export const apiEvent = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL_EVENT,
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 10000,
});
applyAuthInterceptor(apiEvent);
