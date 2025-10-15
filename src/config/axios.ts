
import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';

const API_URL = 'https://uniseapshop.fpt-devteam.fun/'; 

const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
});

// Request interceptor
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Lấy token từ localStorage (hoặc nơi bạn lưu trữ token)
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    // Xử lý phản hồi thành công
    return response;
  },
  (error: AxiosError) => {
    if (error.response) {
      switch (error.response.status) {
        case 401:
          // Xử lý lỗi Unauthorized
          console.log('Unauthorized, logging out...');
          break;
        case 403:
          // Xử lý lỗi Forbidden
          console.log('Forbidden');
          break;
        case 404:
          // Xử lý lỗi Not Found
          console.log('Resource not found');
          break;
        default:
          // Xử lý các lỗi khác
          console.log('An error occurred:', error.response.data);
          break;
      }
    } else if (error.request) {
      // Yêu cầu được gửi nhưng không nhận được phản hồi
      console.log('No response received:', error.request);
    } else {
      // Có lỗi khi thiết lập yêu cầu
      console.log('Error setting up request:', error.message);
    }
    return Promise.reject(error);
  }
);

export default api;