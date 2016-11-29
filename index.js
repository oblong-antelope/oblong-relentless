var express = require('express');
var app = express();
var postRequest = require('request');

var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

//25x40 cube is the entire spaceaa

var DATASET = [];
var hSet = new Set();
var MAX_HASH = 30;
var MAX_EPOCH_WAIT = 3;

var EPOCHS_WAITED = 0;

var TOTAL_GROUPS = 30;
var CURRENT_GROUP = 0;

app.post('/', function(req, res) {
    //console.log(req.body.origin);

    ds = formDataSets([req.body.x1, req.body.y1, req.body.x2, req.body.y2]);

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
    var leftb = origin[0];
    var rightb = origin[2];
    var upb = origin[1];
    var downb = origin[3];
    console.log(leftb + '  ' + rightb + '  ' + upb + '  ' + downb);

    for(var i=0; i<DATASET.length; i++){
        if(DATASET[i]==null){continue;}

        if(DATASET[i].x>leftb && DATASET[i].y>upb && DATASET[i].x<rightb && DATASET[i].y<downb) {
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
        }
    }
    ds[j] = {
        label: 'a',
        data: [{
            x: leftb,
            y: upb,
            r: 0.3
        }],
        backgroundColor:'#FFFFFF'
    }
    ds[j+1] = {
        label: 'a',
        data: [{
            x: rightb,
            y: downb,
            r: 0.3
        }],
        backgroundColor:'#FFFFFF'
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
        if(hSet.size===0 && CURRENT_GROUP<TOTAL_GROUPS) {
            addDataSetGroupByLinkReturnInterest('/api/people/' + Math.random().toString().slice(-3));
            clearInterval(EMPTY_HASH_TIMER);
        }
    }, 10000);

    var HASH_ADD_TIMER = setInterval(function(){
        if(hSet.size>MAX_HASH-2 || EPOCHS_WAITED>MAX_EPOCH_WAIT){
            EPOCHS_WAITED = 0;
            addDataSetGroupByHash(generateRandomColour(), Math.random()*40, Math.random()*25);
            clearInterval(HASH_ADD_TIMER);
        }
        EPOCHS_WAITED++;
        console.log('hset size is --------------' + hSet.size + ' --- epochs ' + EPOCHS_WAITED);
    }, 10000);
}

function generateRandomColour(){
    var col = '#' + Math.floor(Math.random() * 16777215).toString(16);
    while(col.length<7){
        col += 'F';
    }
    return col;
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
