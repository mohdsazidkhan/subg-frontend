import axios from 'axios';
const API_URL = 'https://subg-backend.onrender.com/api' 
//const API_URL = 'http://localhost:5000/api' 
const API = axios.create({ baseURL: API_URL });

API.interceptors.request.use((req) => {
  const token = localStorage.getItem('token');
  if (token) req.headers.Authorization = `Bearer ${token}`;
  return req;
});

export default API;
