var express     = require('express');
var app         = express();
var bodyParser  = require('body-parser');

var serviceName = "POWER";
var servicePort = 8085;

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

router.get("/power", function(req, res) {
    console.log("powering...");
    var calcid = req.query.calcId;
    var left = req.query.leftOp;
    var right = req.query.rightOp;

    var result = Math.pow(Number(left), Number(right));
    console.log(`${left}^${right}=${result}`);
    res.write(result.toString());

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
            "LeftOperand": {
                DataType: "String",
                StringValue: left
            },
            "RightOperand": {
                DataType: "String",
                StringValue: right
            },
            Operator: {
                DataType: "String",
                StringValue: "^"
            }
        },
        MessageBody: `${left}^${right}=${result}`
    };
});

// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.use('/api', router);

// START THE SERVER
// =============================================================================
app.listen(port);
console.log(`${serviceName} service listening on port: ` + port);
