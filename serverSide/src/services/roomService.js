import Room from "../models/roomModel.js";
import redis from "../config/redis.js";
import { generateRoomCode } from "../utils/generateRoomCode.js";

const INVITE_CODE_EXPIRY = 10 * 60;

// Cache settings
const ROOM_CACHE_EXPIRY = 30;

const getRoomCacheKey = (roomId) => {
    return `room:${roomId}:full`;
};

export const createRoom = async (roomName, language, hostId) => {
    let inviteCode;

    do {
        inviteCode = generateRoomCode();
    } while (await redis.exists(`room:${inviteCode}`));

    const room = await Room.create({
        roomName,
        host: hostId,
        participants: [hostId],
        language,
        inviteCode
    });

    await redis.setex(
        `room:${inviteCode}`,
        INVITE_CODE_EXPIRY,
        room._id.toString()
    );

    console.log("Stored:", await redis.get(`room:${inviteCode}`));

    return {
        room,
        inviteCode
    };
};


export const joinRoom = async (inviteCode, userId) => {

    const roomId = await redis.get(`room:${inviteCode}`);

    if (!roomId) {
        throw new Error("Invite code expired or invalid");
    }

    const room = await Room.findById(roomId);

    if (!room || !room.isActive) {
        throw new Error("Room not found");
    }

    const alreadyJoined = room.participants.some(
        (participant) =>
            participant.toString() === userId.toString()
    );

    if (!alreadyJoined) {
        room.participants.push(userId);
        await room.save();

        // Invalidate cached populated room
        await redis.del(getRoomCacheKey(roomId));
    }

    return room;
};


export const getRoomById = async (roomId, userId) => {

    const cacheKey = getRoomCacheKey(roomId);

    // ------------------------------------------------
    // 1. CHECK REDIS CACHE
    // ------------------------------------------------

    const cachedRoom = await redis.get(cacheKey);

    if (cachedRoom) {

        console.log("[CACHE] ROOM HIT");

        const room = JSON.parse(cachedRoom);

        // Convert IDs back to strings for authorization
        const isMember =
            room.host._id.toString() === userId.toString() ||
            room.participants.some(
                (p) => p._id.toString() === userId.toString()
            );

        if (!isMember) {
            throw new Error("Unauthorized");
        }

        return room;
    }

    console.log("[CACHE] ROOM MISS");

    // ------------------------------------------------
    // 2. CACHE MISS → MONGODB
    // ------------------------------------------------

    const _t0 = process.hrtime.bigint();

    const room = await Room.findById(roomId)
        .populate("host", "username email")
        .populate("participants", "username email");

    const _t1 = process.hrtime.bigint();

    console.log(
        `[BENCH] Room query + populate: ${
            Number(_t1 - _t0) / 1e6
        } ms`
    );

    if (!room) {
        throw new Error("Room not found");
    }

    // ------------------------------------------------
    // 3. AUTHORIZATION
    // ------------------------------------------------

    const isMember =
        room.host._id.equals(userId) ||
        room.participants.some(
            (p) => p._id.equals(userId)
        );

    if (!isMember) {
        throw new Error("Unauthorized");
    }

    // ------------------------------------------------
    // 4. STORE IN REDIS
    // ------------------------------------------------

    await redis.setex(
        cacheKey,
        ROOM_CACHE_EXPIRY,
        JSON.stringify(room)
    );

    console.log("[CACHE] ROOM STORED");

    return room;
};


export const disbandRoom = async (roomId, userId) => {

    const room = await Room.findById(roomId);

    if (!room) {
        throw new Error("Room not found");
    }

    if (room.host.toString() !== userId.toString()) {
        throw new Error("Only host can disband room");
    }

    // Remove invite-code cache
    await redis.del(`room:${room.inviteCode}`);

    // Remove online users
    await redis.del(`room:${roomId}:users`);

    // Remove populated room cache
    await redis.del(getRoomCacheKey(roomId));

    await Room.findByIdAndDelete(roomId);

    return {
        success: true,
        message: "Room disbanded succesfully"
    };
};


export const leaveRoom = async (roomId, userId) => {

    const room = await Room.findById(roomId);

    if (!room) {
        throw new Error("Room not Found");
    }

    const participantIndex = room.participants.findIndex(
        participant =>
            participant.toString() === userId.toString()
    );

    if (participantIndex === -1) {
        throw new Error("User is not in this room");
    }

    room.participants.splice(participantIndex, 1);

    if (room.host.toString() === userId.toString()) {

        if (room.participants.length > 0) {
            room.host = room.participants[0];
        }
        else {
            room.isActive = false;
        }
    }

    await room.save();

    // Invalidate populated room cache
    await redis.del(getRoomCacheKey(roomId));

    return room;
};