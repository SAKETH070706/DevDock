import { updateLanguage } from "../services/languageService.js";
import Room from "../models/roomModel.js";

export const updateLanguageController =async(req,res)=>{
    try{
           const { roomId }= req.params;

           const {language}=req.body;
           
           const room = await Room.findById(roomId);
                  if (!room) {
                    return res.status(404).json({
                     success: false,
                     message: "Room not found",
                  });
                 }
            if (room.host.toString() !== req.user._id.toString()) {
              return res.status(403).json({
              success: false,
              message: "Only the host can change the language.",
           });
           }

           const updatedRoom=await updateLanguage(roomId,language);
            res.status(200).json({
            success:true,
            updatedRoom
        });

    }
    catch(error)
    {
        res.status(500).json({
            success:false,
            message:error.message
        });
    }
};