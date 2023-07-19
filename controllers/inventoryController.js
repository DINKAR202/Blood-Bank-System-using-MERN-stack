const mongoose = require("mongoose");
const inventoryModel = require("../models/inventoryModel");
const userModel = require("../models/userModel");

// Create Inventory
const createInventoryController = async (req, res) => {
  try {
    const { email, inventoryType } = req.body;
    // validation
    const user = await userModel.findOne({ email });
    if (!user) {
      throw new Error("User not found");
    }
    // if (inventoryType === "in" && user.role !== "donar") {
    //   throw new Error("Not a donor account");
    // }
    // if (inventoryType === "out" && user.role !== "hospital") {
    //   throw new Error("Not a hospital");
    // }

    if(req.body.inventoryType =="out"){
      const requestedBloodGroup = req.body.bloodGroup
      const requestedQuantityOfBlood = req.body.quantity
      const organisation = new mongoose.Types.ObjectId(req.body.userId)
      // calculate Blood Quantity
      const totalInOfRequestedBlood = await inventoryModel.aggregate([
        {$match:{
          organisation,
          inventoryType:'in',
          bloodGroup:requestedBloodGroup
        }},{
          $group:{
            _id:'$bloodGroup',
            total:{$sum : '$quantity'}
          }
        }
      ])
      console.log('Total In', totalInOfRequestedBlood)
    }

    // save record
    // const inventory = new inventoryModel(req.body);
    // await inventory.save();
    return res.status(201).send({
      success: true,
      message: "New Blood record added",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Error in create Inventory API",
      error,
    });
  }
};

// GET ALL BLOOD RECORDS

const getInventoryController = async (req, res) => {
  try {

    const inventory = await inventoryModel.find({organisation:req.body.userId,
    })
    .populate('donar')
    .populate('hospital')
    .sort({ createdAt: -1 });
    return res.status(200).send({
      success: "true",
      message:"get all records successfully",
      inventory,
    });

  } catch (error) {
    console.log(error)
    return res.status(500).send({
      success: false,
      message:"Error in get all inventory",
      error
    });
    
  }

};

module.exports = { createInventoryController, getInventoryController };