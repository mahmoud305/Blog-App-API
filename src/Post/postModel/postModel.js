
const mongoose= require("mongoose");
const postSchema = require("../postSchema/postSchema");

const postModel= mongoose.model("post",postSchema);

module.exports= postModel;

// you have made the model and schema for posts then you have to continue posts api .