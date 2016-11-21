var express = require('express');
var app = express();
 
app.get('/', function(req, res) {
    var ds = [];
    for(int i=0; i< 100; i++){
        ds[i] = {
            label: 'abcd',
            data: [{
                x:10,
                y:10,
                r:10
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
