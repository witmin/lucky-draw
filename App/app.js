/**
 * User: Mike Chung
 * Date: 9/12/13
 * Time: 9:54 PM
 */
"use strict";

Array.prototype.remove = function(e) {
    for (var i = 0; i < this.length; i++) {
        if (this[i] == e) {
            return this.slice(0, i).concat(this.slice(i+1));
        }
    }
    return this;
};

var http = require('http');
var sockjs = require('sockjs');
var express = require('express');
var url = require('url');
var connectionManager = require('./lib/ConnectionManager');

var app = express();

app.use(express.bodyParser());

app.post("/addCandidate", function(req, res) {
    var val = req.param('candidate');
    if(val && val !== ""){
        candidates.push(val);
        boardcastCandidates();
    }
    res.end();
});

app.post('/removeCandidate', function(req, res) {
    var val = req.param('candidate');
    candidates = candidates.remove(val);
    boardcastCandidates();
    res.end();
});

app.post('/clearCandidates', function(req, res) {
    candidates = [];
    boardcastCandidates();
    res.end();
});

app.get('/rand', function(req, res) {
    var randomNumber = Math.random();
    connectionManager.broadcast(JSON.stringify({poorMan:
        candidates[Math.ceil(randomNumber * candidates.length) - 1]}));
    res.end();
});

app.use(express.static(__dirname + '/www'));

var candidates = [];

var boardcastCandidates = function() {
    connectionManager.broadcast(JSON.stringify({candidates: candidates}));
};

var echo = sockjs.createServer();
echo.on('connection', function(conn) {
    connectionManager.push(conn);
    boardcastCandidates();
    conn.on('data', function(message) {

    });
    conn.on('close', function() {
        connectionManager.remove(conn);
    });
});

var server = http.createServer(app);

echo.installHandlers(server, {prefix:'/sock'});

var port = 8888;
console.log(' [*] Listening on 0.0.0.0:' + port );
server.listen(port, '0.0.0.0');