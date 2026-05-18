import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    const message = err.response?.data?.message || '서버 오류가 발생했습니다.';
    return Promise.reject(new Error(message));
  }
);

export default api;
