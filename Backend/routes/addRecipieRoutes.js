const express = require("express");
const AddRecipieModel = require("../models/AddRecipieModel");
const addrecipieRouter = express.Router();
const authenticator = require("../middleware/authenticator")
const jwt = require('jsonwebtoken');

//addrecipieRouter.use(authenticator);

addrecipieRouter.get("/", (req, res) => {
    res.send("All the recipies")
})

addrecipieRouter.post("/add",async(req,res)=>{
    const{rname,region,instructions,avatar}=req.body;
    console.log(req.body)
    if(!rname||!region||!instructions || !avatar )
    {
        return res.status(422).json({
            error: "All fields required"
        });
    }
    try {
        const newrecipie=new AddRecipieModel(req.body)
        await newrecipie.save()
        const token=jwt.sign({ _id:newrecipie._id }, process.env.JWT_SECRET)
        return res.status(201).json({
            token
        });
    } catch (error) {
        return res.status(422).json({
            err: "Invalid credentials"
        });
    }
})

addrecipieRouter.post("/getuploads",async(req,res)=>{
    const{id}=req.body
    const saved_user=await UploadModel.find({userid:id})
    if(!saved_user)
    {
        return res.status(422).json({
            error: "Invalid credentials"
        });
    }
    try{
        return res.status(201).json({
            saved_user
        });
        
    }
    catch(err){
        return res.status(422).send({
            error: err.message
        });
    }
})

module.exports=addrecipieRouter