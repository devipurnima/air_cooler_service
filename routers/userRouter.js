import express from 'express'
const router = express.Router();

import {createUser, updateUser, deleteSingleUser, getAllUsers, getSingleUser, deleteMultipleUsers, createUserByExcel} from "../controllers/userContoller.js";
import { requireSignIn } from '../middleware/authMiddleware.js';
import multer from 'multer';
import fs from "fs";

const storage = multer.diskStorage({
    destination:function(req,file,cb){
        const uploadDir = "uploads/users/";
        if(!fs.existsSync(uploadDir))
        {
            mkdirSync(uploadDir, {recursive:true});
        }
        cb(null, uploadDir)
    },
    filename:function(req,file,cb){
        const uniqfileName = new Date().toISOString();
        cb(null, `${uniqfileName}-${file.originalname}` );
    }
});

const upload = multer({storage:storage})

router.post("/user",requireSignIn,upload.single("profile"),createUser);
router.post("/create-many",requireSignIn, createUserByExcel);
router.put("/:id", requireSignIn, updateUser);
router.delete("/delete-many",requireSignIn, deleteMultipleUsers);
router.delete("/:id",requireSignIn, deleteSingleUser);
router.get("/:id",requireSignIn, getSingleUser);
router.get("/",requireSignIn, getAllUsers);
export default router;
