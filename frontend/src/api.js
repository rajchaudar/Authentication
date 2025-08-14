import axios from 'axios';

// Ensure base URL is present
const baseURL = process.env.REACT_APP_API_BASE_URL;
if (!baseURL) {
  console.warn('⚠️ REACT_APP_API_BASE_URL is not set in .env');
}

const api = axios.create({
  baseURL,
});

// Attach access token before request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle 401 with refresh token logic
api.interceptors.response.use(
  (res) => res,
  async (err) => {
    const originalReq = err.config;

    if (err.response?.status === 401 && !originalReq._retry) {
      originalReq._retry = true;
      try {
        const refreshToken = localStorage.getItem('refreshToken');
        const res = await axios.post(
          `${baseURL}/refresh`,
          { refreshToken }
        );

        const { accessToken } = res.data;
        localStorage.setItem('accessToken', accessToken);

        originalReq.headers.Authorization = `Bearer ${accessToken}`;
        return api(originalReq);
      } catch (refreshErr) {
        localStorage.clear();
        window.location.href = '/login';
        return Promise.reject(refreshErr);
      }
    }

    return Promise.reject(err);
  }
);

export default api;