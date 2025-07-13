import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/auth/login";
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: (userData) => api.post("/api/auth/register", userData),
  login: (credentials) => api.post("/api/auth/login", credentials),
  getMe: () => api.get("/api/auth/me"),
};

// Notes API
export const notesAPI = {
  getAll: (params = {}) => api.get("/api/notes", { params }),
  getById: (id) => api.get(`/api/notes/${id}`),
  create: (noteData) => api.post("/api/notes", noteData),
  update: (id, noteData) => api.put(`/api/notes/${id}`, noteData),
  delete: (id) => api.delete(`/api/notes/${id}`),
};

// Bookmarks API
export const bookmarksAPI = {
  getAll: (params = {}) => api.get("/api/bookmarks", { params }),
  getById: (id) => api.get(`/api/bookmarks/${id}`),
  create: (bookmarkData) => api.post("/api/bookmarks", bookmarkData),
  update: (id, bookmarkData) => api.put(`/api/bookmarks/${id}`, bookmarkData),
  delete: (id) => api.delete(`/api/bookmarks/${id}`),
};

export default api;
