import express from "express";
import {createSite , updateSite , deactivateSite, getAllSites,getSingleSite} from "../controllers/siteController.js"
import { requireSignIn } from "../middleware/authMiddleware.js";

const router = express.Router();
router.post("/site", requireSignIn, createSite);
router.put("/:id",requireSignIn, updateSite);
router.delete("/:id", requireSignIn, deactivateSite);
router.get("/:id",requireSignIn, getSingleSite)
router.get("/",requireSignIn, getAllSites)
export default router;