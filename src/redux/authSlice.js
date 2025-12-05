import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../utils/api';

export const loginUser = createAsyncThunk(
    'auth/login',
    async ({ name, password }, { rejectWithValue }) => {
        try {
            const response = await api.post('/auth/login', { name, password });
            return response.data; 
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Ошибка входа');
        }
    }
);

export const registerUser = createAsyncThunk(
    'auth/register',
    async ({ name, password }, { rejectWithValue, dispatch }) => {
        try {
            await api.post('/auth/register', { name, password });
            return dispatch(loginUser({ name, password })).unwrap();
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Ошибка регистрации');
        }
    }
);

const authSlice = createSlice({
    name: 'auth',
    initialState: {
        accessToken: localStorage.getItem('accessToken') || null,
        refreshToken: localStorage.getItem('refreshToken') || null, 
        name: localStorage.getItem('name') || null,
        status: 'idle',
        error: null,
    },
    reducers: {
        logout: (state) => {
            state.accessToken = null;
            state.refreshToken = null;
            state.name = null;
            state.status = 'idle';
            state.error = null;
            localStorage.clear(); 
        },
        clearErrors: (state) => {
            state.error = null;
            state.status = 'idle';
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(loginUser.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.accessToken = action.payload.accessToken;
                state.refreshToken = action.payload.refreshToken;
                state.name = action.payload.name;
                
                localStorage.setItem('accessToken', action.payload.accessToken);
                localStorage.setItem('refreshToken', action.payload.refreshToken);
                localStorage.setItem('name', action.payload.name);
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
            })
            .addCase(registerUser.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(registerUser.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
            });
    },
});

export const { logout, clearErrors } = authSlice.actions;
export default authSlice.reducer;