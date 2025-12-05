import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../utils/api';

export const fetchPoints = createAsyncThunk(
    'points/fetchHistory',
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get('/points');
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Не удалось загрузить историю');
        }
    }
);

export const checkPoint = createAsyncThunk(
    'points/check',
    async (pointData, { rejectWithValue }) => {
        try {
            const response = await api.post('/points/check', pointData);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Ошибка при проверке точки');
        }
    }
);

export const fetchTilePoints = createAsyncThunk(
    'points/fetchTile',
    async ({ minX, minY, maxX, maxY, tileKey }, { rejectWithValue }) => {
        try {
            const response = await api.get(`/points/tile?minX=${minX}&minY=${minY}&maxX=${maxX}&maxY=${maxY}`);
            return { points: response.data, tileKey };
        } catch (error) {
            console.error(error);
            return rejectWithValue('Ошибка загрузки тайла');
        }
    }
);

const savedR = localStorage.getItem('lastR');
const initialR = savedR ? Number(savedR) : 1;

const pointsSlice = createSlice({
    name: 'points',
    initialState: {
        history: [],      
        tileCache: {},   
        r: initialR,
        status: 'idle',
        error: null,
    },
    reducers: {
        setRadius: (state, action) => {
            state.r = action.payload;
            localStorage.setItem('lastR', action.payload);
        },
        clearPointsLocally: (state) => {
            state.history = [];
            state.tileCache = {}; 
            state.status = 'idle';
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
            })
            .addCase(fetchTilePoints.fulfilled, (state, action) => {
                const { points, tileKey } = action.payload;
                
                state.tileCache[tileKey] = true;
                const newPoints = points.filter(newP => 
                    !state.history.some(existingP => existingP.id === newP.id)
                );
                
                state.history = [...state.history, ...newPoints];
            });
    },
});

export const { setRadius, clearPointsLocally } = pointsSlice.actions;
export default pointsSlice.reducer;