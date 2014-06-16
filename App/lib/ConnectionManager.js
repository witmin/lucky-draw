/**
 * User: Mike Chung
 * Date: 15/12/13
 * Time: 8:01 PM
 */
"use strict";

var _ = require('lodash');

var ConnectionManager = function() {
    var connections = [];

    return {
        push: function(conn) {
            connections.push(conn);
        },
        remove: function(conn) {
            _.remove(connections, conn);
        },
        broadcast: function(message) {
            var noOfConnection = connections.length;
            for (var i = 0; i < noOfConnection; i++) {
                connections[i].write(message);
            }
        }
    };
};

module.exports = new ConnectionManager();