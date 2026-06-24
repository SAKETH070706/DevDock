import Room from "../models/roomModel.js";

export const saveCode=async(roomId,code)=>{
    const room=await Room.findByIdAndUpdate(roomId,{code},{ returnDocument: "after" });

    if(!room){
        throw new Error("Room not found");
    }
    return room;
};