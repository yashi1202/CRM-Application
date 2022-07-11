const bcrypt=require('bcryptjs');
const constants=require('../utils/constants');
const User=require('../model/userModel');
const jwt=require("jsonwebtoken");
const config=require("../configs/authConfig");
/**
 * Controller for signup/registration
 * 
 */


exports.signup=async (req,res)=>{
    //how the user signup will happen
    //userStatus : APPROVED | PENDING | REJECTED
/**
 * userType : Customer, userStatus : Approved
 * userType : Engineer, userStatus : Pending
 */
var userStatus=req.body.userStatus;
if(!req.body.userStatus){
    if(!req.body.userType || req.body.userType==constants.userTypes.customer){
        userStatus=constants.userStatus.approved;
    }else{
        userStatus=constants.userStatus.pending;
    }
}
    const userObjToBeStoredInDB={
        name: req.body.name,
        userId: req.body.userId,
        email : req.body.email,
        userType : req.body.userType,
        password : bcrypt.hashSync(req.body.password,8),
        userStatus : userStatus
    }
    /**
     * Insert this new user to the db
     */
    const userCreated=await User.create(userObjToBeStoredInDB);
    console.log("user created", userCreated);
    /**
     * Return the response
     */
    try{
    const userCreationResponse={
        name:userCreated.name,
        userId: userCreated.userId,
        email: userCreated.email,
        userType:userCreated.userType,
        userStatus: userCreated.userStatus,
        createdAt: userCreated.createdAt,
        updatedAt: userCreated.updatedAt
    }
    res.status(201).send(userCreationResponse);
}catch(err){
    console.error("Error while creating new user", err.message);
    res.status(500).send({
        message : "some internal error happen while inserting a new user"
    })
}

    

}

/**
 * Controller for signin
 */
exports.signin=async (req,res)=>{
    //search the user if exists
    try{
    var user=await User.findOne({userId : req.body.userId});
    }catch(err){
        console.log(err.message);
    }
    if(user==null){
        res.status(400).send({
            message : "Failed! User id does not exists"
        })
    }
    /**
     * Check if the user is approved
     */
    if(user.userStatus!=constants.userStatus.approved){
        return res.status(200).send({
            message : "Can't allow the login as the user is still not approved"
        })
    }
    //User is existing, so we will do the passe=word matching
    const isPasswordValid=bcrypt.compareSync(req.body.password, user.password);
    if(!isPasswordValid){
        return res.status(401).send({
            message : "Invalid Password !"
        })
    }

    /**
     * Successful login
     */
    //need to generate access token now
    const token=jwt.sign({id: user.userId},config.secret,{
        expiresIn: 600
    });
    //Send the response back
    res.status(200).send({
        name: user.name,
        userId: user.userId,
        email: user.email,
        userType: user.userType,
        userStatus : user.userStatus,
        accessToken : token
    })
};


