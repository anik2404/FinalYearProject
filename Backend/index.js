const express=require("express");
const cors=require("cors");
const connection = require("./db");
const userRouter = require("./routes/userRoutes");
const recipieRouter = require("./routes/recipieRoutes");
const addrecipieRouter=require("./routes/addRecipieRoutes")
const detailsRouter=require("./routes/detailsRoutes")
require("dotenv").config();
const port=process.env.PORT;
const app=express()
app.use(cors());
app.use(express.json());
app.use("/user",userRouter);
app.use("/recipie",recipieRouter);
app.use("/addedrecipie",addrecipieRouter);
app.use("/userdetails",detailsRouter)

app.get("/",async(req,res)=>{
    res.send("API is working properly")
})

app.listen(port,async()=>{
    try{
        await connection
        console.log("Database is connected")
    }
    catch(err)
    {
        console.log(err)
    }
    console.log("Server is running on the port number: ",port);
})