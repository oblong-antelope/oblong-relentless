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
var MAX_HASH = 100;
var MAX_EPOCH_WAIT = 3;

var EPOCHS_WAITED = 0;

var TOTAL_GROUPS = 30;
var CURRENT_GROUP = 0;

var EPOCH_TIME = 5000;

var ENTIRE_WORLD_SIZE_X = 60;
var ENTIRE_WORLD_SIZE_Y = 100;


app.options("/*", function(req, res, next){
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
    res.send(200);
});


app.post('/', function(req, res) {
    //console.log(req.body.origin)

    var ds = formDataSets([req.body.x1, req.body.y1, req.body.x2, req.body.y2], res);


});

function formDataSets(origin, res){
    var ds = [];
    var j = 0;

    for(var i=0; i<DATASET.length && j<500; i++){
        if(DATASET[i]==null){continue;}

        ds[j] = {
            label: DATASET[i].label,
            data:[{
                x:DATASET[i].x,
                y:DATASET[i].y,
                r:DATASET[i].r
            }],
            backgroundColor:DATASET[i].backgroundColor,
            idx:DATASET[i].idx,
            department: DATASET[i].department,
            firstname: DATASET[i].firstname,
            surname: DATASET[i].surname,
            title: DATASET[i].title,
            initials: DATASET[i].initials
        };
        j++;
    }

    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', '*');
    res.set('Content-Type', 'text/plain');
    res.send(JSON.stringify({
        datasets: ds,
        legend: [{colour:'#FF0000', text:'Public Health Research'},
            {colour:'#00FF00', text:'Computational Chemistry'},
            {colour:'#0000FF', text:'Benzene Research'},
            {colour:'#00FFFF', text:'Chemical Engineering for Public Health'},
            {colour:'#FFFF00', text:'Heart'}]
    }));

}



var SERVER_ADDRESS = "http://battle.horse/oblong";
var SERVER_ADDRESS_NOOBLONG = "http://battle.horse";
function updatePrices() {

    var startIdx = 24;
    addDataSetGroupByLinkReturnInterest('/api/people/'+startIdx);

    var HASH_ADD_TIMER = setInterval(function(){
        if(hSet.size>MAX_HASH-2 || EPOCHS_WAITED>MAX_EPOCH_WAIT){
            EPOCHS_WAITED = 0;
            addDataSetGroupByHash(generateRandomColour(), Math.random()*ENTIRE_WORLD_SIZE_Y, Math.random()*ENTIRE_WORLD_SIZE_X);
            clearInterval(HASH_ADD_TIMER);
        }
        EPOCHS_WAITED++;
        console.log('hset size is --------------' + hSet.size + ' --- epochs ' + EPOCHS_WAITED);
    }, EPOCH_TIME);
}




function addDataSetGroupByLinkReturnInterest(link){
    postRequest.get(SERVER_ADDRESS + link, function (err, response, body) {
        try {
            var parBody = JSON.parse(body);
            console.log(link);
            var keywords = parBody.keywords;

            for(var keys in keywords){
                //we will assume our data is randomly drawn from an Exp(7) distribution
                //Warning: these values are not necessarily boundedaa
                if(keywords[keys]>Math.random()*10) {
                    getPeopleOfSimilarInterests(keys);
                }
            }
        }catch(e){
            setTimeout(addDataSetGroupByLinkReturnInterest, 30000, link);
            console.log(link + ' GET PEOPLE failed ' + e);
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
        }catch(e){
            setTimeout(getPeopleOfSimilarInterests, 30000, topicKeyword);
            console.log('KEYWORD ISSUE - ' + e);
        }
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

    //pave the way for a new hse
    var EMPTY_HASH_TIMER = setInterval(function() {
        if(hSet.size===0 && CURRENT_GROUP<TOTAL_GROUPS) {
            addDataSetGroupByLinkReturnInterest('/api/people/' + Math.floor(550*Math.random()));
            clearInterval(EMPTY_HASH_TIMER);
        }
    }, EPOCH_TIME);

    var HASH_ADD_TIMER = setInterval(function(){
        if(hSet.size>MAX_HASH-2 || EPOCHS_WAITED>MAX_EPOCH_WAIT){
            EPOCHS_WAITED = 0;
            addDataSetGroupByHash(generateRandomColour(), Math.random()*ENTIRE_WORLD_SIZE_Y, Math.random()*ENTIRE_WORLD_SIZE_X);
            clearInterval(HASH_ADD_TIMER);
        }
        EPOCHS_WAITED++;
        console.log('hset size is --------------' + hSet.size + ' --- epochs ' + EPOCHS_WAITED);
    }, EPOCH_TIME);
}

function generateRandomColour(){
    var col = '#' + Math.floor(Math.random() * 16777215).toString(16);
    while(col.length<7){
        col += 'F';
    }
    return col;
}

function addDataSetGroupWithLink(dotColor, xOrigin, yOrigin, link, i){
    postRequest.get(SERVER_ADDRESS_NOOBLONG + link, function (err, response, body) {
        console.log(body + ' aaaaaaaaaa ' + link);
        try {
            var parBody = JSON.parse(body);
            var name = parBody.name.title + ' ' + parBody.name.first
                + ' ' + parBody.name.initials + ' ' + parBody.name.last;
            var department = parBody.department;
            var label = ' [' + department + '] ' + name;
            DATASET[i] = {
                label: label,
                x: xOrigin + 8*Math.random(),
                y: yOrigin + 8*Math.random(),
                r: 5 * Math.random() + 8,
                backgroundColor: dotColor,
                idx: link,
                department: parBody.department,
                firstname: parBody.name.first,
                surname: parBody.name.last,
                title: parBody.name.title,
                initials: parBody.name.initials
            };
            console.log(i);
        }catch(e){
            setTimeout(addDataSetGroupWithLink, 30000, dotColor, xOrigin, yOrigin, link, i);
            console.log(i + ' ADD DATASET failed ' + e);
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
