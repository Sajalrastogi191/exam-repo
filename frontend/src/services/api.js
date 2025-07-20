import axios from "axios"

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api"

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
})

// Add request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token")
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error),
)

// Auth services
export const authService = {
  register: (userData) => api.post("/auth/register", userData),
  login: (userData) => api.post("/auth/login", userData),
  getProfile: () => api.get("/auth/me"),
  updateProfile: (userData) => api.put("/auth/profile", userData),
  updatePassword: (passwordData) => api.put("/auth/password", passwordData),
}

// Paper services
export const paperService = {
  getPapers: (filters) => api.get("/papers", { params: filters }),
  getPaperById: (id) => api.get(`/papers/${id}`),
  uploadPaper: (paperData) => {
    const formData = new FormData()
    for (const key in paperData) {
      formData.append(key, paperData[key])
    }
    return api.post("/papers", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
  },
  getUserPapers: () => api.get("/papers/user/papers"),
  getFilterOptions: () => api.get("/papers/filter-options"),
  downloadPaper: (id) => window.open(`${API_URL}/papers/${id}/download`, "_blank"),
  deletePaper: (id) => api.delete(`/papers/${id}`),
}

// Solution services
export const solutionService = {
  getSolutions: (paperId) => api.get(`/solutions/paper/${paperId}`),
  addSolution: (paperId, content) => api.post(`/solutions/paper/${paperId}`, { content }),
  upvoteSolution: (id) => api.put(`/solutions/${id}/upvote`),
  downvoteSolution: (id) => api.put(`/solutions/${id}/downvote`),
  getUserSolutions: () => api.get("/solutions/user/solutions"),
}

export default api
