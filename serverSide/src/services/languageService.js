import Room from "../models/roomModel.js";

export const updateLanguage=async(getRoomById,language)=>{
    const room=await Room.findByIdAndUpdate(getRoomById,{language},{returnDocument:true});

    if(!room) {
        throw new Error("Room not found");
    }
    return room;
};
