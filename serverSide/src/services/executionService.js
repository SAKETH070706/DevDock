import Execution from "../models/Execution.js";

export const saveExecution =async(roomId,useImperativeHandle,language,code,input,output)=>{
    return await Execution.create({
        room: roomId,
        user: useImperativeHandle,
        language,
        code,
        input,
        output
    });
};

