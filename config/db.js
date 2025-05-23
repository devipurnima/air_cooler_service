// db.js

import mongoose from "mongoose";
const connectDb = async()=>{
    try{
        const connection = await mongoose.connect(process.env.MONGO_URL,
            { serverSelectionTimeoutMS: 60000}
        );
        console.log("Mongodb connected", process.env.PORT)
    }
    catch(error){
        console.error(error, "Error while mongoose connecting")
    }
}

export default connectDb;