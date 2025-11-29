import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./features/user/userSlice";
import authReducer from "./features/auth/authSlice";
import eventsReducer from "./features/event/eventSlice"; // FIX ruta singular

export function makeStore() {
    return configureStore({
        reducer: {
            user: userReducer,
            auth: authReducer,
            events: eventsReducer,
        },
    });
}
export const store = makeStore();
export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];