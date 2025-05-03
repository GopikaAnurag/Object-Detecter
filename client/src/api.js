import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000/log', // your backend URL
});

export default api;
