import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import pointsReducer from './pointsSlice';

export const store = configureStore({
    reducer: {
        // Именно эти ключи определяют, как обращаться к данным: state.auth и state.points
        auth: authReducer,
        points: pointsReducer,
    },
});