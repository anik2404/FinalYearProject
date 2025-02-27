const express=require("express");
const RecipieModel = require("../models/RecipieModel");
const recipieRouter=express.Router();
const authenticator=require("../middleware/authenticator")
const jwt=require('jsonwebtoken');

//recipieRouter.use(authenticator);

recipieRouter.get("/",(req,res)=>{
    res.send("All the notes")
})

recipieRouter.post("/likecount",async(req,res)=>{
    try {
        const { id,likes} = req.body;
        console.log(req.body)
        RecipieModel.findOne({idMeal:id})
        .then(
            async(saved_recipie)=>{
                if(saved_recipie)
                {
                    saved_recipie.likes += 1;
                    await saved_recipie.save();
                    console.log(saved_recipie.likes)
                    res.send({ message: "Recipe liked successfully", likes: saved_recipie.likes });
                }
                else
                {
                    console.log("Recipie Not Found")
                    const newrecipie=new RecipieModel({
                        id,likes
                    })
                    try{
                        await newrecipie.save();
                        //const token=jwt.sign({ _id:newrecipie._id }, process.env.JWT_SECRET)
                        //res.send(token)
                    }
                    catch(err){
                        return res.status(422).send({
                            error: err.message
                        });
                    }
                }
            }
        )
    } catch (error) {
        return res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
})

module.exports=recipieRouter