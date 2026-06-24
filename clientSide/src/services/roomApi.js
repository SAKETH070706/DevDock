import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api/rooms",
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const createRoom = (data) => API.post("/create", data);
export const joinRoom = (data) => API.post("/join", data);
export const getRoom = (roomId) => API.get(`/${roomId}`);
export const getHistory=(roomId)=>API.get( `/history/${roomId}`);
export const leaveRoom = (data) => API.post("/leave", data);
export const disbandRoom = (roomId) => API.delete(`/${roomId}`);
export const saveCode=(roomId,code)=>API.put(`/${roomId}/code`,{code});
export const updateLanguage=(roomId,language)=>API.put(`/${roomId}/language`,{language});