/**
 * This file will act as the route for authentication or authorization
 */

//define the routes 
const authController=require("../controllers/authController");
const {verifySignup}=require("../middleware")
module.exports=(app)=>{
    //app -> getting from express
    //POST 127.0.0.1:8080/crm/api/v1/auth/signup
    app.post("/crm/api/v1/auth/signup",[verifySignup.validateSignUpRequest],authController.signup);
    app.post("/crm/api/v1/auth/signin",authController.signin);
    
}