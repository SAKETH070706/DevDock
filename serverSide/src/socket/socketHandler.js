import redis from "../config/redis.js";
import Room from "../models/roomModel.js";
import mongoose from "mongoose";

const socketHandler = (io) => {
  io.on("connection", (socket) => {
    socket.on("join-room", async ({ roomId }) => {
      try {
        if (!mongoose.Types.ObjectId.isValid(roomId)) {
          return socket.emit("room-error", { message: "Invalid room id" });
        }

        const room = await Room.findById(roomId).select("host participants isActive");
        if (!room || !room.isActive) {
          return socket.emit("room-error", { message: "Room not found or inactive" });
        }

        const isMember =
          room.host.equals(socket.user._id) ||
          room.participants.some((id) => id.equals(socket.user._id));

        if (!isMember) {
          return socket.emit("unauthorized", { message: "You are not a participant of this room" });
        }

        socket.join(roomId);
        socket.data.roomId = roomId;
        socket.data.userId = socket.user._id.toString();

        await redis.sadd(`room:${roomId}:users`, socket.user._id.toString());
        const onlineUsers = await redis.smembers(`room:${roomId}:users`);

        io.to(roomId).emit("participants-updated");
        io.to(roomId).emit("online-users", onlineUsers);
      } catch (err) {
        console.error("Join Room Error:", err);
        socket.emit("room-error", { message: "Unable to join room" });
      }
    });

    socket.on("leave-room", async ({ roomId }) => {
      try {
        if (!mongoose.Types.ObjectId.isValid(roomId)) return;

        socket.leave(roomId);
        await redis.srem(`room:${roomId}:users`, socket.user._id.toString());
        const onlineUsers = await redis.smembers(`room:${roomId}:users`);

        io.to(roomId).emit("participants-updated");
        io.to(roomId).emit("online-users", onlineUsers);
      } catch (err) {
        console.error("Leave Room Error:", err);
      }
    });

    socket.on("chat-message", ({ roomId, message }) => {
      try {
        if (!mongoose.Types.ObjectId.isValid(roomId)) return;
        if (socket.data.roomId !== roomId) return;

        if (typeof message !== "string" || message.trim().length === 0 || message.length > 1000) {
          return;
        }

        message = message.trim();
        io.to(roomId).emit("chat-message", {
          userId: socket.user._id,
          username: socket.user.username,
          message,
          timestamp: Date.now(),
        });
      } catch (err) {
        console.error("Chat Error:", err);
      }
    });

    socket.on("yjs-update", ({ roomId, update }) => {
      try {
        if (!mongoose.Types.ObjectId.isValid(roomId)) return;
        if (socket.data.roomId !== roomId) return;

        socket.to(roomId).emit("yjs-update", { update });
      } catch (err) {
        console.error("YJS Update Error:", err);
      }
    });

    socket.on("awareness-update", ({ roomId, update }) => {
      try {
        if (!mongoose.Types.ObjectId.isValid(roomId)) return;
        if (socket.data.roomId !== roomId) return;

        socket.to(roomId).emit("awareness-update", { update });
      } catch (err) {
        console.error("Awareness Error:", err);
      }
    });

    socket.on("language-change", async ({ roomId, language }) => {
      try {
        if (!mongoose.Types.ObjectId.isValid(roomId)) return;
        if (socket.data.roomId !== roomId) return;

        const room = await Room.findById(roomId).select("host");
        if (!room) return;

        if (!room.host.equals(socket.user._id)) {
          return socket.emit("unauthorized", { message: "Only host can change language" });
        }

        socket.to(roomId).emit("language-update", language);
      } catch (err) {
        console.error("Language Change Error:", err);
      }
    });

    socket.on("disconnect", async () => {
      try {
        const { roomId, userId } = socket.data;
        if (!roomId || !userId) return;
        if (!mongoose.Types.ObjectId.isValid(roomId)) return;

        await redis.srem(`room:${roomId}:users`, userId);
        const onlineUsers = await redis.smembers(`room:${roomId}:users`);

        io.to(roomId).emit("online-users", onlineUsers);
      } catch (err) {
        console.error("Disconnect Error:", err);
      }
    });
  });
};

export default socketHandler;
