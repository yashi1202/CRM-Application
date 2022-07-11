const express=require("express");
const serverConfig=require("./configs/serverconfig");
const mongoose=require("mongoose");
const dbConfig=require("./configs/dbConfig");
const bodyParser = require("body-parser");
const bcrypt=require("bcryptjs");
const User=require("./model/userModel");

const app=express();
app.use(bodyParser.json()); //express is using the bodyParser
app.use(bodyParser.urlencoded({extended:true}));
/**
 * Setup the mongodb connection and create an ADMIN user
 */


mongoose.connect(dbConfig.DB_URL,()=>{
    console.log("MongoDB connected");
    //Initialization
    init();

})
async function init(){
    var user=await User.findOne({userId : "admin"});
    if(user){
        return;
    }else{

    //create the admin user
    const user=await User.create({
        name: "Yash",
        userId: "admin",
        email:"yashirastogi1212@gmail.com",
        userType: "ADMIN",
        password: bcrypt.hashSync("Welcome00123",8)
    });
    console.log("admin user is created");
}
}

require('./routes/authRoutes')(app);
require('./routes/userRoutes')(app);
require('./routes/ticketRoutes')(app);
/**
 * Start the express server
 */
app.listen(serverConfig.PORT,()=>{
    console.log("Application has started on the PORT",serverConfig.PORT);
})