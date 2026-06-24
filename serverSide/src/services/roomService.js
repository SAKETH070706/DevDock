import Room from "../models/roomModel.js";
import redis from "../config/redis.js";
import {generateRoomCode} from "../utils/generateRoomCode.js";

const INVITE_CODE_EXPIRY=10*60;

export const createRoom=async(roomName,language,hostId)=>
{
    let inviteCode;
    do{
        inviteCode=generateRoomCode();
    }while(await redis.exists(`room:${inviteCode}`));

    const room=await Room.create({
        roomName,
        host:hostId,
        participants: [hostId],
        language,
        inviteCode
    });

    await redis.setex(`room:${inviteCode}`,INVITE_CODE_EXPIRY,room._id.toString());

    return {
        room,
        inviteCode
    };
};


export const joinRoom = async (inviteCode, userId) => {
  const room = await Room.findOne({ inviteCode });

  if (!room) {
    throw new Error("Invalid invite code");
  }

  const alreadyJoined = room.participants.some(
    (participant) => participant.toString() === userId.toString()
  );

  if (!alreadyJoined) {
    room.participants.push(userId);
    await room.save();
  }

  return room;
};


export const getRoomById=async(roomId)=>{
    const room=await Room.findById(roomId).populate("host","username email").populate("participants","username email");
    if (!room) {
        throw new Error("Room not found");
    }
    return room;
};


export const disbandRoom=async(roomId,userId)=>{
    const room=await Room.findById(roomId);

    if(!room)
    {
        throw new Error("Room not found");
    }

    if(room.host.toString()!==userId.toString())
    {
        throw new Error("Only host can disband room");
    }

    await redis.del(`room:${room.inviteCode}`);

    await Room.findByIdAndDelete(roomId);

    return {
        success:true,
        message: "Room disbanded succesfully"
    };
};

export const leaveRoom=async(roomId,userId)=>{
    const room=await Room.findById(roomId);

    if(!room)
    {
        throw new Error("Room not Found");
    }

    const participantIndex=room.participants.findIndex(participant=>participant.toString()===userId.toString());

    if(participantIndex===-1)
    {
        throw new Error("User is not in this room");
    }

    room.participants.splice(participantIndex,1);

    if(room.host.toString()===userId.toString())
    {
        if(room.participants.length>0)
        {
            room.host=room.participants[0];
        }
        else{
            room.isActive=false;
        }
    }
    await room.save();

    return room;
};