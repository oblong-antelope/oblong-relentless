var express = require('express');
var app = express();
 
app.get('/', function(req, res) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET');
    res.set('Content-Type', 'text/plain');
    res.send(JSON.stringify({
        datasets: [
            {
                label: 'Phoebe Parker',
                data: [
                    {
                        x: 20,
                        y: 30,
                        r: 15
                    }
                ],
                backgroundColor:"#FF6384"
            },
            {
                label: 'Thomas Jones',
                data: [
                    {
                        x: 25,
                        y: 10,
                        r: 12
                    }
                ],
                backgroundColor:"#FF6384"
            }]
    }));
});

var PORT = process.env.PORT || 1140;
 
var server = app.listen(PORT, function(){
    var host = server.address().address;
    var port = server.address().port;

    console.log('Started Server at %s:%s', host, port);
});
