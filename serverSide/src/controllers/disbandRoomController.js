import { disbandRoom } from "../services/roomService.js";
export const disbandRoomController = async (req, res) => {

    try {

        const roomId = req.params.roomId;

        const result = await disbandRoom(
            roomId,
            req.user._id
        );

        const io = req.app.get("io");

        io.to(roomId).emit(
            "room-disbanded"
        );

        res.status(200).json(result);

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};