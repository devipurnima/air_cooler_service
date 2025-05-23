import roleModel from "../model/roleModel.js";

export const createRole = async(req,res)=>{
    try{
        const {name, role_id} = req.body;
    
        if(!name)
        {
            return res.status(200).send({
                success:false,
                message:"Role name is required",
                data:{}
            });
        }
        if(!role_id)
        {
            return res.status(200).send({
                success:false,
                message:"role id is required",
                data:{}
            });
        }
        const existingRole = await roleModel.findOne({role_id:role_id});
        if(existingRole)
        {
            return res.status(200).send({
                success:false,
                message:"Role already exist",
                data:{}
            });
        }
        const role = new roleModel({
            name,role_id
        });
        const newRole = await role.save();
        
        return res.status(200).send({
            success:true,
            message:"role is created successfully",
            data:newRole
        });
    }
    catch(error){
        return res.status(500).send({
            success:false,
            message:error.message,
        });
    }
}
export const editRole = async(req,res)=>{
    try{
        const {id} = req.params;

        const {name, role_id} = req.body;

        // const existingRole = await roleModel.findOne({role_id:role_id});
        const existingRole = await roleModel.findOne({ role_id: role_id, _id: { $ne: id } });


        if(existingRole)
        {
            return res.status(200).send({
            success:false,
            message:"role already exist.",
            data:{}
        });
        }
        const updatedRole = await roleModel.findOneAndUpdate({_id:id},{name, role_id}, {new:true});
       if(!updatedRole)
       {
            return res.status(200).send({
            success:false,
            message:"role not found use different id.",
            data:{}
        });
       }
       return res.status(200).send({
            success:false,
            message:"role updated successfully.",
            data:updatedRole
        });
    }
   catch(error){
        return res.status(500).send({
            success:false,
            message:error.message,
        });
    }
}

export const getAllRoles = async (req, res) => {
  try {
    const roles = await roleModel.find();

    return res.status(200).send({
      success: true,
      message: "Roles fetched successfully",
      data: roles
    });
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: "Error fetching roles",
      error: error.message
    });
  }
};

export const getRoleById = async (req, res) => {
  try {
    const { id } = req.params;

    const role = await roleModel.findById(id);

    if (!role) {
      return res.status(404).send({
        success: false,
        message: "Role not found"
      });
    }

    return res.status(200).send({
      success: true,
      message: "Role fetched successfully",
      data: role
    });
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: "Error fetching role",
      error: error.message
    });
  }
};

export const deleteRole = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedRole = await roleModel.findByIdAndDelete(id);

    if (!deletedRole) {
      return res.status(404).send({
        success: false,
        message: "Role not found or already deleted"
      });
    }

    return res.status(200).send({
      success: true,
      message: "Role deleted successfully",
      data: deletedRole
    });
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: "Error deleting role",
      error: error.message
    });
  }
};
