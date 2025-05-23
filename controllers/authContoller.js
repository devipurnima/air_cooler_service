import { access } from "fs";
import {comparepassword, hashPassword} from "../helper/authHelper.js"
import jwt from "jsonwebtoken";
import userModel from "../model/userModel.js";
import roleModel from "../model/roleModel.js";

export const defaultUser = async(req,res)=>{
    try{
        console.log("🍏 inside default user");

        const countUser = await userModel.countDocuments();
        const countRole = await roleModel.countDocuments(); 
        console.log("🍿 countUser", countUser);

        if(countUser==0 && countRole==0)
        {
            const role = new roleModel({
                name:"admin",
                role_id:1
            });
            const newRole = await role.save();

            const hashedPassword = await hashPassword("9978009352")
            const user = new userModel({
                name:"admin",
                role:newRole?._id,
                address:"",
                mobile:"9978009352",
                password:hashedPassword,
                email:"yashkheni@gmail.com"
            })
            await user.save();
            console.log("User Created successfully.");
        }
        else{
            console.log("User already Created so skipping this point.");
        }
    }
    catch(error){
        console.log("error while creating default user", error.message);  
    }
}

export const login = async(req,res)=>{
    
    const {email,password} = req.body;

    const existingUser = await userModel.findOne({email:email});

    if(!existingUser)
    {
        return res.status(200).send({
            success:false,
            message:"Email not found",
            data:""
        })
    }
    const matchPassword = await comparepassword(password, existingUser?.password);

    if(!matchPassword)
    {
        return res.status(200).send({
            success:false,
            message:"Password mismatched"
        })
    }

    //access token 
    const access_token = jwt.sign({
        _id:existingUser._id,
        type:"user"
    },
    process.env.JWT_SECRET,
    {
        expiresIn:"3d"
    }
)

return res.status(200).send({
    success:true,
    message:"Login Successful",
    access_token:access_token,
    data:existingUser
})
}
