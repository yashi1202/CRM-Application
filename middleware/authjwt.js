const jwt=require("jsonwebtoken");
const config=require("../configs/authConfig")
const User=require("../model/userModel")
const constants=require("../utils/constants")
/**
 * Authentication 
 * 
 *  - if the token passed is valid or not
 * 
 * 1. If no token is passed in the request header - Not allowed
 * 2. If token is passed : Authenticated
 *      if correct allow, else reject
 */

verifyToken=(req,res,next)=>{
    /**
     * Read the token from the header
     */
    const token=req.headers['x-access-token'];

    if(!token){
        return res.status(403).send({
            message : "No token provided"
        })
    }
    //if the token was provided, we need to verify it
    jwt.verify(token,config.secret,(err,decoded)=>{
        if(err){
            return res.status(401).send({
                message : "Unauthorized"
            });
        }
        //I will try to read the userid from the decoded token and store it in the req object
        req.userId=decoded.id;
        next();
    })
};
 /**
  * If the process token is of ADMIN or not
  */

 isAdmin=async (req,res,next)=>{
     /**
      * Fetch the user from the db using the userId
      */
     const user=await User.findOne({userId: req.userId});
     /**
      * Check what is the user type
      */
     if(user && user.userType==constants.userTypes.admin){
         next();
     }else{
         res.status(403).send({
             message : "Requires ADMIN role"
         })
     }
 }
const authJwt={
    verifyToken: verifyToken,
    isAdmin: isAdmin
};
module.exports=authJwt;
