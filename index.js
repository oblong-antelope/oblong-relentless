var express = require('express');
var app = express();
var postRequest = require('request');

var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

var DATASET = [];
var hSet = new Set();
var MAX_HASH = 30;


var TOTAL_GROUPS = 10;
var CURRENT_GROUP = 0;

app.post('/', function(req, res) {
    //console.log(req.body.origin);

    if(req.body.origin=='100'){
        console.log('started off');
        startOff();
    }

    ds = formDataSets(req.body.origin);

    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'POST');
    res.set('Content-Type', 'text/plain');
    res.send(JSON.stringify({
        datasets: ds
    }));
});

function startOff(){
    app.put('/', function(req, res){
        //pave the way for a new hset
        var EMPTY_HASH_TIMER = setInterval(function() {
            if(hSet.size==0 && TOTAL_GROUPS<20) {
                addDataSetGroupByLinkReturnInterest('/api/people/' + Math.random().toString().slice(-3));
                clearInterval(EMPTY_HASH_TIMER);
                TOTAL_GROUPS++;
            }
        }, 10000);

        var HASH_ADD_TIMER = setInterval(function(){
            if(hSet.size>MAX_HASH-2){
                addDataSetGroupByHash('#' + Math.floor(Math.random() * 16777215).toString(16), Math.random()*40, Math.random()*40);
                clearInterval(HASH_ADD_TIMER);
            }
        }, 10000);
    });
}

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
                backgroundColor:DATASET[i].backgroundColor
            };
            j++;

        //}
    }
    return ds;
}



var SERVER_ADDRESS = "https://oblong-adventures.herokuapp.com";
function updatePrices() {

    //displays all datapoints up to MAX_PT
    //var MAX_PT = 1000;
    /*for(var i=1; i<MAX_PT; i++){
        addDataSetGroup('#' + Math.floor(Math.random() * 16777215).toString(16), 5, 5, i);
    }*/

    var startIdx = 24;
    addDataSetGroupByLinkReturnInterest('/api/people/'+startIdx);

    var HASH_ADD_TIMER = setInterval(function(){
        if(hSet.size>MAX_HASH-2){
            addDataSetGroupByHash('#00FF00', 10, 10);
            clearInterval(HASH_ADD_TIMER);
        }
    }, 1000);
}




function addDataSetGroupByLinkReturnInterest(link){
    postRequest.get(SERVER_ADDRESS + link, function (err, response, body) {
        try {
            var parBody = JSON.parse(body);
            console.log(link);
            var keywords = parBody.keywords;

            for(var keys in keywords){
                getPeopleOfSimilarInterests(keys);
            }
        }catch(e){
            console.log(link + ' failed ' + e);
        }
    });
}

function getPeopleOfSimilarInterests(topicKeyword){
    console.log(topicKeyword);
    postRequest.get(SERVER_ADDRESS + '/api/keywords/' + topicKeyword, function (err, response, body) {
        try {
            var parBody = JSON.parse(body);
            var t = 0;
            while(parBody.profiles[t]!=null && hSet.size<MAX_HASH) {
                hSet.add(parBody.profiles[t].link);
                t++;
            }
        }catch(e){console.log(e);}
    });
}


function addDataSetGroupByHash(dotColor, xOrigin, yOrigin){
    var i = 30*CURRENT_GROUP;
    console.log('at adding pt' + hSet.size);
    hSet.forEach(function(link){
        console.log(link);
        addDataSetGroupWithLink(dotColor, xOrigin, yOrigin, link, i);
        i++;
        hSet.delete(link);
    });
    CURRENT_GROUP++;

    //pave the way for a new hset
    var EMPTY_HASH_TIMER = setInterval(function() {
        if(hSet.size==0 && TOTAL_GROUPS<20) {
            addDataSetGroupByLinkReturnInterest('/api/people/' + Math.random().toString().slice(-3));
            clearInterval(EMPTY_HASH_TIMER);
            TOTAL_GROUPS++;
        }
    }, 10000);

    var HASH_ADD_TIMER = setInterval(function(){
        if(hSet.size>MAX_HASH-2){
            addDataSetGroupByHash('#' + Math.floor(Math.random() * 16777215).toString(16), Math.random()*40, Math.random()*40);
            clearInterval(HASH_ADD_TIMER);
        }
    }, 10000);
}

function addDataSetGroupWithLink(dotColor, xOrigin, yOrigin, link, i){
    postRequest.get(SERVER_ADDRESS + link, function (err, response, body) {
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



/*function addDataSetGroup(dotColor, xOrigin, yOrigin, i){
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
}*/
