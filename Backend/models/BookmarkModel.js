const mongoose=require("mongoose");

const bookmarkSchema=mongoose.Schema({
    idMeal:{type:String,required:true},
    userid:{type:[String],required:true},
})


const BookmarkModel=mongoose.model("bookmark",bookmarkSchema);

module.exports=BookmarkModel