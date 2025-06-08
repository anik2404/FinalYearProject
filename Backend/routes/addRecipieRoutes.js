const express = require("express");
const AddRecipieModel = require("../models/AddRecipieModel");
const addrecipieRouter = express.Router();
const { initializeApp } = require('firebase/app');
const { getStorage, ref, uploadBytes, getDownloadURL, listAll } = require('firebase/storage');
const authenticator = require("../middleware/authenticator")
const jwt = require('jsonwebtoken');
const { GoogleGenerativeAI } = require("@google/generative-ai");
const axios = require('axios');
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const admin = require('../firebase_config')

const bucket = admin.storage().bucket();
// Load Gemini API key from environment variables
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

function getRandomInt(min, max) {
    // Inclusive of min and max
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

const firebaseConfig = {
    apiKey: "AIzaSyC6emty5b5f-CR6wI4hY8C3gwJbiULrQE0",
    authDomain: "recipieapp-b2b36.firebaseapp.com",
    projectId: "recipieapp-b2b36",
    storageBucket: "recipieapp-b2b36.appspot.com",
    messagingSenderId: "445795859461",
    appId: "1:445795859461:web:4234629cc6e47810f1306c",
    measurementId: "G-DWGXEWKQFX"
};

const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

async function downloadImageFromFirebase(url) {
    try {
        const response = await axios({
            method: 'GET',
            url: url,
            responseType: 'arraybuffer',
            timeout: 30000 // 30 second timeout
        });
        return Buffer.from(response.data);
    } catch (error) {
        console.error(`Failed to download image from ${url}:`, error.message);
        throw new Error(`Failed to download image: ${error.message}`);
    }
}

async function uploadGeneratedImageToFirebase(imageBuffer, folder = 'generated-images') {
    try {
        const timestamp = Date.now();
        const randomId = Math.random().toString(36).substr(2, 9);
        const filename = `generated_${timestamp}_${randomId}.jpg`;

        const storageRef = ref(storage, `${folder}/${filename}`);

        const metadata = {
            contentType: 'image/jpeg',
            customMetadata: {
                'generated': 'true',
                'timestamp': timestamp.toString()
            }
        };

        const snapshot = await uploadBytes(storageRef, imageBuffer, metadata);
        const downloadURL = await getDownloadURL(snapshot.ref);
        return {
            url: downloadURL,
            filename: filename,
            path: `${folder}/${filename}`,
            size: imageBuffer.length
        };
    } catch (error) {
        console.error('Firebase upload error:', error);
        throw new Error(`Failed to upload to Firebase: ${error.message}`);
    }
}

async function createBlendedImage(imageUrls, options = {}) {
    const {
        width = 1000,
        height = 800,
        blendMode = 'overlay',
        opacity = 0.7
    } = options;

    try {
        console.log(`Creating blended image from ${imageUrls.length} images...`);

        // Download all images
        const imageBuffers = await Promise.all(
            imageUrls.map(imageData => downloadImageFromFirebase(imageData.url))
        );

        // Start with first image as base
        let baseImage = await sharp(imageBuffers[0])
            .resize(width, height, { fit: 'cover' })
            .toBuffer();

        // Blend each subsequent image
        for (let i = 1; i < Math.min(imageBuffers.length, 8); i++) {
            const overlayImage = await sharp(imageBuffers[i])
                .resize(width, height, { fit: 'cover' })
                .composite([{
                    input: Buffer.from([255, 255, 255, Math.floor(255 * opacity)]),
                    raw: { width: 1, height: 1, channels: 4 },
                    tile: true,
                    blend: 'dest-in'
                }])
                .toBuffer();

            baseImage = await sharp(baseImage)
                .composite([{
                    input: overlayImage,
                    blend: blendMode
                }])
                .toBuffer();
        }

        const result = await sharp(baseImage)
            .jpeg({ quality: 50 })
            .toBuffer();

        console.log('Blended image created successfully');
        return result;
    } catch (error) {
        console.error('Error creating blended image:', error);
        throw new Error(`Failed to create blended image: ${error.message}`);
    }
}

async function generateNewRecipe(existingRecipes = [], dishType = "") {
    if (!Array.isArray(existingRecipes) || existingRecipes.length === 0) {
        throw new Error("existingRecipes must be a non-empty array.");
    }

    let recipeList = "";
    existingRecipes.forEach((recipe, index) => {
        recipeList += `${index + 1}. ${recipe}\n`;
    });

    const prompt = `
You are a creative chef. Given the following ${dishType} recipes, create a unique and delicious new variation.

Recipes:
${recipeList}

Now, suggest a new ${dishType} recipe:
    `;

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    try {
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();
        //console.log(text)

        return text;
    } catch (error) {
        console.error("Error generating recipe:", error.message);
    }
}

//addrecipieRouter.use(authenticator);

addrecipieRouter.get("/", (req, res) => {
    res.send("All the recipies")
})

addrecipieRouter.post("/add", async (req, res) => {
    const { idMeal, rname, region, instructions, avatar } = req.body;
    //console.log(req.body)
    if (!rname || !region || !instructions || !avatar) {
        return res.status(422).json({
            error: "All fields required"
        });
    }
    try {
        const newrecipie = new AddRecipieModel(req.body)
        await newrecipie.save()
        const token = jwt.sign({ _id: newrecipie._id }, process.env.JWT_SECRET)
        //console.log(newrecipie)
        return res.status(201).json({
            token
        });
    } catch (error) {
        return res.status(422).json({
            err: "Invalid credentials"
        });
    }
})

addrecipieRouter.post("/get", async (req, res) => {
    const { recipie } = req.body
    //console.log(req.body)
    const saved_recipie = await AddRecipieModel.find({ rname: { $regex: recipie, $options: "i" } })
    //console.log(saved_recipie);
    if (!saved_recipie || saved_recipie.length < 10) {
        return res.status(400).json({ error: "Please provide at least 10 recipes." });
    }
    try {
        const avatarList = saved_recipie.map(r => r.avatar);
        //console.log(avatarList);
        const newRecipe = await generateNewRecipe(saved_recipie, recipie);
        const titleMatch = newRecipe.match(/^##\s*(.+)/);
        const instructionsMatch = newRecipe.match(/(?<=\*\*Instructions:\*\*)([\s\S]*)/i);

        //const avatarList = saved_recipie.map(r => r.avatar);
        //console.log(avatarList);
        const images = avatarList.map((url, index) => ({
            name: `image_${index + 1}`,
            url: url
        }));
        let generatedImageBuffer;
        let options={};
        let uploadFolder='generated-images'
        generatedImageBuffer = await createBlendedImage(images, options);
        const uploadResult = await uploadGeneratedImageToFirebase(generatedImageBuffer, uploadFolder);

        const result = {
            idMeal: "",
            rname: titleMatch ? titleMatch[1].trim() : "Unknown",
            region: "AI",
            instructions: instructionsMatch ? instructionsMatch[1].trim() : "",
            avatar: uploadResult.url
        };
        var i = getRandomInt(1, saved_recipie.length);
        //console.log("Final Result:", result);
        //res.json(result);
        //result.avatar = saved_recipie[i].avatar;
        const arrresult = [result];
        console.log(arrresult)
        arrresult.push(...saved_recipie);
        //console.log(arrresult)
        return res.status(201).json({
            arrresult,
        });

    }
    catch (err) {
        return res.status(422).send({
            error: err.message
        });
    }
})

addrecipieRouter.post("/getbookmarkedrecipie", async (req, res) => {
    const { id } = req.body;
    //console.log(req.body)
    if (!id) {
        return res.status(422).json({
            error: "All fields required"
        });
    }

    try {
        const saved_recipie = await AddRecipieModel.find({ _id: id })
        //console.log(newrecipie)
        return res.status(201).json({
            saved_recipie
        });
    } catch (error) {
        return res.status(422).json({
            err: "Invalid credentials"
        });
    }
})

module.exports = addrecipieRouter