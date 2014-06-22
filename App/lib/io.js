/**
 * User: Mike Chung
 * Date: 22/6/14
 * Time: 8:24 PM
 */
var io = require('socket.io')();

io.emitCandidates = function(candidates) {
    io.sockets.emit('candidates', candidates);
};

io.emitRandResult = function(poorMan) {
    io.sockets.emit('poorMan', {poorMan: poorMan});
};

module.exports = io;