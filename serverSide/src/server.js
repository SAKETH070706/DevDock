import dns from "dns";
dns.setServers(["8.8.8.8", "8.8.4.4"]);

import dotenv from "dotenv";
dotenv.config();
import jwt from "jsonwebtoken";
import User from "./models/userModel.js";
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
        origin: [process.env.CLIENT_URL],
        methods:["GET","POST"]
    }
});
app.set("io", io);

app.use(cors({
    origin: process.env.CLIENT_URL,
    credentials: true
}));
app.use(express.json());

await connectDB();
await connectRedis();

app.use((req, res, next) => {
    req._arrivalTime = process.hrtime.bigint();
    next();
});

app.use("/api/auth", authRoutes);
app.use("/api/rooms",roomRoutes);
app.use("/api/compiler",compilerRoutes);

io.use(async (socket, next) => {
    try {
        const token = socket.handshake.auth.token;

        if (!token) {
            return next(new Error("Authentication required"));
        }

        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        const user = await User.findById(decoded.id);

        if (!user) {
            return next(new Error("Invalid user"));
        }

        socket.user = user;

        next();

    } catch (err) {
        next(new Error("Authentication failed"));
    }
});
socketHandler(io);

const PORT = process.env.PORT || 5000;

server.listen(PORT,() => {
    console.log(
        `Server running on port ${PORT}`
    );
});

