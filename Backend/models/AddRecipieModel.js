const mongoose=require("mongoose");

const addRecipieSchema=mongoose.Schema({
    idMeal:{type:String},
    rname:{type:String,required:true},
    region:{type:String,required:true},
    instructions:{type:String,required:true},
    avatar:{type:String,required:true},
    //userid:{type:String,required:true},
},{
    versionKey:false
})

const addRecipieModel=mongoose.model("addedrecipies",addRecipieSchema);

module.exports=addRecipieModel