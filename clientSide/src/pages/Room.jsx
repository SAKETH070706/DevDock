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
import { getCode,getYDoc,removeYDoc } from "../yjs/ydoc";


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
  useEffect(()=>{
    if(!room) return ;
    const {ytext}=getYDoc(roomId);
    if (ytext.length === 0 && room.code) {
       ytext.insert(0, room.code);
    }
  },[room,roomId]);


  const isHost = room?.host?._id?.toString() === user?._id;

  const handleCodeChange = () => {};
  
  const onEditorMount = (editor) => {
    editorCleanup.current = handleEditorMount(
        editor,
        roomId,
        user,
        room?.code || ""
    );
};

  const initialized = useRef(false);

useEffect(() => {
    const { ytext } = getYDoc(roomId);

    let timer;

    const observer = () => {
        if (!initialized.current) {
            initialized.current = true;
            return;
        }

        clearTimeout(timer);

        timer = setTimeout(async () => {
            await saveCode(roomId, ytext.toString());
        }, 2000);
    };

    ytext.observe(observer);

    return () => {
        clearTimeout(timer);
        ytext.unobserve(observer);
    };
}, [roomId]);

useEffect(() => {
    return () => {
        editorCleanup.current?.();
        removeYDoc(roomId);
    };
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
