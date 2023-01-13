const { default: mongoose } = require("mongoose")

const dbConnect = () => {
    try{
        const conn = mongoose.connect(process.env.MONGODB_URL);
        console.log("DATABASE CONNECTED")
    }catch(e){
        console.log("DATABASE ERROR")
    }
}

module.exports = dbConnect;