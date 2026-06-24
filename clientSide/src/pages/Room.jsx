import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { getRoom } from "../services/roomApi.js";
import Editor from "../components/Editor";
import socket from "../services/socket";
import { useAuth } from "../context/AuthContext";
import { saveCode,updateLanguage } from "../services/roomApi.js";
import { runCode } from "../services/compilerApi.js";
import { getHistory } from "../services/roomApi.js";

const Room = () => {
  const { roomId } = useParams();
  const { user } = useAuth();

  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [code, setCode] = useState("");
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [messages, setMessages] = useState([]);
  const [language, setLanguage] = useState("cpp");
  const [message, setMessage] = useState("");
  const [input,setInput]=useState("");
  const [output,setOutput]=useState("");
  const [running,setRunning]=useState(false);
  const [history,setHistory]=useState([]);


  const handleCodeChange = (value) => {
    setCode(value);
    socket.emit("code-change", { roomId, code: value });
  };

  const handleLanguageChange=async(e)=>{
    const newLanguage=e.target.value;
    setLanguage(newLanguage);
    socket.emit("language-change",{roomId,language:newLanguage});
    try{
      await updateLanguage(roomId,newLanguage);
    }
    catch(error)
    {
      console.log(error);
    }
  };

  const handleRun=async()=>{
    try{
       setRunning(true);

       const res=await runCode({roomId,code,language,input});

       const result=res.data.result;

       setOutput(result.stdout||  result.stderr || result.compile_output || result.message || "No Output");

       await fetchHistory();
    }
    catch(error)
    {
       setOutput("Execution Failed");
    }
    finally{
      setRunning(false);
    }
  };

  const fetchRoom = async () => {
    try {
      const res = await getRoom(roomId);
      setRoom(res.data.room);
      setLanguage(res.data.room.language);
      setCode(res.data.room.code || "");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch room");
    } finally {
      setLoading(false);
    }
  };

  const fetchHistory=async()=>{
    try{
      const res=await getHistory(roomId);
      setHistory(res.data.history);
    }
    catch(error)
    {
      console.log(error);
    }
  };


  useEffect(() => {
    fetchRoom();
    fetchHistory();
  }, []);

  useEffect(() => {
    if (!user) return;

    socket.connect();

    socket.on("connect", () => {
      console.log("Socket Connected:", socket.id);
    });

    socket.emit("join-room", { roomId, userId: user._id });

    return () => {
      socket.emit("leave-room", { roomId, userId: user._id });
      socket.disconnect();
    };
  }, [roomId, user]);

  useEffect(() => {
    socket.on("online-users", (users) => {
      setOnlineUsers(users);
    });
    return () => socket.off("online-users");
  }, []);

  useEffect(() => {
    socket.on("chat-message", (data) => {
      setMessages((prev) => [...prev, data]);
    });
    return () => socket.off("chat-message");
  }, []);

  useEffect(()=>{
    if(!roomId) return ;

    const timer=setTimeout(async()=>{
      try{
         await saveCode(roomId,code);
      }
      catch(error){
        console.log(error);
      }
    },2000);
    return ()=>
      clearTimeout(timer);
  },[code]);

  const sendMessage = () => {
    if (!message.trim()) return;
    socket.emit("chat-message", {
      roomId,
      userId: user._id,
      username: user.username,
      message,
    });
    setMessage("");
  };

  useEffect(() => {
    socket.on("code-update", (newCode) => {
      setCode(newCode);
    });
    return () => socket.off("code-update");
  }, []);

  useEffect(() => {
    socket.on("language-update", (newLanguage) => {
      setLanguage(newLanguage);
    });
    return () => socket.off("language-update");
  }, []);

  if (loading) return <h2>Loading...</h2>;

  return (
    <div style={{ height: "100vh", display: "flex", flexDirection: "column" }}>
      {/* Header */}
      <div
        style={{
          height: "70px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "0 20px",
          borderBottom: "1px solid #ddd",
        }}
      >
        <div>
          <h2>{room.roomName}</h2>
        </div>
        <div>
          Invite Code: <strong>{room.inviteCode}</strong>
        </div>
        <div>
          <select value={language} onChange={handleLanguageChange}>
            <option value="cpp">C++</option>
            <option value="java">Java</option>
            <option value="python">Python</option>
            <option value="javascript">JavaScript</option>
          </select>
        </div>
      </div>
       <button onClick={handleRun}>{running ?"Running..." :"▶ Run"}</button>
      {/* Main */}
      <div style={{ flex: 1, display: "flex" }}>
        {/* Editor */}
        <div
          style={{
            flex: 3,
            borderRight: "1px solid #ddd",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          
          <Editor language={language} code={code} onChange={handleCodeChange} />
        </div>
          
        <div
             style={{
                padding: "10px",
                borderTop: "1px solid #ddd",
                }}
        >
               <h3>Custom Input</h3>

            <textarea
                  value={input}
                   onChange={(e) => setInput(e.target.value)}
                   rows={5}
                    style={{ width: "100%" }}
                   placeholder="Enter input..."
             />
        </div>



          <div style={{
                   height: "200px",
                   borderTop: "1px solid #444",
                   padding: "10px",
                   overflowY:"auto",
          }}>
           <h3>Output</h3>
            <pre>{output}</pre>
          </div>

        {/* Sidebar */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
          {/* Online Users */}
          <div
            style={{
              flex: 1,
              borderBottom: "1px solid #ddd",
              padding: "10px",
            }}
          >
            <h3>Online Users</h3>
            {onlineUsers.map((onlineId) => {
              const participant = room.participants.find(
                (p) => p._id.toString() === onlineId
              );
              return <p key={onlineId}>{participant?.username}</p>;
            })}
          </div>

          {/* Chat */}
          <div style={{ flex: 1, padding: "10px" }}>
            <h3>Chat</h3>
            <div
              style={{
                height: "200px",
                overflowY: "auto",
                marginBottom: "10px",
              }}
            >
              {messages.map((msg, index) => (
                <p key={index}>
                  <strong>{msg.username}</strong>: {msg.message}
                </p>
              ))}
            </div>
            <input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type message..."
            />
            <button onClick={sendMessage}>Send</button>
            <div
  style={{
    flex: 1,
    overflowY: "auto",
    padding: "10px",
  }}
>
  <h3>Execution History</h3>

  {history.map((item) => (
    <div
      key={item._id}
      style={{
        border: "1px solid #ddd",
        marginBottom: "10px",
        padding: "8px",
      }}
    >
      <p>
        <strong>{item.user?.username}</strong>
      </p>
      <p>{item.language}</p>
      <p>{item.output}</p>
    </div>
  ))}
</div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default Room;
