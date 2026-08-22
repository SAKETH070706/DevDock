import Room from "../models/roomModel.js";
import redis from "../config/redis.js";

export const updateLanguage = async (roomId, language) => {

    const room = await Room.findByIdAndUpdate(
        roomId,
        { language },
        { new: true }
    );

    if (!room) {
        throw new Error("Room not found");
    }

    // Invalidate cached room
    await redis.del(`room:${roomId}:full`);

    return room;
};