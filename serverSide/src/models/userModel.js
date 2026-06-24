import mongoose from "mongoose";

const UserSchema=mongoose.Schema({
   username:{
        type:String,
        required:true,
        unique:true,
        trim:true
   },
    email:{
        type:String,
        required:true,
        unique:true,
        lowercase:true,
        trim:true
    },
    
    contact:{
        type:Number,
        required:true,
    trim:true
    },
    password:{
        type:String,
        required:true,
        minlength:6
    },

},
{timestamps:true}
)
const User=mongoose.model("User",UserSchema);
export default User;