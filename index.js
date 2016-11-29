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
    //console.log(req.body.origin);

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
        if(DATASET[i]==null){continue;}
        //if(DATASET[i].x>0 && DATASET[i].y>0) {
            ds[j] = {
                label: DATASET[i].label,
                data:[{
                    x:DATASET[i].x,
                    y:DATASET[i].y,
                    r:DATASET[i].r,
                }],
                backgroundColor:/*DATASET[i].backgroundColor*/'#'+Math.floor(Math.random()*16777215).toString(16)
            };
            j++;

        //}
    }
    return ds;
}



var SERVER_ADDRESS = "https://oblong-adventures.herokuapp.com";
function updatePrices() {

    var i = 0;
    setInterval(function(){
        addDataSetGroup('#' + Math.floor(Math.random() * 16777215).toString(16), 5, 5, i);
        i++;
    }, 100);
    /*for(var i=990; i<1000; i++){
        addDataSetGroup('#' + Math.floor(Math.random() * 16777215).toString(16), 5, 5, i);
    }*/
    /*for(var i=0; i< parseInt(1000); i++){
        DATASET[i] = {
            label: (1000*Math.random()).toString(),
            x:10*Math.random(),
            y:10*Math.random(),
            r:5*Math.random()+8,
            backgroundColor: '#'+Math.floor(Math.random()*16777215).toString(16)
        };
    }*/
}

function addDataSetGroup(dotColor, xOrigin, yOrigin, i){
    postRequest.get(SERVER_ADDRESS + '/api/people/' + i, function (err, response, body) {
        try {
            var parBody = JSON.parse(body);
            var name = parBody.name.title + ' ' + parBody.name.first
                + ' ' + parBody.name.initials + ' ' + parBody.name.last;
            var department = parBody.department;
            var label = ' [' + department + '] ' + name;
            DATASET[i] = {
                label: label,
                x: xOrigin + 3*Math.random(),
                y: yOrigin + 3*Math.random(),
                r: 5 * Math.random() + 8,
                backgroundColor: dotColor
            };
            console.log(i);
        }catch(e){
            console.log(i + ' failed ' + e);
        }
    });
}

updatePrices();



var PORT = process.env.PORT || 1140;
var server = app.listen(PORT, function(){
    var host = server.address().address;
    var port = server.address().port;

    console.log('Started Server at %s:%s', host, port);
});
