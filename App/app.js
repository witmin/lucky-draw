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
var node_static = require('node-static');
var url = require('url');
var serviceManager = require('./lib/ServiceManager');
var connectionManager = require('./lib/ConnectionManager');

var candidates = [];

var boardcastCandidates = function() {
    connectionManager.broadcast(JSON.stringify({candidates: candidates}));
};

serviceManager.register('addCandidate', function(req, res, param) {
	var val = param.candidate;
	if(val && val !== ""){
		candidates.push(param.candidate);
		boardcastCandidates();
	}
    res.end();
});

serviceManager.register('removeCandidate', function(req, res, param) {
    candidates = candidates.remove(param.candidate);
    res.end();
    boardcastCandidates();
});

serviceManager.register('clearCandidates', function(req, res) {
    candidates = [];
    res.end();
    boardcastCandidates();
});

serviceManager.register('rand', function(req, res) {
    res.end();
    var randomNumber = Math.random();
    connectionManager.broadcast(JSON.stringify({poorMan:
        candidates[Math.ceil(randomNumber * candidates.length) - 1]}));
});

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

var staticServer = new node_static.Server(__dirname + "/../html-templates");

var server = http.createServer(function(req, res) {
    var uri;
    var requestUrl = req.url;
    var urlParts = url.parse(requestUrl, true);
    uri = urlParts.pathname;
    var serviceName = uri.substring(1);
    if (serviceManager.isService(serviceName)) {
        serviceManager.serve(serviceName, req, res, urlParts.query);
    } else {
        staticServer.serve(req, res);
    }
});

echo.installHandlers(server, {prefix:'/sock'});

var port = 8888;
console.log(' [*] Listening on 0.0.0.0:' + port );
server.listen(port, '0.0.0.0');