import express from "express";
import { createService } from "../controllers/serviceController.js";
import { requireSignIn } from "../middleware/authMiddleware.js";
const router = express.Router();

router.post("/service",requireSignIn, createService)

export default router;