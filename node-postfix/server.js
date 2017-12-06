var express     = require('express');        // call express
var app         = express();                 // define our app using express
var bodyParser  = require('body-parser');
var utils       = require('../node-calc-core/utils');
var mathsolver  = require("./mathsolver.js");
var pino        = require('pino')()

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

    pino.info(`${serviceName}->calcid: ${calcid}, infix: ${infix}`);
    var postfix = mathsolver.infixToPostfix(infix).trim();
    pino.info(`${serviceName}->calcid: ${calcid}, postfix: ${postfix}`);
    res.write(postfix);

    res.statusCode = utils.randomizeResponseCode();
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
pino.info(`${serviceName} service listening on port: ` + port);
