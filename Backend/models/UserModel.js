const mongoose=require("mongoose");
const bcrypt=require("bcrypt")

const userSchema=mongoose.Schema({
    name:{type:String,required:true},
    email:{type:String,required:true},
    password:{type:String,required:true},
    grade:{type:String,required:true},
    dob:{type:String,required:true},
},{
    versionKey:false
})


userSchema.pre('save',async function(next){
    const user=this;
    if(!user.isModified('password'))
    {
        return next();
    }
    user.password=await bcrypt.hash(user.password,10);
    next();
})

const UserModel=mongoose.model("user",userSchema);

module.exports=UserModel