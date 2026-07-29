import { runCode } from "../services/compilerService.js";
import { saveExecution } from "../services/executionService.js";
import Room from "../models/roomModel.js";

export const runCodeController=async(req,res)=>{
    try{
        const {roomId,code,language,input}=req.body;
        const room = await Room.findById(roomId);

        if (!room) {
          throw new Error("Room not found");
        }

      const isMember =
         room.host.equals(req.user._id) ||
         room.participants.some(id => id.equals(req.user._id));

     if (!isMember) {
        return res.status(403).json({
          success: false,
          message: "Unauthorized"
     });
}

        const result=await runCode(code,language,input);
        
        const output=result.run?.output ||
                     result.stdout ||
                     result.stderr ||
                     result.compile_output ||
                     "No Output";

      await saveExecution( roomId,req.user._id,language,code,input,output);
        res.status(200).json({
            success:true,
            result,
        });
    }
    catch (error) {

      console.error(error);

      res.status(500).json({
        success: false,
        message:
          error.message,
      });

    }
};