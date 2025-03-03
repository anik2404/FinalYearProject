const mongoose=require("mongoose");

const recipieSchema=mongoose.Schema({
    idMeal:{type:String,required:true},
    likes:{type:Number,required:true},
    userid:{type:[String],required:true},
})


const RecipieModel=mongoose.model("recipie",recipieSchema);

module.exports=RecipieModel