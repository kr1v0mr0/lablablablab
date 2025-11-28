import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../utils/api';

// Получение истории (предполагаем, что GET остался на /points, или измените при необходимости)
export const fetchPoints = createAsyncThunk(
    'points/fetchHistory',
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get('/points'); // Если URL другой, поменяйте тут
            return response.data;
        } catch (error) {
            return rejectWithValue('Не удалось загрузить историю');
        }
    }
);

// Проверка новой точки (UPDATED URL)
export const checkPoint = createAsyncThunk(
    'points/check',
    async (pointData, { rejectWithValue }) => {
        try {
            // URL изменен на /points/check согласно curl
            const response = await api.post('/points/check', pointData);
            return response.data;
        } catch (error) {
            return rejectWithValue('Ошибка при проверке точки');
        }
    }
);

const pointsSlice = createSlice({
    name: 'points',
    initialState: {
        history: [],
        r: 1,
        status: 'idle',
        error: null,
    },
    reducers: {
        setRadius: (state, action) => {
            state.r = action.payload;
        },
        clearPointsLocally: (state) => {
            state.history = [];
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchPoints.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.history = action.payload;
            })
            .addCase(checkPoint.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.history.unshift(action.payload);
            });
    },
});

export const { setRadius, clearPointsLocally } = pointsSlice.actions;
export default pointsSlice.reducer;