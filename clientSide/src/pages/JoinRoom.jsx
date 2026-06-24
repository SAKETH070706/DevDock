import {useState} from "react";
import { joinRoom } from "../services/roomApi";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const JoinRoom=()=>{
    const navigate=useNavigate();
    const [inviteCode,setInviteCode]=useState("");

    const handleJoin=async(e)=>{
     e.preventDefault();
    try {
      const res = await joinRoom({ inviteCode });
      toast.success("Joined Room");
      navigate(`/room/${res.data.room._id}`);
    } 
    catch (error) {
      toast.error(error.response?.data?.message || "Failed to join room");
    }
  }
  
   return(
    <div>
        <h1>
            Join Room
        </h1>
        <form onSubmit={handleJoin}>
        <input
          placeholder="Invite Code"
          value={inviteCode}
          onChange={(e) => setInviteCode(e.target.value)}
        />

        <br />

        <button type="submit">Join</button>
      </form>

    </div>
   );

};

export default JoinRoom;