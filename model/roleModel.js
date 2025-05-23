import mongoose from "mongoose";
const roleSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    role_id:{
        type:Number,
        required:true,
        unique:true
    }
},
{
    timestamps:true
})
export default mongoose.model("userRole", roleSchema);