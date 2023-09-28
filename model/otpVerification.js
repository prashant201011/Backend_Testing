const mongoose=require("mongoose");
const schema=mongoose.Schema;

const OtpModel=new schema({
    userId:String,
    otp:String,
    createdAt:Date,
    expiresAt:Date
});


module.exports=mongoose.model("OtpModel",OtpModel);