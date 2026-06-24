import Execution from "../models/Execution.js";

export const getRoomHistory=async(roomId)=>{
    return await Execution.find({room:roomId}).populate("user","username").sort(
        {createdAt:-1}
    );
};

