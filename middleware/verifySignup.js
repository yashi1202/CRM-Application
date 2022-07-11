/**
 * This file will contain the custom middleware for
 * verifying the request body
 */

const User=require("../model/userModel")
const constant=require("../utils/constants");
validateSignupRequest=async (req,res,next)=>{
    //validate if username exists
    if(!req.body.name){
        return res.status(400).send({
            message: "Failed ! User name is not provided"
        })
    }
    //Validate  if the userId exists
    if(!req.body.userId){
        return res.status(400).send({
            message : "Failed ! userId is not provided"
        })
    }
    /**
     * Validate if the userId is already not present
     * 
     */
    const user=await User.findOne({userId: req.body.userId});
    if(user!=null){
        return res.status(400).send({
            message: "Failed! user ID already exists"
        })
    }
    /**
     * if the email id is already existing
     */
    const email=await User.findOne({email : req.body.email});
    if(email!=null){
        return res.status(400).send({
            message : "Failed ! Email ID already exists"
        })
    }
    if(!req.body.password){
        return res.status(400).send({
            message : "Failed ! User password already exists"
        })
    }
    const userType=req.body.userType;
    const userTypes=[constant.userTypes.customer, constant.userTypes.admin, constant.userTypes.engineer];
    if(userType && !userTypes.includes(userType)){
        return res.status(400).send({
            message : "Failed ! User type is not correctly provided"
        })
    }
    /**
     * Similar validation for all the other fields
     * 
     * email,
     * password,
     * userType
     */
    next(); //give the control to the controller
}

module.exports={
    validateSignUpRequest : validateSignupRequest
}
