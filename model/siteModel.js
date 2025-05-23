import mongoose, { Mongoose } from "mongoose";
const siteSchema = new mongoose.Schema({
    siteId:{
        type:String,
        unique:true
    },
    siteName:{
        type:String,
        default:""
    },
    address:{
        type:String,
        default:""
    },
    contactPerson:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"users",
        default:null
    },
    contactNumber:{
        type:String,
        default:""
    },
    status:{
        type:String,
        enum: ["Active", "Inactive"],
        default:"Active"
    }
},
{
    timestamps:true
})
export default mongoose.model("siteDetail",siteSchema)