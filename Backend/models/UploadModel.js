const mongoose=require("mongoose");

const uploadSchema=mongoose.Schema({
    title:{type:String,required:true},
    avatar:{type:String,required:true},
    userid:{type:String,required:true},
},{
    versionKey:false
})

const UploadModel=mongoose.model("upload",uploadSchema);

module.exports=UploadModel