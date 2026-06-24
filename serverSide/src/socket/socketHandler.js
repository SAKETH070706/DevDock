import redis from "../config/redis.js";

const socketHandler = (io) => {
  io.on("connection", (socket) => {
    

    socket.on("join-room", async ({ roomId, userId }) => {
       
      socket.join(roomId);
      socket.data.roomId = roomId;
      socket.data.userId = userId;
      await redis.sadd(`room:${roomId}:users`, userId);

      const onlineUsers = await redis.smembers(`room:${roomId}:users`);
      io.to(roomId).emit("online-users", onlineUsers);

      
    });

    socket.on("leave-room", async ({ roomId, userId }) => {
      socket.leave(roomId);
      await redis.srem(`room:${roomId}:users`, userId);

      const onlineUsers = await redis.smembers(`room:${roomId}:users`);
      io.to(roomId).emit("online-users", onlineUsers);

      
    });

    socket.on("chat-message",async({roomId,userId,username,message})=>{
        io.to(roomId).emit("chat-message",{userId,username,message,timestamp:Date.now()});
    })

    socket.on("code-change",({roomId,code})=>{
        socket.to(roomId).emit("code-update",code);
    });
    
    socket.on("language-change",({roomId,language})=>{
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
