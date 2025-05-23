import express from "express";
import { createRole , editRole, getRoleById, deleteRole, getAllRoles} from "../controllers/roleController.js";
import { requireSignIn } from "../middleware/authMiddleware.js";
const router = express.Router();

router.post("/role",requireSignIn, createRole)
router.put("/:id",requireSignIn, editRole);
router.delete("/:id",requireSignIn,  deleteRole);
router.get("/:id", requireSignIn, getRoleById);
router.get("/", requireSignIn, getAllRoles);

export default router;