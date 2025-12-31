const mongoose = require("mongoose");

const connectDB = () => {
    try{
        const conn = mongoose.connect(process.env.MONGODB_URL);
        console.log("MongoDB Connected");
    }catch(error){
        console.log("MongoDB Connection Error :", error);
    }
};

module.exports = connectDB;