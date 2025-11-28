import axios from 'axios';

const API_URL = 'http://localhost:8080/api';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// 1. Request Interceptor: Добавляем Access Token в каждый запрос
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('accessToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// 2. Response Interceptor: Обработка 401 и Refresh Token
api.interceptors.response.use(
    (response) => response, // Если все ок, просто возвращаем ответ
    async (error) => {
        const originalRequest = error.config;

        // Если ошибка 401 и это не повторный запрос (чтобы избежать бесконечного цикла)
        if (error.response && error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                const refreshToken = localStorage.getItem('refreshToken');
                
                if (!refreshToken) {
                    throw new Error('No refresh token');
                }

                // Запрашиваем новый access token
                // ВАЖНО: Уточните, какой точно URL и тело запроса для рефреша на вашем бэке
                // Обычно это POST /auth/refresh с телом { refreshToken: "..." }
                const response = await axios.post(`${API_URL}/auth/refresh`, {
                    refreshToken: refreshToken
                });

                // Если сервер вернул новые токены
                const { accessToken, refreshToken: newRefreshToken } = response.data;
                
                localStorage.setItem('accessToken', accessToken);
                // Если сервер обновляет и refresh token тоже, сохраняем его
                if (newRefreshToken) {
                    localStorage.setItem('refreshToken', newRefreshToken);
                }

                // Меняем заголовок в старом запросе и повторяем его
                originalRequest.headers.Authorization = `Bearer ${accessToken}`;
                return api(originalRequest);

            } catch (refreshError) {
                // Если не удалось обновить токен (например, refresh протух) - полный логаут
                console.error('Refresh failed:', refreshError);
                localStorage.removeItem('accessToken');
                localStorage.removeItem('refreshToken');
                localStorage.removeItem('name');
                window.location.href = '/login';
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

export default api;