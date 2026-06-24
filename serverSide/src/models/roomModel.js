import mongoose from "mongoose";

const roomSchema = new mongoose.Schema({
    roomName:{
        type: String,
        required: true,
        trim: true
    },
    inviteCode: {
       type: String,
       default: null
    },
    host:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    participants:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"User"
        }
    ],
    language:{
        type:String,
        enum:[
            "cpp",
            "c",
            "java",
            "python",
            "javascript"
        ],
        default:"cpp"
    },
    code: {
        type: String,
        default: ""
    },
    isActive: {
            type: Boolean,
            default: true
        }
},
{
    timestamps:true
}
);

const Room =mongoose.model(
    "Room",
    roomSchema
);

export default Room;