/**
 * User: Mike Chung
 * Date: 9/12/13
 * Time: 9:54 PM
 */
"use strict";

var http = require('http');
var sockjs = require('sockjs');
var node_static = require('node-static');
var url = require('url');

function parseQuery(query) {
    if (query == null){
        return null;
    }
    var queryArray = query.split('&');
    var queryAssoArray = [];
    for (var i = 0; i < queryArray.length; i++) {
        var v = queryArray[i];
        queryAssoArray[v.substring(0, v.indexOf('='))] = v.substring(v.indexOf('=') + 1);
    }
    return queryAssoArray;
}

var connections = [];

var services = [];

var candidates = [];

services['addCandidate'] = function(req, res, param) {
    candidates.push(param['candidate']);
    res.end();
    boardcast({candidate: candidates});
};

function boardcast(message) {
    for (var i = 0; i< connections.length; i++) {
        connections[i].write(message);
    }
}

var echo = sockjs.createServer();
echo.on('connection', function(conn) {
    connections.push(conn);
    conn.on('data', function(message) {
        boardcast(message);
    });
    conn.on('close', function() {

    });
});

var staticServer = new node_static.Server(__dirname + "/www");

var server = http.createServer(function(req, res) {
    var uri;
    var requestUrl = req.url;
    var urlParts = url.parse(requestUrl);
    uri = urlParts.pathname;
    var serviceName = uri.substring(1);
    if (typeof services[serviceName] != 'function') {
        staticServer.serve(req, res);
    } else {
        services[serviceName](req, res, parseQuery(urlParts.query));
    }
});

echo.installHandlers(server, {prefix:'/sock'});

var port = 8888;
console.log(' [*] Listening on 0.0.0.0:' + port );
server.listen(port, '0.0.0.0');