const mongoose=require("mongoose");
const schema=mongoose.Schema;

const homePageModel= new schema({
    totalLimit:{type:Number,},
    limitUsed:{type:Number},
    leftLimit:{type:Number},
    blockedCredir:{type:Number},
    storeName:{type:String},
    storeAddress:{type:String},
    recentPurchases:{type:String}
});


module.exports=mongoose.model("homePageModel",homePageModel);