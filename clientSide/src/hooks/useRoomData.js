import { useEffect, useState, useCallback } from "react";
import toast from "react-hot-toast";
import { getRoom, getHistory } from "../services/roomApi";

const useRoomData = (roomId, navigate,setCode,setLanguage) => {
  const [room, setRoom] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchRoom = useCallback(async () => {
    try {
      const res = await getRoom(roomId);

      setRoom(res.data.room);
      setLanguage(res.data.room.language);
      setCode(res.data.room.code || "");
    } catch (error) {
      if (error.response?.status === 404) {
        toast.error("Room no longer exists.");
        navigate("/dashboard");
        return;
      }
      toast.error(error.response?.data?.message || "Failed to fetch room");
    } finally {
      setLoading(false);
    }
  }, [roomId, navigate, setCode, setLanguage]); 

  const fetchHistory = async () => {
    try {
      const res = await getHistory(roomId);
      setHistory(res.data.history);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (!roomId) return;
    fetchRoom();
    fetchHistory();
  }, [roomId, fetchRoom]);

  return {
    room,
    history,
    loading,
    fetchRoom,
    fetchHistory,
    setHistory,
    setRoom,
  };
};

export default useRoomData;
