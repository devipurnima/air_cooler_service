import siteModel from "../model/siteModel.js";
import { v4 as uuidv4 } from 'uuid';
import userModel from "../model/userModel.js";

const generateSiteId = () => `SITE_${uuidv4()}`;


export const createSite = async(req,res)=>{
    try
    {
    const {siteName, address, contactPerson, contactNumber, status} = req.body;

    const contectPersonId = await userModel.findById(contactPerson);
    if(!contectPersonId)
    {
        return res.status(200).send({
            success:false,
            message:"contact person not found",
            data:{}
        })
    }
    const newSite = new siteModel({
        siteId:generateSiteId(),
        siteName, address, contactPerson, contactNumber, status
    });
    await newSite.save();
    
    return res.status(200).send({
            success:true,
            message:"Site Created successfully",
            data:newSite
        })
    }
    catch(error){
         return res.status(500).send({
            success:false,
            message:error.message,
        })
    }
}

export const updateSite = async(req,res)=>{
   try
    {
        const {address, contactNumber} = req.body;
        const {id} = req.params;
        const updatedSite = await siteModel.findByIdAndUpdate(id,{address, contactNumber},{new:true});
        if(!updatedSite){
            return res.status(200).send({
                success:false,
                message:"site not found",
                data:{}
            })
        }

        return res.status(200).send({
                success:false,
                message:"site updated successfully",
                data:updatedSite
            })
    }
    catch(error){
         return res.status(500).send({
            success:false,
            message:error.message,
        })
    }
}

export const deactivateSite = async (req, res) => {
  try {
    const { id } = req.params;

    const sitedata = await siteModel.findById(id);

    if (!sitedata) {
      return res.status(404).send({
        success: false,
        message: "site not found."
      });
    }
    sitedata.status = "Inactive";
    await sitedata.save(); 

    return res.status(200).send({
      success: true,
      message: "Site deactivated successfully",
      data: sitedata
    });
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: "Error deactivating role",
      error: error.message
    });
  }
};

export const getAllSites = async(req,res)=>{
    try
    {
        const {status, startDate, endDate, search} = req.query;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page-1)*limit;
        const filter = {};
        if(status){
            filter.status=status
        }

        if(startDate && endDate )
        {
            const parsedStartDate = new Date(startDate);
            const parsedEndDate = new Date(endDate);
            parsedEndDate.setHours(23, 59, 59, 999);
            filter.createdAt={
                $gte:parsedStartDate,
                $lte:parsedEndDate
            }
        }
        if(search){
            const serachData = new RegExp(search,"i");
            filter.$or=[
                {siteName:serachData},
                {address:serachData}
            ]
        }
        const count = await siteModel.countDocuments();
        const totalPage = Math.ceil(count/limit);
        const siteData = await siteModel.find(filter).skip(skip).limit(limit).populate("contactPerson", "name email");

        if(siteData.length==0)
        {
             return res.status(200).send({
            success: false,
            message: "site not found",
            data:[]
            });
        }
        return res.status(200).send({
            success: false,
            message: "Successfully fetched sites.",
            data:siteData,
            currentPage:page,
            totalPage:totalPage,
            totalEntries:count
            });
    }
    catch (error) {
    return res.status(500).send({
      success: false,
      message: "Error deleting role",
      error: error.message
    });
  }
}

export const getSingleSite = async(req,res)=>{
    try {
    const {id} = req.params;
    const site = await siteModel.findById(id).populate("contactPerson","name email"); // exclude password for security

    if(!site)
    {
        return res.status(200).send({
        success: true,
        message: "site not found",
        data: {},
        });
    }
    return res.status(200).send({
      success: true,
      message: "site fetched successfully",
      data: site,
    });
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: "Error fetching site",
      error: error.message,
    });
  }
}