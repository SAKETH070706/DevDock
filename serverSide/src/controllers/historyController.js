import { getRoomHistory } from "../services/historyService.js";

export const getHistoryController=async(req,res)=>{
    try{
        const history=await getRoomHistory(req.params.roomId);

         res.status(200).json({
            success: true,
            history
        });
    }catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};