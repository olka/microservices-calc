var express     = require('express');
var app         = express();
var bodyParser  = require('body-parser');
var utils       = require('../node-calc-core/utils');

var serviceName = "DIVIDE";
var servicePort = 8084;

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

router.get("/divide", function(req, res) {
    console.log("dividing...")
    var calcid = req.query.calcId;
    var left = req.query.leftOp;
    var right = req.query.rightOp;

    var result = Number(left) / Number(right);
    console.log(`${left}/${right}=${result}`);
    res.write(result.toString());

    res.statusCode = utils.randomizeResponseCode();
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
                StringValue: "/"
            }
        },
        MessageBody: `${left}/${right}=${result}`
    };
});

// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.use('/api', router);

// START THE SERVER
// =============================================================================
app.listen(port);
console.log(`${serviceName} service listening on port: ` + port);
