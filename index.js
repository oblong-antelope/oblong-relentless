var express = require('express');
var $ = require('jquery');
var app = express();

app.get('/', function(req, res) {
    var ds = [];
    for(var i=0; i< 1000; i++){
        ds[i] = {
            label: (1000*Math.random()).toString(),
            data: [{
                x:10*Math.random(),
                y:10*Math.random(),
                r:5*Math.random()+8
            }],
            backgroundColor:'#FF89AA'
        };
    }

    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET');
    res.set('Content-Type', 'text/plain');
    res.send(JSON.stringify({
        datasets: ds
    }));
});

var PORT = process.env.PORT || 1140;

var SERVER_ADDRESS = "http://young-plateau-61675.herokuapp.com";

function updatePrices() {
    $.post(SERVER_ADDRESS, {request: "stockPrice"}, function (data) {
        var jsonReceived = $.parseJSON(data);
        console.log(jsonReceived.goldSellPrice.toString());
    });
}

var server = app.listen(PORT, function(){
    var host = server.address().address;
    var port = server.address().port;

    console.log('Started Server at %s:%s', host, port);
});

updatePrices();