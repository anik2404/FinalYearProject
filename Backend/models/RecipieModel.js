const mongoose=require("mongoose");

const recipieSchema=mongoose.Schema({
    idmeal:{type:String,required:true},
    likes:{type:BigInt,required:true},
    //userid:{type:String,required:true},
},{
    versionKey:false
})


const RecipieModel=mongoose.model("recipie",recipieSchema);

module.exports=RecipieModel