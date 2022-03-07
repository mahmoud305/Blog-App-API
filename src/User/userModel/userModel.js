const mongoose= require("mongoose");
const userSchema  = require("../userSchema/userSchema");

const userModel=mongoose.model("user",userSchema);

module.exports=userModel;