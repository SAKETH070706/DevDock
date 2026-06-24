import {useState} from "react";
import {createRoom} from "../services/roomApi";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const CreateRoom=()=>{
    const navigate=useNavigate();
   
    const [roomName,setRoomName] =useState("");
    const [language,setLanguage]=useState("cpp");

    const handleCreateRoom = async (e) => {
        e.preventDefault();
        try{
            const res=await createRoom({roomName,language});
            toast.success("Room Created");
            navigate(`/room/${res.data.room._id}`);
        }
        catch(error)
        {
            toast.error(error.response?.data?.message || "Failed to create room");
        }
    }

return (
    <div>
        <h1>Create Room</h1>
        <input
        placeholder="Room Name"
        value={roomName}
        onChange={(e) => setRoomName(e.target.value)}
      />
       <br />
        <select value={language} onChange={(e) => setLanguage(e.target.value)}>
        <option value="cpp">C++</option>
        <option value="java">Java</option>
        <option value="python">Python</option>
        <option value="javascript">JavaScript</option>
      </select>
        <br />

      <button type="submit" onClick={handleCreateRoom}>Create</button>
    </div>
);

};

export default CreateRoom;

