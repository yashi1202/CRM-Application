const User=require("../model/userModel");
const objectConverter=require("../utils/objectConverter"); 
/**
 * This file will have all the logic to manipulate the user resource
 */



/**
 * Fetch to list of all users
 *   -only ADMIN is allowed to call this method
 *   -ADMIN should be able to filter based on : 
 *        1. Name
 *        2. UserType
 *        3. UserStatus
 */
exports.findAllUsers=async (req,res)=>{
    /**
     * Read the data from the query param
     */

    const nameReq=req.query.name;
    const userStatusReq=req.query.userStatus;
    const userTypeReq=req.query.userType;

    const mongoQueryObj={}
    if(nameReq && userStatusReq && userTypeReq){
        mongoQueryObj.name=nameReq;
        mongoQueryObj.userStatus=userStatusReq;
        mongoQueryObj.userType=userTypeReq;
        

    }
    else if(userStatusReq && userTypeReq){
        mongoQueryObj.userStatus=userStatusReq;
        mongoQueryObj.userType=userTypeReq;
    }else if(nameReq && userStatusReq){
        mongoQueryObj.name=nameReq;
        mongoQueryObj.userStatus=userStatusReq;

    }else if(nameReq && userTypeReq){
        mongoQueryObj.name=nameReq;
        mongoQueryObj.userType=userTypeReq;

    }else if(nameReq){
        mongoQueryObj.name=nameReq;
    }else if(userTypeReq){
        mongoQueryObj.userType=userTypeReq;
    }else if(userStatusReq){
        mongoQueryObj.userStatus=userStatusReq;

    }
    /**
     * Write the code here to fetch all the users from the DB
     * 
     * Fetch the user documents from the users collection
     * 
     */
    try{
        const user=await User.find(mongoQueryObj);
       return  res.status(200).send(objectConverter.userResponse(user)); //user password will also be returned
    }catch(err){
        console.log(err.message);
        res.status(500).send({
            message : "Internal error while fetching all users"
        })
    }
    
}
/**
 * Fetch the user based on the userId
 */

exports.findUserById=async (req,res)=>{
    const userIdReq=req.params.userId; //reading from the request parameter

    const user=await User.find({userId: userIdReq});

    if(user){
        res.status(200).send(objectConverter.userResponse(user));
    }else{
        res.status(200).send({
            message : "User with id "+userIdReq+"doesn't exists"
        })
    }


}

/**
 * Update the user - status, user type
 *   -only ADMIN should be allowed to do this
 * 
 * ADMIN - name, userStatus, userType
 */
exports.updateUser=(req,res)=>{
    /**
     * One of the ways of updating
     */
    try{
    const userIdReq=req.params.userId;

    const user=User.findOneAndUpdate({
        userId: userIdReq

    },{
        name: req.body.name,
        userStatus: req.body.userStatus,
        userType: req.body.userType
    }).exec();

    res.status(200).send({
        message: "User record successfully updated"
    })
}catch(err){
    console.log(err.message);
    res.status(500).send({
        message: "Internal server error while updating"
    })
}

}