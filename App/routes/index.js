var express = require('express'),
    router = express.Router(),
    candidates = require('../conf').preloadCandidates,
    isWithoutReplacement = false,
    _ = require('lodash'),
    io = require('../lib/io');

router.post("/addCandidate", function(req, res) {
    var val = req.param('candidate');
    if (val && val !== "") {
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

router.post('/setWithReplacement', function(req, res) {
    isWithoutReplacement = req.param('isWithoutReplacement') === "true";
    io.emitIsWithoutReplacement(isWithoutReplacement);
    res.end();
});

router.get('/rand', function(req, res) {
    var randomNumber = _.random(candidates.length - 1),
        poorMan = candidates[randomNumber];
    io.emitRandResult(poorMan);
    if (isWithoutReplacement) {
        candidates = _.without(candidates, poorMan);
        boardcastCandidates();
    }
    res.end();
});

io.on('connection', function(socket) {
    socket.emit('candidates', candidates);
    socket.emit('isWithoutReplacement', isWithoutReplacement);
});

var boardcastCandidates = function() {
        io.emitCandidates(candidates);
    };

module.exports = router;
