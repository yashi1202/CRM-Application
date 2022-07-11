/**
 * Logic to make a post call to the notification service
 */

//Property of the global exports
const Client=require("node-rest-client").Client;

const client=new Client();
exports.client=client;
/**
 * Expose a function which will take the following information
 * 
 * subject,
 * content,
 * recepientEmails,
 * requestor,
 * ticketId
 * 
 * and then make a POST call
 */

module.exports=(ticketId, subject, content, emailIds, requestor)=>{
    /**
     * POST call
     *    -URI : 127.0.0.1
     *    -HTTP verb
     *    -Request Body
     *    -Headers
     */

    //Request Body
    const reBody={
        subject : subject,
        content : content,
        recepientEmails : emailIds,
        requestor : requestor,
        ticketId : ticketId
    }

    const headers = {
        "Content-Type" : "application/json"
    }

    const args={
        data :   reBody,
        headers : headers
    }

    var req=client.post("http://127.0.0.1:7777/notifServ/api/v1/notifications", args, (data,response)=>{
        console.log("Request Sent");
        console.log(data);

    });
    /**
     * check for the error
     */
    req.on('requestTimeout', function(req){
        console.log('request has expired');
        req.abort();
    });

    req.on('responseTimeout', function (res){
        console.log('response has expired');
    });
    req.on('error',function (err){
        console.log('request error',err);
    });
    
    



}
