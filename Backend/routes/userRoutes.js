const express=require("express");
const UserModel = require("../models/UserModel");
const bcrypt=require("bcrypt")
const userRouter=express.Router();
const jwt=require('jsonwebtoken');


userRouter.get("/",async(req,res)=>{
    res.send("all the users");
})

userRouter.post('/register',async(req,res)=>{
    const { name,email,password,dob,grade }=req.body;
    if(!email || !name || !password|| !dob || !grade)
    {
        return res.status(422).send({
            error: "All fields required"
        });
    }
    UserModel.findOne({email:email})
    .then(
        async(saved_user)=>{
            if(saved_user)
            {
                return res.status(422).send({
                    error: "already exist data"
                })
            }
            const user1=new UserModel({
                name,email,password,grade,dob
            })
            try{
                await user1.save();
                p=user1._id;
                const token=jwt.sign({ _id:user1._id }, process.env.JWT_SECRET)
                res.send({
                    tokenizer:{token},
                    uid:{p}
                })
            }
            catch(err){
                return res.status(422).send({
                    error: err.message
                });
            }
        }
    )
    
})

userRouter.post("/login",async(req,res)=>{
    const{email,password}=req.body;
    if(!email || !password )
    {
        return res.status(422).json({
            error: "All fields required"
        });
    }
    const saved_user=await UserModel.findOne({email:email})
    if(!saved_user)
    {
        return res.status(422).json({
            error: "Invalid credentials"
        });
    }
    try{
        bcrypt.compare(password,saved_user.password,(err,result)=>{
            if(result){
                const token=jwt.sign({ _id:saved_user._id }, process.env.JWT_SECRET)
                q=saved_user._id
                res.send({
                    tokenizer:{token},
                    uid:{q}
                })
            }

            
	        else{
                console.log("Password not matched");
                return res.status(422).json({
                    error: "Invalid password"
                });
		    }
        })

    }
    catch(err){
        return res.status(422).send({
            error: err.message
        });
    }
})
userRouter.post('/forgotpass',async(req,res)=>{
    const{reemail}=req.body;
    if(!reemail)
    {
        return res.status(422).json({
            error: "All fields required"
        });
    }
    const saved_user=await UserModel.findOne({email:reemail})
    if(!saved_user)
    {
        return res.status(422).json({
            error: "Invalid credentials"
        });
    }
    else
    {
        p=saved_user._id
        res.send({ p});
    }
})
userRouter.post('/resetpass',async(req,res)=>{
    const{newpsswd,connewpsswd,uid}=req.body;
    if(!newpsswd || !connewpsswd)
    {
        return res.status(422).json({
            error: "All fields required"
        });
    }
    const saved_user=await UserModel.findOne({_id:uid})
    if(!saved_user)
    {
        return res.status(422).json({
            error: "Invalid credentials"
        });
    }
    else
    {   
        npsswd=await bcrypt.hash(newpsswd,10);
        const updatedDoc = await UserModel.findByIdAndUpdate(uid, { password : npsswd }, { new: true });
        const token=jwt.sign({ _id:saved_user._id }, process.env.JWT_SECRET)
        res.send({ updatedDoc });
    }
})



module.exports=userRouter
