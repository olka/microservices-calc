
var express     = require('express');
var app         = express();
var bodyParser  = require('body-parser');
var mathsolver  = require("./mathsolver.js");
var calcmetrics = require("./calcmetrics.js");
var querystring = require('querystring');
var shortid     = require('shortid');
var http        = require('http');
var prometheus  = require('prom-client');
var pino        = require('pino')()

var serviceName = "CALCULATOR";
var servicePort = 8080;

// const collectDefaultMetrics = prometheus.collectDefaultMetrics;
// collectDefaultMetrics({ timeout: 5000 });

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


var summary = new prometheus.Summary({
    name: 'calc_handler',
    help: 'metric_help'
});


router.post("/calc", function(req, res) {
    var observeDuration = summary.startTimer();

    var infix = req.body.expression;
    var calcid = req.body.calcid;

    pino.info("=====================================");
    pino.info("Calculator entry point...");

    if (typeof calcid == "undefined") {    
        calcid = shortid.generate();
        // pino.info(`generating new calcid: ${calcid}`);
    }
    else {
        // pino.info(`calcid supplied: ${calcid}`);
    }

    // pino.info(`calcid: ${calcid}, infix: ${infix}`);
    
    const postData = querystring.stringify({
        'calcid': calcid,
        'expression': infix
    });

    const options = {
        hostname: '127.0.0.1',
        port: 9090,
        path: '/api/postfix/',
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Content-Length': Buffer.byteLength(postData)
        }
    };
  
    const httpreq = http.request(options, (httpres) => {
        // pino.info(`STATUS: ${httpres.statusCode}`);
        // pino.info(`HEADERS: ${JSON.stringify(httpres.headers)}`);
        httpres.setEncoding('utf8');
        var data = '';
        httpres.on('data', (chunk) => {
            data += chunk;
            // pino.info(`BODY: ${chunk}`);
        });
        httpres.on('end', () => {
            //pino.info('No more data in response.');

            var postfix = data;
            // pino.info("postfix:" + postfix);
        
            var stats = new calcmetrics();
            mathsolver.solvePostfix(stats, calcid, postfix, function(result){
                // pino.info("CALC RESULT=" + result);
                // pino.info(`add count ${stats.additionCount}`);
                // pino.info(`subtract count ${stats.subtractCount}`);
                // pino.info(`multiply count ${stats.multiplyCount}`);
                // pino.info(`divide count ${stats.divideCount}`);
                // pino.info(`power count ${stats.powerCount}`);

                res.write(`infix: ${infix}\n`);
                res.write(`postfix: ${postfix}\n`);                
                res.write(`add call count: ${stats.additionCount}\n`);
                res.write(`subtract call count: ${stats.subtractCount}\n`);
                res.write(`multiply call count: ${stats.multiplyCount}\n`);
                res.write(`divide call count: ${stats.divideCount}\n`);
                res.write(`power call count: ${stats.powerCount}\n`);                
                res.write(`ANSWER = ${result}\n`);
                                                    
                var responseCode = 200;
                var random = Math.random();

                //randomize response code
                if (random < 0.8) {responseCode = 200;}
                else if (random < 0.9) {responseCode = 403;}
                else {responseCode = 503;}

                res.statusCode = responseCode;
                res.end();
                observeDuration();
            });
        });
    });

    httpreq.on('error', (e) => {
        console.error(`problem with request: ${e.message}`);
    });

    // write data to request body
    httpreq.write(postData);
    httpreq.end();
});

router.get('/metrics', (req, res) => {
    res.set('Content-Type', prometheus.register.contentType)
    res.end(prometheus.register.metrics())
})

// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.use('/api', router);

// START THE SERVER
// =============================================================================
app.listen(port);
pino.info(`${serviceName} service listening on port: ` + port);

var exampleExpression1 = "curl --data-urlencode \"calcid=1234\" --data-urlencode \"expression=(5+3)/2\" http://localhost:8080/api/calc"
var exampleExpression2 = "curl --data-urlencode \"calcid=1234\" --data-urlencode \"expression=((5+3)/2)^3\" http://localhost:8080/api/calc"
var exampleExpression3 = "curl --data-urlencode \"calcid=1234\" --data-urlencode \"expression=3^2+((5*5-1)/2)\" http://localhost:8080/api/calc"
var exampleExpression4 = "curl --data-urlencode \"calcid=1234\" --data-urlencode \"expression=3^3+((5*5)-1)/2\" http://localhost:8080/api/calc"
var exampleExpression5 = "curl --data-urlencode \"calcid=1234\" --data-urlencode \"expression=(2*(9+22/5)-((9-1)/4)^2)\" http://localhost:8080/api/calc"
var exampleExpression6 = "curl --data-urlencode \"calcid=1234\" --data-urlencode \"expression=(2*(9+22/5)-((9-1)/4)^2)+(3^2+((5*5-1)/2))\" http://localhost:8080/api/calc"

pino.info("********************************************");
pino.info("********************************************");
pino.info("sample calculator test commands:");
pino.info(`${exampleExpression1}`);
pino.info(`${exampleExpression2}`);
pino.info(`${exampleExpression3}`);
pino.info(`${exampleExpression4}`);
pino.info(`${exampleExpression5}`);
pino.info(`${exampleExpression6}`);
pino.info("********************************************");
pino.info("********************************************");










