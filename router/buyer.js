const express=require("express");
const buyerLoginController=require("../controller/buyerLoginController");
const buyerHomeController=require("../controller/buyerHomeController");
const router=express.Router();

router.get("/login",buyerLoginController.getCredentials);

router.post("/login",buyerLoginController.buyerLogin);

router.post("/setpassword",buyerLoginController.setPassword);

router.get("/homePage",buyerHomeController.getDetails);

router.post("/homePage",buyerHomeController.postDetails);

router.post("/getOtp",buyerLoginController.otpVerificationEmail);

router.post("/verifyOtp",buyerLoginController.verifyOtp);

module.exports=router;