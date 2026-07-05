import { useEffect, useState } from "react";
import socket from "../services/socket";

const useRoomSocket = ({ roomId, user, setLanguage,onRoomDisbanded,fetchRoom }) => {
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [messages, setMessages] = useState([]);
   

  useEffect(() => {
    if (!user) return;
     if(!socket.connected){
         socket.connect();
     }
    const onConnect = () => {

      socket.emit("join-room", {
        roomId,
        userId: user._id,
      });
    };

    socket.on("connect", onConnect);

    return () => {
      socket.off("connect", onConnect);

      socket.emit("leave-room", {
        roomId,
        userId: user._id,
      });

      socket.disconnect();
    };
  }, [roomId, user]);

  useEffect(() => {
    socket.on("online-users", (users) => {
      setOnlineUsers(users);
    });

    return () => socket.off("online-users");
  }, []);

   useEffect(()=>{
    const handleParticipants=()=>{
      fetchRoom();
    };
    socket.on("participants-updated",handleParticipants);
    return ()=>{
      socket.off("participants-updated",handleParticipants);
    };
  },[fetchRoom]);

  useEffect(() => {
    socket.on("chat-message", (data) => {
      setMessages((prev) => [...prev, data]);
    });

    return () => socket.off("chat-message");
  }, []);

  
  useEffect(() => {
    socket.on("language-update", (language) => {
      setLanguage(language);
    });

    return () => socket.off("language-update");
  }, [setLanguage]);

  useEffect(()=>{
    const handleDisband=()=>{
      if(onRoomDisbanded){
        onRoomDisbanded();
      }
    }
    socket.on("room-disbanded", handleDisband);

    return () => socket.off("room-disbanded", handleDisband);
  }, [onRoomDisbanded]);

  const sendMessage = (message) => {
    if (!message.trim()) return;

    socket.emit("chat-message", {
      roomId,
      userId: user._id,
      username: user.username,
      message,
    });
  };

  

  const emitLanguageChange = (language) => {
    socket.emit("language-change", {
      roomId,
      language,
    });
  };

  return {
    onlineUsers,
    messages,
    sendMessage,
    emitLanguageChange,
  };
};

export default useRoomSocket;
