import { configureStore } from '@reduxjs/toolkit';
import userReducer from './features/user/userSlice';
import eventReducer from './features/event/eventSlice';

export function makeStore() {
    return configureStore({
        reducer: {
            user: userReducer,
            event: eventReducer,
        },
    });
}

export const store = makeStore();
export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];