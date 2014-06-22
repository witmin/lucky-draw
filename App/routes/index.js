var express = require('express'),
    router = express.Router(),
    candidates = [],
    _ = require('lodash'),
    io = require('../lib/io');

router.post("/addCandidate", function(req, res) {
    var val = req.param('candidate');
    if(val && val !== ""){
        candidates.push(val);
        boardcastCandidates();
    }
    res.end();
});

router.post('/removeCandidate', function(req, res) {
    var val = req.param('candidate');
    candidates = _.without(candidates, val);
    boardcastCandidates();
    res.end();
});

router.post('/clearCandidates', function(req, res) {
    candidates = [];
    boardcastCandidates();
    res.end();
});

router.get('/rand', function(req, res) {
    var randomNumber = Math.random();
    io.emitRandResult(candidates[Math.ceil(randomNumber * candidates.length) - 1]);
    res.end();
});

io.on('connection', function (socket) {
    socket.emit('candidates', candidates);
});

var boardcastCandidates = function() {
    io.emitCandidates(candidates);
};

module.exports = router;
