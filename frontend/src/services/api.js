import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';
export const API_SERVER_URL = 'http://localhost:5000';

export const getImageUrl = (image) => {
  if (!image) return 'https://images.unsplash.com/photo-1594035910387-fea47794261f?q=80&w=600&auto=format&fit=crop';
  return image.startsWith('http') ? image : `${API_SERVER_URL}${image}`;
};

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle responses
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth endpoints
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getMe: () => api.get('/auth/me'),
  updateProfile: (data) => api.put('/auth/profile', data),
};

// Products endpoints
export const productsAPI = {
  getAll: (params) => api.get('/products', { params }),
  getById: (id) => api.get(`/products/${id}`),
  create: (data) => api.post('/products', data),
  update: (id, data) => api.put(`/products/${id}`, data),
  delete: (id) => api.delete(`/products/${id}`),
};

// Cart endpoints
export const cartAPI = {
  getCart: () => api.get('/cart'),
  addToCart: (data) => api.post('/cart/add', data),
  updateItem: (productId, data) => api.put(`/cart/update/${productId}`, data),
  removeItem: (productId) => api.delete(`/cart/remove/${productId}`),
  clearCart: () => api.delete('/cart/clear'),
};

// Orders endpoints
export const ordersAPI = {
  getAll: () => api.get('/orders'),
  getById: (id) => api.get(`/orders/${id}`),
  create: (data) => api.post('/orders', data),
  updateStatus: (id, data) => api.put(`/orders/${id}/status`, data),
};

// Search endpoints
export const searchAPI = {
  search: (params) => api.get('/search', { params }),
};

// Contact endpoints
export const contactAPI = {
  create: (data) => api.post('/contact', data),
};

// Admin endpoints
export const adminAPI = {
  getStats: () => api.get('/admin/stats'),
  getUsers: () => api.get('/admin/users'),
  getOrders: () => api.get('/admin/orders'),
  updateOrderStatus: (id, data) => api.put(`/admin/orders/${id}/status`, data),
  getProducts: () => api.get('/admin/products'),
  createProduct: (data) => api.post('/admin/products', data),
  updateProduct: (id, data) => api.put(`/admin/products/${id}`, data),
  deleteProduct: (id) => api.delete(`/admin/products/${id}`),
};

export default api;
