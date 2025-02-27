const jwt=require('jsonwebtoken');
const  mongoose  = require('mongoose');
const User=mongoose.model("user")
require('dotenv').config()
module.exports=(req,res,next)=>{
    const { authorization }=req.headers
    if(!authorization){
        return res.send(401).json({error:"you want to login"})
    }
    const token=authorization.replace("Bearer ","")

    jwt.verify(token,process.env.JWT_SECRET,async(err,payload)=>
    {
        if(err){
            return res.send(401).json({error:"token not verified"});
        }
        const {_id}=payload
        User.findById(_id).then(userdata=>{
            req.body.userid=userdata._id;
            next();
            return;
        })
    })

}
