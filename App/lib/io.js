/**
 * User: Mike Chung
 * Date: 22/6/14
 * Time: 8:24 PM
 */
var io = require('socket.io')();

function boardcast(eventName, data) {
    io.sockets.emit(eventName, data);
}

io.emitCandidates = function(candidates) {
    boardcast('candidates', candidates);
};

io.emitRandResult = function(poorMan) {
    boardcast('poorMan', {poorMan: poorMan});
};

io.emitIsWithoutReplacement = function(isWithoutReplacement) {
    boardcast('isWithoutReplacement', isWithoutReplacement);
};

io.emitNumberOfDraws = (numberOfDraws) => {
    boardcast("numberOfDraws", numberOfDraws);
};

module.exports = io;