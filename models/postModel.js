const mongoose = require('mongoose');

const postSchema = new mongoose.Schema{
    caption:String,
    post:String,
    dateadded:String,
    author:{
        id:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"User"
        },
        username:String
    },
    comments:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"Comment"
        }
    ],
    likes:[String],
}

module.exports = mongoose.model("Post", postSchema)