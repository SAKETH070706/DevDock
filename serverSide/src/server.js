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
        origin:"http://localhost:5173",
        methods:["GET","POST"]
    }
});


app.use(cors());
app.use(express.json());

connectDB();
connectRedis();

app.use("/api/auth", authRoutes);
app.use("/api/rooms",roomRoutes);
app.use("/api/compiler",compilerRoutes);

socketHandler(io);

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
    console.log(
        `Server running on port ${PORT}`
    );
});

app.listen(PORT, () => {
    console.log(
        `Server running on port ${PORT}`
    );
});