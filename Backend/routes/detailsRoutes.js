const express = require("express");
const RecipieModel = require("../models/RecipieModel");
const BookmarkModel=require("../models/BookmarkModel")
const UserModel=require("../models/UserModel")
const detailsRouter = express.Router();
const authenticator = require("../middleware/authenticator")
const jwt = require('jsonwebtoken');

detailsRouter.get("/", (req, res) => {
    res.send("All the recipies")
})

detailsRouter.post("/getdata", async (req, res) => {
    const { userid } = req.body;
    //console.log(req.body)
    if (!userid) {
        return res.status(422).json({
            error: "All fields required"
        });
    }
    try{
        const saved_user=await UserModel.findOne({_id:userid})
        const liked_recipies = await RecipieModel.find({ userid: { $elemMatch: { $eq: userid } } });
        const bookmarked_recipies = await BookmarkModel.find({ userid: { $elemMatch: { $eq: userid } } });
        console.log(saved_user)
        console.log(liked_recipies)
        console.log(bookmarked_recipies)
        const name=saved_user.name;
        res.send({
            saved_user,liked_recipies,bookmarked_recipies,name
        })
    }
    catch(err){
        console.log("error occured")
    }
})


module.exports=detailsRouter;