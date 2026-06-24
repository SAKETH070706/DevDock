import mongoose from "mongoose";

const executionSchema=new mongoose.Schema({
    room:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Room"
    },
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    language:String,

    code:String,

    input:String,

    output:String
},
{
    timestamps:true
}
);

export default mongoose.model("Execution",executionSchema);
