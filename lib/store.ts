import { configureStore } from '@reduxjs/toolkit'
import eventReducer from './features/event/eventSlice'


export const makeStore = () => {
    return configureStore({
        reducer: {
            event: eventReducer
        }
    })
}


export type AppStore = ReturnType<typeof makeStore>
export type RootState = ReturnType<AppStore['getState']>
export type AppDispatch = AppStore['dispatch']