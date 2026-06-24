import { updateLanguage } from "../services/languageService.js";

export const updateLanguageController =async(req,res)=>{
    try{
           const { roomId }= req.params;

           const {language}=req.body;

           const room=await updateLanguage(roomId,language);
            res.status(200).json({
            success:true,
            room
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