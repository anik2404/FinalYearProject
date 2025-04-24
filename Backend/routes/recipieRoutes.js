const express = require("express");
const RecipieModel = require("../models/RecipieModel");
const BookmarkModel=require("../models/BookmarkModel")
const recipieRouter = express.Router();
const authenticator = require("../middleware/authenticator")
const jwt = require('jsonwebtoken');

//recipieRouter.use(authenticator);

recipieRouter.get("/", (req, res) => {
    res.send("All the recipies")
})

recipieRouter.post("/likecount", async (req, res) => {
    try {
        const { idMeal, likes, isFavourite, userid } = req.body;
        //console.log(req.body)
        RecipieModel.findOne({ idMeal: idMeal })
            .then(
                async (saved_user) => {
                    if (!saved_user) {
                        //console.log("Recipie Not Found")
                        const newrecipie = new RecipieModel({
                            idMeal, likes, userid
                        })
                        //console.log(newrecipie)
                        try {
                            await newrecipie.save();
                            //console.log(newrecipie)
                            const token = jwt.sign({ _id: newrecipie._id }, process.env.JWT_SECRET)
                            res.send({ likes: newrecipie.likes })
                        }
                        catch (err) {
                            return res.status(422).send({
                                error: err.message
                            });
                        }
                    }
                    else {
                        const recipies = await RecipieModel.find({ userid: { $elemMatch: { $eq: userid } }, idMeal: idMeal });
                        //console.log(recipies)
                        if (recipies.length == 0) {
                            saved_user.likes = saved_user.likes + 1;
                            //console.log("recipie liked sucessfully");
                            await RecipieModel.findByIdAndUpdate(
                                saved_user._id,
                                { $push: { userid: userid } },
                                { new: true }
                            );
                            await saved_user.save();
                            res.send({ likes: saved_user.likes })
                        }
                        else {
                            await RecipieModel.findByIdAndUpdate(
                                saved_user._id,
                                { $pull: { userid: userid } },
                                { new: true }
                            );
                            saved_user.likes = saved_user.likes - 1;
                            await saved_user.save();
                            //console.log("Recipie disliked sucessfully")
                            res.send({ likes: saved_user.likes })
                        }
                    }
                }
            )
    } catch (error) {
        return res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
})

recipieRouter.post('/isLiked', async (req, res) => {
    const { idMeal, userid } = req.body;
    const recipies = await RecipieModel.find({ userid: { $elemMatch: { $eq: userid } }, idMeal: idMeal });
    if (recipies.length == 0) {
        res.send({
            isFavourite: false
        });
    }
    else {
        res.send({
            isFavourite: true
        });
    }
})

recipieRouter.post('/totallikes', async (req, res) => {
    const { idMeal } = req.body;
    const recipies = await RecipieModel.find({ idMeal: idMeal });
    if (recipies.length == 0) {
        res.send({
            likecount: 0
        });
    }
    else {
        res.send({
            likecount: recipies[0].likes
        });
    }
})

recipieRouter.post('/bookmark', async (req, res) => {
    try {
        const { idMeal, userid } = req.body;
        //console.log(req.body)
        BookmarkModel.findOne({ idMeal: idMeal })
            .then(
                async (saved_user) => {
                    if (!saved_user) {
                        //console.log("Recipie Not Found")
                        const newuser = new BookmarkModel({
                            idMeal, userid
                        })
                        //console.log(newrecipie)
                        try {
                            await newuser.save();
                            //console.log(newrecipie)
                            const token = jwt.sign({ _id: newrecipie._id }, process.env.JWT_SECRET)
                            res.send({ bookmarked: true })
                        }
                        catch (err) {
                            return res.status(422).send({
                                error: err.message
                            });
                        }
                    }
                    else {
                        const users = await BookmarkModel.find({ userid: { $elemMatch: { $eq: userid } }, idMeal: idMeal });
                        //console.log(recipies)
                        if (users.length == 0) {
                            //console.log("recipie liked sucessfully");
                            await BookmarkModel.findByIdAndUpdate(
                                saved_user._id,
                                { $push: { userid: userid } },
                                { new: true }
                            );
                            res.send({ bookmarked: true })
                        }
                        else {
                            await BookmarkModel.findByIdAndUpdate(
                                saved_user._id,
                                { $pull: { userid: userid } },
                                { new: true }
                            );
                            res.send({ bookmarked: false })
                        }
                    }
                }
            )
    } catch (error) {
        return res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
})

recipieRouter.post('/isBookmarked', async (req, res) => {
    const { idMeal, userid } = req.body;
    const users = await BookmarkModel.find({ userid: { $elemMatch: { $eq: userid } }, idMeal: idMeal });
    if (users.length == 0) {
        res.send({
            bookmarked: false
        });
    }
    else {
        res.send({
            bookmarked: true
        });
    }
})

module.exports = recipieRouter