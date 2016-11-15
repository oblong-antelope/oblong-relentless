var express = require('express');
var app = express();
 
app.get('/', function(req, res) {
    var resultCSV = 'surname,x,y,z\n';
    for(var i=0.1; i<10; i++){
        resultCSV += 'David Carpenter,';
        resultCSV += i%48 + ',';
        resultCSV += i%3 + ',';
        resultCSV += i%5;
        resultCSV += '\n';
    }

    for(var i=0.1; i<12; i++){
        resultCSV += 'Peter Smith,';
        resultCSV += i%4+10 + ',';
        resultCSV += i%5+45 + ',';
        resultCSV += i%3;
        resultCSV += '\n';
    }

    for(var i=0.1; i<10; i++){
        resultCSV += 'Rachel Golightly,';
        resultCSV += i%8 + ',';
        resultCSV += i%5+12 + ',';
        resultCSV += i%4+20;
        resultCSV += '\n';
    }

    for(var i=0.1; i<12; i++){
        resultCSV += 'Kate Williamson,';
        resultCSV += i%4+10 + ',';
        resultCSV += i%6 + ',';
        resultCSV += i%5+3;
        resultCSV += '\n';
    }

    for(var i=0.1; i<12; i++){
        resultCSV += 'Aran Dhaliwal,';
        resultCSV += i%5+44 + ',';
        resultCSV += i%4-11 + ',';
        resultCSV += i%6+12;
        resultCSV += '\n';
    }

    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET');
    res.set('Content-Type', 'text/plain');
    res.send(resultCSV);
});

var PORT = process.env.PORT || 1140;
 
var server = app.listen(PORT, function(){
    var host = server.address().address;
    var port = server.address().port;

    console.log('Started Server at %s:%s', host, port);
});
