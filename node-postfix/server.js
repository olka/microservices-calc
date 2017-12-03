var express     = require('express');        // call express
var app         = express();                 // define our app using express
var bodyParser  = require('body-parser');
var mathsolver  = require("./mathsolver.js");

var serviceName = "POSTFIX";
var servicePort = 9090;

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = process.env.PORT || servicePort;

// ROUTES FOR OUR API
// =============================================================================
var router = express.Router();

// test route to make sure everything is working (accessed at GET http://localhost:8080/api)
router.get('/', function(req, res) {
    res.json({ message: `welcome from the ${serviceName} service` });
});

router.post("/postfix", function(req, res) {
    var calcid = req.body.calcid;
    var infix = req.body.expression;

    console.log(`${serviceName}->calcid: ${calcid}, infix: ${infix}`);
    var postfix = mathsolver.infixToPostfix(infix).trim();
    console.log(`${serviceName}->calcid: ${calcid}, postfix: ${postfix}`);
    res.write(postfix);
    
    var responseCode = 200;
    var random = Math.random();

    //randomize response code
    if (random < 0.8) {responseCode = 200;}
    else if (random < 0.9) {responseCode = 403;}
    else {responseCode = 503;}

    res.statusCode = responseCode;
    res.end();

    var params = {
        MessageGroupId: calcid,
        MessageAttributes: {
            "Infix": {
                DataType: "String",
                StringValue: infix
            },
            "Postfix": {
                DataType: "String",
                StringValue: postfix
            },
        },
        MessageBody: `${infix} converts to ${postfix}`,
    };
});

// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.use('/api', router);

// START THE SERVER
// =============================================================================
app.listen(port);
console.log(`${serviceName} service listening on port: ` + port);
