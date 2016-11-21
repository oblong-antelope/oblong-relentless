var express = require('express');
var app = express();
 
app.get('/', function(req, res) {
    var ds = [];
    for(var i=0; i< 100; i++){
        ds[i] = {
            label: 'abcd',
            data: [{
                x:10*Math.random(),
                y:10*Math.random(),
                r:10*Math.random()
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
 
var server = app.listen(PORT, function(){
    var host = server.address().address;
    var port = server.address().port;

    console.log('Started Server at %s:%s', host, port);
});
