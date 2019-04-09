const ViberBot = require('viber-bot').Bot;
const BotEvents = require('viber-bot').Events;
const TextMessage = require('viber-bot').Message.Text;
const request = require('request');
var validator = require('validator');
var util = require("util");
var moment = require('moment');
var uuid = require('node-uuid');
var config = require('config');
var jsonwebtoken = require('jsonwebtoken');


// var sockets = {};
// var mapID = {};


// var messengerURL = util.format("http://%s", config.Services.messengerhost);

// if (validator.isIP(config.Services.messengerhost))
// messengerURL = util.format("http://%s:%d", config.Services.messengerhost, config.Services.messengerport);

// console.log(messengerURL);
// Creating the bot with access token, name and avatar
const bot = new ViberBot({
    authToken: config.Viber.authToken, // <--- Paste your token here
    name: config.Viber.name, // <--- Your bot name here
    avatar: config.Viber.avatar,
    event_types: ["delivered", "seen", "failed", "subscribed", "unsubscribed", "conversation_started"]
});


const http = require('http');
const port = 3667;

http.createServer(bot.middleware()).listen(port, function () {
    bot.setWebhook(config.Viber.webhookurl)
});

bot.on(BotEvents.MESSAGE_RECEIVED, function (message, response) {

    let uri = config.Viber.viberConnectorURL + "/ViberConnectorAPI/message";

    // console.log(response);

    //     authToken:"4602e2beceb3cd4f-c39c57abeb6abdde-94f1290d3cfc416d"
    // avatar:"http://www.facetone.com/wp-content/uploads/2016/06/facetone-logo.png"
    // name:"Ftone"
    // __proto__:EventEmitter {getBotProfile: , getUserDetails: , getOnlineStatus: , …}
    // chatId:undefined
    // replyType:undefined
    // silent:false
    // userProfile:UserProfile {id: "tm3k4D45oI3+OWJzrXZyzw==", name: "Dilshan Kaluarachchi", avatar: null, …}
    // apiVersion:7
    // avatar:null
    // country:"LK"
    // id:"tm3k4D45oI3+OWJzrXZyzw=="
    // language:"en"
    // name:"Dilshan Kaluarachchi"


    // console.log(message);
    // TextMessage {text: "Hi", timestamp: 1554445674545, token: "5294838612724375524", trackingData: Object, keyboard: null, …}
    // app.js:45
    // keyboard:null
    // minApiVersion:undefined
    // requiredArguments:Array(1) ["text"]
    // length:1
    // __proto__:Array(0) [, …]
    // 0:"text"
    // text:"Hi"
    // timestamp:1554445674545
    // token:"5294838612724375524"

    // uri = encodeURI(uri);
    var myObj = {
        "viberAccountName": response._bot.name,
        "apiVersion": response.userProfile.apiVersion,
        "userID": response.userProfile.id,
        "userProfile": response.userProfile,
        "userName": response.userProfile.name,
        "userCountry": response.userProfile.country,
        "userLanguage": response.userProfile.language,
        "messageText": message.text,
        "messageTimestamp": message.timestamp,
        "messageToken": message.token
    };
    var myJSON = JSON.stringify(myObj);

    request({
        method: "POST",
        url: uri,
        headers: {
            "Content-Type": "application/json"
        },
        body: myJSON
    }, function (_error, _response) {
        // console.log(_response);
        try {
            if (_error) {
                console.log(_error);
                // let jsonString = messageFormatter.FormatMessage(undefined, "Speech to text has failed", false, undefined);
                // reject(jsonString);
            } else {
                // console.log(_response);
                // console.log(_response.body);
                resposeObj = JSON.parse(_response.body);
                console.log(resposeObj);
                // console.log(message);
                // console.log(response);
                bot.sendMessage(resposeObj.userProfile, new TextMessage(resposeObj.finalTextOutput));
                //response.send(new TextMessage("Welcome home"));
                //    bot.sendMessage(response.userProfile, new TextMessage("Thanks for shopping with us"));

                //                 var newUserID = response.userProfile.id.replace(/\//g, '');
                //                 var newUserID = newUserID.replace(/[^\w\s]/gi, '');
                //                 console.log("New ID " + newUserID);
                //                 console.log("Old ID " + response.userProfile.id);

                //                 if (!sockets[newUserID]) {
                //                     console.log("not existing ID");
                //                     var socket = require('socket.io-client')(messengerURL, {
                //                         forceNew: true
                //                     });
                //                     var session_id = uuid.v1();
                //                     console.log(session_id);

                //                     socket.on('connect', function () {
                //                         var jwt = jsonwebtoken.sign({
                //                             session_id: session_id,
                //                             iss: config.Host.iss,
                //                             iat: moment().add(1, 'days').unix(),
                //                             company: config.Host.company,
                //                             tenant: config.Host.tenant,
                //                             contact: "",
                //                             channel: 'viber',
                //                             jti: newUserID,
                //                             attributes: ["60"],
                //                             priority: "0",
                //                             name: response.userProfile.name

                //                         }, config.Host.secret);

                //                         socket
                //                             .emit('authenticate', {
                //                                 token: jwt
                //                             }) //send the jwt
                //                             .on('authenticated', function () {
                //                                 //do other things
                //                                 console.log("Authenticated");

                //                                 bot.sendMessage(response.userProfile, new TextMessage(_response.body));

                //                                 sockets[newUserID] = socket;
                //                                 mapID[newUserID] = response.userProfile;


                //                                 function retryAgent() {

                //                                     socket.emit("retryagent");
                //                                 }

                //                                 var retryObj = setInterval(retryAgent, 30000);


                //                                 socket.on('agent', function (data) {

                //                                     clearInterval(retryObj);
                //                                     console.log(data);
                //                                     //var card = createAnimationCard(session,data.name, data.avatar);
                //                                     //var msg = new builder.Message(session).addAttachment(card);
                //                                     //session.send(msg);
                //                                     //bot.sendMessage("Agent connected");
                //                                 })



                //                                 socket.on('typing', function (data) {

                //                                     //session.sendTyping();
                //                                     console.log("Typing data ", data);
                //                                     console.log("typing...............................");
                //                                     //bot.send()
                //                                 });

                //                                 socket.on('typingstoped', function (data) {
                //                                     console.log("typing stoped...............................");
                //                                 });

                //                                 socket.on('seen', function (data) {

                //                                     console.log("seen...............................");
                //                                 });

                //                                 socket.on("message", function (data) {
                //                                     console.log("Sending message");
                //                                     bot.sendMessage(response.userProfile, new TextMessage(data.message));
                //                                 });

                //                                 socket.on('existingagent', function (data) {


                //                                     console.log("Existing agent ", data.name);
                //                                     /*if(data && data.name && data.avatar && data.message) {

                //                             bot.sendMessage(response.userProfile,new TextMessage(data.message));
                //                         }
                // */
                //                                 });


                //                                 socket.on('left', function (data) {

                //                                     bot.sendMessage(response.userProfile, new TextMessage("Agent left the chat"));
                //                                     delete sockets[newUserID];
                //                                     //session.endConversation();
                //                                     socket.disconnect();

                //                                 })

                //                             })
                //                             .on('unauthorized', function (msg) {
                //                                 console.log("unauthorized: " + JSON.stringify(msg.data));
                //                                 //throw new Error(msg.data.type);
                //                             })

                //                     });
                //                     socket.on('disconnect', function () {

                //                     });
                // } else {
                //     console.log("existing ID");
                //     bot.sendMessage(response.userProfile, new TextMessage(_response.body));
                //     //session.send("Please waiting for human agent to take over  !!!!!");

                //     sockets[newUserID].emit("message", {
                //         message: message.text,
                //         type: "text"
                //     });
                // }

            }
        } catch (excep) {
            console.log(excep);
            // let jsonString = messageFormatter.FormatMessage(excep, "Speech to text has failed", false, undefined);
            // reject(jsonString);
        }
    });



    //     TextMessage {text: "Hi", timestamp: 1552888287794, token: 5288306458762586000, trackingData: Object, keyboard: null}
    // app.js:39
    // keyboard:null
    // text:"Hi"
    // timestamp:1552888287794
    // token:5288306458762586000
    // trackingData:Object {}
    // __proto__:Message {toJson: , constructor: }
    // Response {_bot: ViberBot, userProfile: UserProfile}
    // app.js:40
    // _bot:ViberBot {authToken: "4602e2beceb3cd4f-c39c57abeb6abdde-94f1290d3cfc416d", name: "Ftone", avatar: "http://www.facetone.com/wp-content/uploads/2016/06…", …}
    // userProfile:UserProfile {id: "tm3k4D45oI3+OWJzrXZyzw==", name: "Dilshan Kaluarachchi", avatar: null, …}
    // __proto__:Object {send: , constructor: }
    // New ID tm3k4D45oI3OWJzrXZyzw
    // app.js:46
    // Old ID tm3k4D45oI3+OWJzrXZyzw==
});

bot.on(BotEvents.MESSAGE_SENT, function (message, userProfile) {
    console.log("Message sent");
    // onFinish(new TextMessage('Nice to have a chat with you'),{ saidThanks: true });
});

bot.on(BotEvents.CONVERSATION_STARTED, function (userProfile, onFinish) {
    console.log("Conversation started");
    onFinish(new TextMessage('Nice to have a chat with you'), {
        saidThanks: true
    });
});

bot.on(BotEvents.ERROR, function (error) {
    console.log("Error ", error);
});


//
//var restify = require('restify');
//var https_options = {
//    //ca: fs.readFileSync('/etc/ssl/fb/COMODORSADomainValidationSecureServerCA.crt'),
//    //key: fs.readFileSync('/etc/ssl/fb/SSL1.txt'),
//    //certificate: fs.readFileSync('/etc/ssl/fb/STAR_duoworld_com.crt')
//};
//
//const ViberBot  = require('viber-bot').Bot;
//const BotEvents = require('viber-bot').Events;
//
//var server = restify.createServer(https_options);
//
//
//
//
//const bot    = new ViberBot({
//    authToken: "4585d4373bb3fd2c-14e3267fe74b4516-d0d16d1ebd1acadf",
//    name: "EchoBot",
//    avatar: "http://viber.com/avatar.jpg" // It is recommended to be 720x720, and no more than 100kb.
//});
//
//bot.setWebhook("http://5147b9e8.ngrok.io/");
//
////server.use(process.env.WEBHOOK_URL, bot.middleware());
//
//
//
//
//server.listen(process.env.port || process.env.PORT || 8080, function () {
//    console.log('%s listening to %s', server.name, server.url);
//});
//bot.on(BotEvents.MESSAGE_RECEIVED, function(message, response)
//{
//    console.log("hii");
//});
//
//server.post("http://5147b9e8.ngrok.io/", bot.middleware());