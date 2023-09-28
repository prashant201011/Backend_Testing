const homePageModel=require("../model/homePage");
exports.getDetails=(req,res,next)=>{ 
    try{
        homePageModel.find().then(result=>{

        res.status(200).json(result);
        }).catch(err=>{
            res.status(404).json("user not found");
        });
    }
    catch(error){
        res.status(404).json("noting here to see");
    }
}

exports.postDetails=async(req,res,next)=>{
   try
    {
    const totalLimit=req.body.totalLimit;
    const limitUsed=req.body.limitUsed;
    const blockedCredir=req.body.blockedCredir;
    const storeName=req.body.storeName;
    const storeAddress=req.body.storeAddress;
    const recentPurchases=req.body.recentPurchases;
    const limitLeft=req.body.limitLeft;

    const homeModel=await new homePageModel({
        totalLimit,
        limitUsed,
        blockedCredir,
        storeName,
        storeAddress,
        recentPurchases,
        limitLeft,
    });
    
    await homeModel.save();
    
    res.status(200).json("The details are stored");
}
catch(error){
    res.status(404).json(error)
}
}