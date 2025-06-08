const mongoose=require("mongoose");

const addRecipieSchema=mongoose.Schema({
    idMeal:{type:String},
    rname:{type:String},
    region:{type:String},
    instructions:{type:String},
    avatar:{type:String},
    //userid:{type:String,required:true},
},{
    versionKey:false
})

const addRecipieModel=mongoose.model("addedrecipies",addRecipieSchema);

module.exports=addRecipieModel