import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000', // Адрес вашего бэкенда
  withCredentials: true,
});

// Добавляем интерцептор для автоматической подстановки токена
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Экспортируем функцию для получения профиля пользователя
export const getUserProfile = async () => {
  try {
    const response = await api.get('/auth/profile');
    return response.data;
  } catch (error) {
    console.error('Ошибка при загрузке профиля:', error);
    throw error;
  }
};

export default api;