const express=require("express");
const NoteModel = require("../models/NoteModel");
const noteRouter=express.Router();
const authenticator=require("../middleware/authenticator")
const jwt=require('jsonwebtoken');

noteRouter.use(authenticator);

noteRouter.get("/",(req,res)=>{
    res.send("All the notes")
})

noteRouter.post("/create",async(req,res)=>{
    const{title,body}=req.body;
    if(!title || !body )
    {
        return res.status(422).json({
            error: "All fields required"
        });
    }
    try {
        const newnote=new NoteModel(req.body)
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
noteRouter.post("/getnotes",async(req,res)=>{
    const{id}=req.body
    const saved_user=await NoteModel.find({userid:id})
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

noteRouter.post('/update',async(req,res)=>{
    const{title,body,id}=req.body;
    if(!title || !body)
    {
        return res.status(422).json({
            error: "All fields required"
        });
    }
    const saved_user=await NoteModel.findOne({_id:id})
    if(!saved_user)
    {
        return res.status(422).json({
            error: "Invalid credentials"
        });
    }
    else
    {   
        const updatedtitle = await NoteModel.findByIdAndUpdate(id, { title : title }, { new: true });
        const updatedbody = await NoteModel.findByIdAndUpdate(id, { body : body }, { new: true });
        res.send({ updatedtitle });
    }
})


noteRouter.post('/delete',async(req,res)=>{
    const{id}=req.body;
    const saved_user=await NoteModel.findOne({_id:id})
    if(!saved_user)
    {
        return res.status(422).json({
            error: "Invalid credentials"
        });
    }
    else
    {   
        const updatedtitle = await NoteModel.findByIdAndDelete({ _id : id })
        res.send({ updatedtitle });
    }
})

module.exports=noteRouter