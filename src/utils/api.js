import axios from 'axios';
const LIVE_URL = 'https://subg-backend.onrender.com/api' 
//const LOCAL_URL = 'http://localhost:5000/api' 
const API = axios.create({ baseURL: LIVE_URL });

API.interceptors.request.use((req) => {
  const token = localStorage.getItem('token');
  if (token) req.headers.Authorization = `Bearer ${token}`;
  return req;
});

export default API;
