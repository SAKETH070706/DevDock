import Room from "../models/roomModel.js";
import redis from "../config/redis.js";

export const saveCode = async (roomId, code) => {
    const room = await Room.findByIdAndUpdate(
        roomId,
        { code },
        { returnDocument: "after" }
    );

    if (!room) {
        throw new Error("Room not found");
    }

    await redis.del(`room:${roomId}:full`);

    return room;
};