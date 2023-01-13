const mongoose = require('mongoose'); // Erase if already required

// Declare the Schema of the Mongo model
var blogSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true,
    },
    description:{
        type:String,
        required:true,
    },
    category:{
        type:String,
        required:true,
    },
    numViews:{
        type:Number,
        default: 0,
    },
    isLiked: {
        type: Boolean,
        default: false,
    },
    isDisliked: {
        type: Boolean,
        default: false,
    },
    likes: [
        { 
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
    ], 
    dislikes: [
        {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        },
    ],
    image:{
        type: String,
        default: "https://th.bing.com/th/id/OIP.a5YOm_1N-oe-O025Jw4PTQHaE8?pid=ImgDet&rs=1"
    },
    author:{
        type: String,
        default: "Admin",
    },
    images: [],
}, {
    toJSON: {
        virtuals: true,
    }, 
    toObject: {
        virtuals:true,
    },
    timeStamps: true
    }
);

//Export the model
module.exports = mongoose.model('Blog', blogSchema);