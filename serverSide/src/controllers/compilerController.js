import { runCode } from "../services/compilerService.js";
import { saveExecution } from "../services/executionService.js";

export const runCodeController=async(req,res)=>{
    try{
        const {roomId,code,language,input}=req.body;

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