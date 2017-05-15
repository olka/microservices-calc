var express     = require('express');
var app         = express();
var bodyParser  = require('body-parser');
var xray        = require('aws-xray-sdk');
var aws         = require('aws-sdk');

var serviceName = "DIVIDE";
var servicePort = 8084;

app.use(xray.express.openSegment(serviceName));

var sqs = xray.captureAWSClient(new aws.SQS());

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = process.env.PORT || servicePort;

var calcSQSQueue = process.env.CALC_SQS_QUEUE_URL

// ROUTES FOR OUR API
// =============================================================================
var router = express.Router();

// test route to make sure everything is working (accessed at GET http://localhost:8080/api)
router.get('/', function(req, res) {
    rres.json({ message: `welcome from the ${serviceName} service` });
});

router.get("/divide", function(req, res) {
    console.log("dividing...")
    var calcid = req.query.calcId;
    var left = req.query.leftOp;
    var right = req.query.rightOp;

    var seg = xray.getSegment();
    seg.addAnnotation('calcid', calcid);

    var result = Number(left) / Number(right);
    console.log(`${left}/${right}=${result}`);
    res.write(result.toString());

    seg.addMetadata("left", left);
    seg.addMetadata("right", right);
    seg.addMetadata("operator", "/");
    seg.addMetadata("result", result);

    var responseCode = 200;
    var random = Math.random();

    //randomize response code
    if (random < 0.8) {
        //GREEN
        responseCode = 200;
    } else if (random < 0.9) {
        //ORANGE
        responseCode = 403;
    } else {
        //RED
        responseCode = 503;
    }

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
                StringValue: "/"
            }
        },
        MessageBody: `${left}/${right}=${result}`,
        QueueUrl: calcSQSQueue
    };

    sqs.sendMessage(params, function(err, data) {
        if (err) {
            console.log(`sqs error for ${serviceName} service`, data.MessageId);            
        } else {
            console.log(`sqs success for ${serviceName} service`, data.MessageId);            
        }
    })    
});

// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.use('/api', router);

// START THE SERVER
// =============================================================================
app.listen(port);
console.log(`${serviceName} service listening on port: ` + port);
