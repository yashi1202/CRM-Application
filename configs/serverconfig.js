if(process.env.NODE_ENV != 'production'){
    require('dotenv').config(); //used for mimicking the environment
}

module.exports={
    PORT : process.env.PORT
}
/**
 * process.env--> present natively in node
 *                gives info about node.js process
 */