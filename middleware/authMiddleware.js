import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import userModel from "../model/userModel.js";
import roleModel from "../model/roleModel.js";

dotenv.config();

export const requireSignIn = async (req, res, next) => {
try {
    // Decode the jwt token
    const decode = jwt.verify(
      req.headers.authorization,
      process.env.JWT_SECRET
    );
    req.user = decode;

    let user = await userModel.findById(req.user._id);
    // If no user is found in any model
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found",
      });
    }

    // If all checks pass, proceed to the next middleware
    next();
  } catch (error) {
    console.error("Authentication error:", error);
    res.status(401).json({
      success: false,
      message: "Authentication failed",
      error:error.message
    });
  }
};

export const isAdmin = async (req, res, next) => {
  try {
    // Decode the jwt token
    const decode = jwt.verify(
      req.headers.authorization,
      process.env.JWT_SECRET
    );
    req.user = decode;

    let user = await userModel.findById(req.user._id);
    // If no user is found in any model
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found",
      });
    }

    const userRole = await roleModel.findById(user?.role);
    if(userRole && userRole?.role_id!==1)
    {
      return res.status(401).json({
        success: false,
        message: "Unauthorized access.",
      });
    }
    // If all checks pass, proceed to the next middleware
    next();
  } catch (error) {
    console.error("Authentication error:", error);
    res.status(401).json({
      success: false,
      message: "Authentication failed",
      error:error.message
    });
  }

};