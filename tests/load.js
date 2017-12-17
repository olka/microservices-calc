import http from "k6/http";
import {check} from "k6";
import {Rate} from "k6/metrics";

export let errorRate = new Rate("errors");

export let options = {
    thresholds: {
        "errors": ["rate<0.01"], // <1% errors
        http_req_duration: ["avg<100", "p(95)<800"]
    },
    // vus: 60,
    // duration: "125s"
    stages: [
        {duration: "10s", target: 10},
        {duration: "35s", target: 30},
        {duration: "50s", target: 50},
        {duration: "60s", target: 80}
    ]
};

export default function () {
    let payload = {
        calcid: 1234,
        expression: "(2*(9+22/5)-((9-1)/4)^2)+(3^2+((5*5-1)/2))"
    };
    let res = http.post("http://35.225.188.184:8080/api/calc", payload);
    check(res, {
        "status was 200": (r) => r.status == 200,
        // "body contains result": (r) => r.body.indexOf("result") !== -1,
        "ANSWER = 43.8": (r) => r.body.indexOf("ANSWER = 43.8") !== -1
    }) || errorRate.add(1);
};