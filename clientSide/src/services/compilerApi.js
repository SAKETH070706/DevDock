import axios from "axios";

const API=axios.create({
    baseURL:"http://192.168.0.4:5000/api/compiler"
});

API.interceptors.request.use((config)=>{
    const token=localStorage.getItem("token");

    if(token)
    {
        config.headers.Authorization=`Bearer ${token}`;
    }
    return config;
});

export const runCode=(data)=>{ return API.post("/run",data);}