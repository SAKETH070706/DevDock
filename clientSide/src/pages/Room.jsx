import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState,useRef } from "react";
import toast from "react-hot-toast";
import useRoomActions from "../hooks/useRoomActions.js";
import {saveCode} from "../services/roomApi.js";
import useRoomData from "../hooks/useRoomData.js";
import useRoomSocket from "../hooks/useRoomSocket.js";
import { useAuth } from "../context/AuthContext";
import RoomHeader from "../components/room/RoomHeader.jsx";
import EditorWorkspace from "../components/room/EditorWorkspace.jsx";
import Sidebar from "../components/room/Sidebar.jsx";
import {handleEditorMount} from "../yjs/handleEditorMount.js";
import { getCode } from "../yjs/ydoc";



const Room = () => {
  const navigate = useNavigate();
  const editorCleanup = useRef(null);
  const { roomId } = useParams();
  const { user } = useAuth();
  const [code, setCode] = useState("");
  const [input, setInput] = useState("");
  const [language, setLanguage] = useState("cpp");
  const [message, setMessage] = useState("");
  const [isLeaving, setIsLeaving] = useState(false);

  const {room,history,loading,fetchRoom,fetchHistory,} = useRoomData(
  roomId,
  navigate,
  setCode,
  setLanguage
);

const {
    onlineUsers,
    messages,
    sendMessage,
    emitLanguageChange,
} = useRoomSocket({
    roomId,
    user,
    setLanguage,
    fetchRoom,
    onRoomDisbanded: () => {
        toast.error("Room has been disbanded.");
        navigate("/dashboard");
    },
});

  const {running,output,handleRun,handleLeaveRoom,handleDisbandRoom,handleLanguageChange,} = useRoomActions({
  roomId,
  user,
  code,
  language,
  input,
  fetchHistory,
  emitLanguageChange,
  navigate,
});


  const isHost = room?.host?._id?.toString() === user?._id;

  const handleCodeChange = () => {};
  
  const onEditorMount = (editor) => {
    editorCleanup.current = handleEditorMount(
        editor,
        roomId,
        user
    );
};

useEffect(() => {
    return () => {
        editorCleanup.current?.();
    };
}, []);

  useEffect(() => {
    if (!roomId) return;
    const timer = setTimeout(async () => {
      try {
        await saveCode(roomId,getCode(roomId));
      } catch (error) {
        console.log(error);
      }
    }, 2000);
    return () => clearTimeout(timer);
  }, [roomId]);

 

  const handleSendMessage = () => {
    sendMessage(message);
    setMessage("");
  };

  if (loading || !room) {
    return <h2>Loading...</h2>;
  }

  const participantMap = Object.fromEntries(
    room.participants.map((p) => [p._id.toString(), p])
  );

  return (
    <div style={{ height: "100vh", display: "flex", flexDirection: "column" }}>
      {/* Header */}
      <RoomHeader
        room={room}
        language={language}
        isHost={isHost}
        onLanguageChange={(e)=>
           handleLanguageChange(e,setLanguage)
            }
        onLeaveRoom={()=>
           handleLeaveRoom(setIsLeaving)
        }
        onDisbandRoom={handleDisbandRoom}
      />

      {/* Main */}
      <div style={{ flex: 1, display: "flex" }}>
        {/* Editor */}
        <EditorWorkspace
            language={language}
            onMount={onEditorMount}
            input={input}
            setInput={setInput}
            output={output}
            running={running}
            onRun={handleRun}
         />

        {/* Sidebar */}
        <Sidebar
           onlineUsers={onlineUsers}
           participantMap={participantMap}
           messages={messages}
           message={message}
           setMessage={setMessage}
           sendMessage={handleSendMessage}
           history={history}
        />
      </div>
    </div>
  );
};

export default Room;
