const express=require("express");
const UploadModel = require("../models/UploadModel");
const uploadRouter=express.Router();
const authenticator=require("../middleware/authenticator")
const jwt=require('jsonwebtoken');

uploadRouter.use(authenticator);

uploadRouter.get("/",(req,res)=>{
    res.send("All the notes")
})


uploadRouter.post("/store",async(req,res)=>{
    const{title,avatar}=req.body;
    if(!title || !avatar )
    {
        return res.status(422).json({
            error: "All fields required"
        });
    }

    try {
        const newnote=new UploadModel(req.body)
        await newnote.save()
        const token=jwt.sign({ _id:newnote._id }, process.env.JWT_SECRET)
        return res.status(201).json({
            token
        });
    } catch (error) {
        return res.status(422).json({
            err: "Invalid credentials"
        });
    }
})

uploadRouter.post("/getuploads",async(req,res)=>{
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

module.exports=uploadRouter