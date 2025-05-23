import mongoose, { Mongoose } from "mongoose";
const wareHouseSchema = new mongoose.Schema({
    name:{
        type:String,
        default:""
    },
    code:{
        type:String,
        default:""
    },
    location:{
        type:String,
        default:""
    },
    supervisor:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"users"
    },
    status:{
        type:String, 
        enum:["Active", "Inactive"],
        default:"Active"
    }
},
{
    timestamps:true
})

export default mongoose.model("warehouse", wareHouseSchema)