import userModel from "../model/userModel.js";
import wareHouseModel from "../model/wareHouseModel.js";
import {v4 as uuidv4} from "uuid";

const generateWareHouseCode = ()=> `WareHouse_${uuidv4()}`

export const createWareHouse = async(req,res)=>{
    try
    {
    const {name, location, supervisor, status} = req.body;

    const supervisorId = await userModel.findById(supervisor);
    if(!supervisorId)
    {
        return res.status(200).send({
            success:false,
            message:"contact person not found",
            data:{}
        })
    }
    const newWareHouse = new wareHouseModel({
        code:generateWareHouseCode(),
        name, location, supervisor, status
    });
    await newWareHouse.save();
    
    return res.status(200).send({
            success:true,
            message:"WareHouse Created successfully",
            data:newWareHouse
        })
    }
    catch(error){
         return res.status(500).send({
            success:false,
            message:error.message,
        })
    }
} 

export const editWarehouse = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, location, supervisor, status } = req.body;

    const supervisorExists = await userModel.findById(supervisor);
    if (!supervisorExists) {
      return res.status(200).send({
        success: false,
        message: "Supervisor not found",
        data: {},
      });
    }

    const updatedWarehouse = await wareHouseModel.findByIdAndUpdate(
      id,
      { name, location, supervisor, status },
      { new: true }
    ).populate("supervisor", "name email");

    if (!updatedWarehouse) {
      return res.status(404).send({
        success: false,
        message: "Warehouse not found",
        data: {},
      });
    }

    return res.status(200).send({
      success: true,
      message: "Warehouse updated successfully",
      data: updatedWarehouse,
    });
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: error.message,
    });
  }
};

export const getAllWarehouses = async (req, res) => {
  try {
    const warehouses = await wareHouseModel.find().populate("supervisor", "name email");
    return res.status(200).send({
      success: true,
      message: "All warehouses fetched successfully",
      data: warehouses,
    });
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: error.message,
    });
  }
};

export const getWarehouseById = async (req, res) => {
  try {
    const { id } = req.params;
    const warehouse = await wareHouseModel.findById(id).populate("supervisor", "name email");
    if (!warehouse) {
      return res.status(404).send({
        success: false,
        message: "Warehouse not found",
        data: {},
      });
    }
    return res.status(200).send({
      success: true,
      message: "Warehouse fetched successfully",
      data: warehouse,
    });
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: error.message,
    });
  }
};

export const deleteWarehouse = async (req, res) => {
  try {
    const { id } = req.params;
    const activateWareHouse = await wareHouseModel.findById(id);
    if (!activateWareHouse) {
      return res.status(404).send({
        success: false,
        message: "Warehouse not found",
        data: {},
      });
    }
    activateWareHouse.status="Inactive"
    await activateWareHouse.save();

    return res.status(200).send({
      success: true,
      message: "Warehouse deactivated successfully",
      data: activateWareHouse,
    });
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: error.message,
    });
  }
};


