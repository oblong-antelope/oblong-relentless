var express = require('express');
var app = express();
var postRequest = require('request');

var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

var DATASET = [];


app.post('/', function(req, res) {
    console.log(req.body.origin);

    ds = formDataSets(req.body.origin);

    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'POST');
    res.set('Content-Type', 'text/plain');
    res.send(JSON.stringify({
        datasets: ds
    }));
});

function formDataSets(origin){
    ds = [];
    var j = 0;
    for(var i=0; i<DATASET.length; i++){
        if(DATASET[i].x>8 && DATASET[i].y>8) {
            ds[j] = {
                label:'abc',
                data:[{
                    x:DATASET[i].x,
                    y:DATASET[i].y,
                    r:DATASET[i].r,
                }],
                backgroundColor:DATASET[i].backgroundColor
            };
            j++;
        }
    }
    return ds;
}



var PORT = process.env.PORT || 1140;
function updatePrices() {
    /*postRequest.post(SERVER_ADDRESS, {request:'stockPrice'}, function(err, response, body){
        console.log(body);
    });*/

    for(var i=0; i< parseInt(100000); i++){
        DATASET[i] = {
            label: (100000*Math.random()).toString(),
            x:10*Math.random(),
            y:10*Math.random(),
            r:5*Math.random()+8,
            backgroundColor:'#FF89AA'
        };
    }
}

updatePrices();




var SERVER_ADDRESS = "http://young-plateau-61675.herokuapp.com";
var server = app.listen(PORT, function(){
    var host = server.address().address;
    var port = server.address().port;

    console.log('Started Server at %s:%s', host, port);
});
