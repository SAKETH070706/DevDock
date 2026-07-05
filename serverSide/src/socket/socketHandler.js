import redis from "../config/redis.js";
import Room from "../models/roomModel.js";

const socketHandler = (io) => {
  io.on("connection", (socket) => {
    

    socket.on("join-room", async ({ roomId, userId }) => {
       
      socket.join(roomId);
      socket.data.roomId = roomId;
      socket.data.userId = userId;
      await redis.sadd(`room:${roomId}:users`, userId);
      io.to(roomId).emit("participants-updated");
      const onlineUsers = await redis.smembers(`room:${roomId}:users`);
      io.to(roomId).emit("online-users", onlineUsers);

      
    });

    socket.on("leave-room", async ({ roomId, userId }) => {
      socket.leave(roomId);
      await redis.srem(`room:${roomId}:users`, userId);
      io.to(roomId).emit("participants-updated");

      const onlineUsers = await redis.smembers(`room:${roomId}:users`);
      io.to(roomId).emit("online-users", onlineUsers);

      io.to(roomId).emit("participants-updated");
    });

    socket.on("chat-message",async({roomId,userId,username,message})=>{
        io.to(roomId).emit("chat-message",{userId,username,message,timestamp:Date.now()});
    })
   
    socket.on("yjs-update",({roomId,update})=>{
        socket.to(roomId).emit("yjs-update",{update});
    });

    socket.on("awareness-update",({roomId,update})=>{
        socket.to(roomId).emit("awareness-update",{update});
    });

    socket.on("language-change",async({roomId,language})=>{
        const room=await Room.findById(roomId);
        if(!room) return ;
        if(room.host.toString()!== socket.data.userId) return ;
        socket.to(roomId).emit("language-update",language);
    });

    socket.on("disconnect", async () => {
    
      
      const roomId = socket.data.roomId;
      const userId = socket.data.userId;

      if (roomId && userId) {
        await redis.srem(`room:${roomId}:users`, userId);
        const onlineUsers = await redis.smembers(`room:${roomId}:users`);
        io.to(roomId).emit("online-users", onlineUsers);
      }
      
    });
  });
};



export default socketHandler;
