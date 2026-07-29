import axios from "axios";

const API = axios.create({ baseURL:`${import.meta.env.VITE_API_URL}/auth` });

export const sendOTP=(data)=>API.post("/send-otp",data);
export const verifyOTP=(data)=>API.post("/verify-otp",data);
export const registerUser=(data)=>API.post("/register",data);
export const loginUser=(data)=>API.post("/login",data);
export const forgotPassword=(data)=>API.post("/forgot-password",data);
export const resetPassword=(data)=>API.post("/reset-password",data);
