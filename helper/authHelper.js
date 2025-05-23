import bcrypt from "bcrypt";

export const hashPassword = async(password)=>{
    try
    {
        const saltRounds = 10;
        const hasedPassword = await bcrypt.hash(password,saltRounds);
        return hasedPassword
    }
    catch(error){
        console.log(error, "error while jashing tjhe password");
    }
}

export const comparepassword = async(hashedPassword, password)=>{
    return bcrypt.compare(hashedPassword, password);
}