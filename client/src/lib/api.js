import axios from 'axios'

// In production (Vercel), VITE_API_URL points to the Render backend.
// In development, Vite proxy forwards /api to localhost:5000.
const baseURL = import.meta.env.VITE_API_URL || '/api'

const api = axios.create({ baseURL })

export default api
