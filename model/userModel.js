import mongoose from "mongoose"
import { deflate } from "zlib";
const userSchema = new mongoose.Schema({
    name:{
        type:String,
        default:""
    },
    role:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"userRole",
        default:null
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        default:""
    },
    address:{
        type:String,
        default:""
    },
    mobile:{
        type:String,
        default:""
    },
    profile:{
        type:String,
        default:null
    },
    isArchived: {
      type: Boolean,
      default: false,
    },
},
{
    timestamps:true
}) 
export default mongoose.model("users",userSchema);