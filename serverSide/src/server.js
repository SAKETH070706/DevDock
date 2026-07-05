import dns from "dns";
dns.setServers(["8.8.8.8", "8.8.4.4"]);

import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import http from "http";
import {Server} from "socket.io";
import {connectRedis} from "./config/redis.js";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import roomRoutes  from "./routes/roomRoutes.js";
import socketHandler from "./socket/socketHandler.js";
import compilerRoutes from "./routes/compilerRoutes.js";

const app = express();

const server=http.createServer(app);

const io=new Server(server,{
    cors:{
        origin:"http://192.168.0.4:5173",
        methods:["GET","POST"]
    }
});
app.set("io", io);

app.use(cors());
app.use(express.json());

connectDB();
connectRedis();

app.use("/api/auth", authRoutes);
app.use("/api/rooms",roomRoutes);
app.use("/api/compiler",compilerRoutes);

socketHandler(io);

const PORT = process.env.PORT || 5000;

server.listen(PORT,"0.0.0.0", () => {
    console.log(
        `Server running on port ${PORT}`
    );
});

