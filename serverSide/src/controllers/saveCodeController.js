import { saveCode } from "../services/codeService.js"; 

export const saveCodeController=async(req,res)=>{
    try{
        const {roomId}=req.params;
        const {code}=req.body;
        const room=await saveCode(roomId,code);

        res.status(200).json({success:true,room});
    }
    catch(error)
    {
        res.status(400).json({success:false,message:error.message});
    }
};