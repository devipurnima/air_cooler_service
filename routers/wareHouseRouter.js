import express from "express";
import { requireSignIn } from "../middleware/authMiddleware.js";
import {createWareHouse, getAllWarehouses, getWarehouseById, deleteWarehouse, editWarehouse} from "../controllers/wareHousecontroller.js";
const router = express.Router();
router.post("/warehouse",requireSignIn, createWareHouse);
router.put("/:id", editWarehouse);
router.delete("/:id", deleteWarehouse);
router.get("/:id", getWarehouseById);
router.get("/", getAllWarehouses);

export default router;