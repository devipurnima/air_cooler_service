import roleModel from "../model/roleModel.js";
import { hashPassword } from "../helper/authHelper.js";
import userModel from "../model/userModel.js";

export const createUser = async(req,res)=>{
   try{ 
    const {name,role, email, password, mobile, address} = req.body;
    const { profile } = req.file;

   if(!email)
    {
        return res.status(200).send({
            success:false,
            message:"email is required",
            data:{}
        });
    }
    const existingUser = await userModel.findOne({email:email});
    console.log("🦀 existingUser", existingUser);

    if(existingUser)
    {    return res.status(200).send({
            success:false,
            message:"email already exist",
            data:{}
        });
    }

    const checkRole = await roleModel.findById(role);
    if(!checkRole)
    {
      return res.status(200).send({
            success:false,
            message:"Role id not found",
            data:{}
        });
    }
    const hasedPassword = await hashPassword(password)
    const user = new userModel({
        name,role, email, password:hasedPassword, mobile, address,
        profile: profile ? profile.filename : null,
    });
    const newUser = await user.save();
    return res.status(200).send({
            success:true,
            message:"user created successfully",
            data:newUser
        });
}
catch(error)
{
    return res.status(200).send({
        success:false,
        message:error.message,
        data:{}
    });
}
}

export const createUserByExcel = async (req, res) => {
  try {
    const excelData = req.body.excelData;
    console.log("🔮 excelData", excelData);
  
    if (!excelData || !Array.isArray(excelData)) {
      return res
        .status(400)
        .send({ success: false, message: "Invalid data format" });
    }

    const emails = excelData.map((data) => data.email);
    const keySelector = (obj) => obj.email;
    if (!hasUniqueElements(excelData, keySelector)) {
      return res
        .status(400)
        .send({ success: false, message: "Email should be different" });
    }

    const existingEmails = await userModel.find(
      { email: { $in: emails } },
      { email: 1 }
    );

    if (existingEmails.length > 0) {
      const existingEmailsList = existingEmails.map((e) => e.email);
      return res.status(400).send({
        success: false,
        message: "Email(s) already exist",
        emails: existingEmailsList,
      });
    }

    const result = await userModel.insertMany(excelData);

    return res.status(200).send({
      success: true,
      message: "Data successfully inserted",
      data:result
    });
  } catch (error) {
    return res.status(500).send({ success: false, message: "Error creating user",error:error.message });
  }
};

export const updateUser = async (req, res) => {
  try {
    const { name,role, email, address, mobile, password } = req.body;
    const { id } = req.params;

    const existingUser = await userModel.findById(id);
    if (!existingUser) {
      return res.status(404).send({
        success: false,
        message: "User not found",
      });
    }

    // Check for email conflict (if changed)
    if (email !== existingUser.email) {
      const existingEmail = await userModel.findOne({ email });
      if (existingEmail) {
        return res.status(400).send({
          success: false,
          message: "Email already exists",
        });
      }
    }

    const hashedPassword = await hashPassword(password);

    const updatedUser = await userModel.findByIdAndUpdate(
      id,
      {
        name,
        role,
        email,
        address,
        mobile,
        password: hashedPassword,
      },
      { new: true }
    );

    return res.status(200).send({
      success: true,
      message: "User updated successfully",
      data: updatedUser,
    });
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: "error updating user",
      error:error.message
    });
  }
};

export const deleteSingleUser = async (req, res) => {
  try {
    const { id } = req.params;

    const existingUser = await userModel.findById(id);
    if (!existingUser) {
      return res.status(404).send({
        success: false,
        message: "User not found",
      });
    }

    await userModel.findByIdAndDelete(id);

    return res.status(200).send({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: "Error deleting user",
      error: error.message,
    });
  }
};

export const softDelete= async(req,res)=>{
  try {
    const { id } = req.params;

    // res.send(id);
    const user = await userModel.findById(id);
    // Check if the user was found
    if (!user) {
      return res
        .status(404)
        .send({ success: false, message: "user not found" });
    }

    // Toggle isArchived
    user.isArchived = !user.isArchived;

    // Save the changes
    await user.save();

  
    // Respond with a success message
    res.status(200).send({
      success: true,
      message: `user ${
        user.isArchived ? "archived" : "unarchived"
      } successfully`,
    });
  } catch (error) {
    res.status(500).send({ success: false, message:"error deleting user",
      error: error.message 
    });
  }
}

export const getSingleUser = async(req,res)=>{
    try {
    const {id} = req.params;
    const user = await userModel.findById(id).select("-password"); // exclude password for security

    if(!user)
    {
        return res.status(200).send({
      success: true,
      message: "User not found",
      data: {},
    });
    }
    return res.status(200).send({
      success: true,
      message: "User fetched successfully",
      data: user,
    });
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: "Error fetching user",
      error: error.message,
    });
  }
}

export const getAllUsers = async (req, res) => {
  try {
    const {startDate, endDate, search, isArchived} = req.query; 

    // Pagination parameters
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 5;
    const skip = (page - 1) * limit;

    const filter = {};

    if (startDate && endDate) {
      const parsedStartDate = new Date(startDate);
      const parsedEndDate = new Date(endDate);
      parsedEndDate.setHours(23, 59, 59, 999); // Include end of the day
      filter.createdAt = {
        $gte: parsedStartDate,
        $lte: parsedEndDate,
      };
    }
    if (search) {
      const searchRegex = new RegExp(search, "i");
       filter.$or = [
        { name: searchRegex },
        { email: searchRegex }
      ];
    }
    filter.isArchived = isArchived;

    const users = await userModel.find(filter).skip(skip)
      .limit(limit).select("-password"); // exclude password for security

    const count = await userModel.countDocuments(filter);
    const totalPages = Math.ceil(count / limit);

    return res.status(200).send({
      success: true,
      message: "Users fetched successfully",
      data: users,
      currentPage: page,
      totalPages,
      totalEntries: count,
    });
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: "Error fetching users",
      error: error.message,
    });
  }
};

export const deleteMultipleUsers = async (req, res) => {
  try {
    const { ids } = req.body;

    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).send({
        success: false,
        message: "Please provide an array of user IDs to delete.",
      });
    }

    const result = await userModel.deleteMany({ _id: { $in: ids } });

    return res.status(200).send({
      success: true,
      message: `${result.deletedCount} user(s) deleted successfully.`,
    });
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: "Error deleting users",
      error: error.message,
    });
  }
};

// helper functions for storing excel data

function hasUniqueElements(array, keySelector) {
  const keys = new Set();

  for (const item of array) {
    const key = keySelector(item);
    if (keys.has(key)) {
      return false;
    }
    keys.add(key);
  }

  return true;
}