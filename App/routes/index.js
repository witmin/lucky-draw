var express = require('express'),
    router = express.Router(),
    candidates = [],
    connectionManager = require('../lib/ConnectionManager'),
    _ = require('lodash');

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
    candidates = _.remove(candidates, val);
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
    connectionManager.broadcast(JSON.stringify({poorMan:
        candidates[Math.ceil(randomNumber * candidates.length) - 1]}));
    res.end();
});

var boardcastCandidates = function() {
    connectionManager.broadcast(JSON.stringify({candidates: candidates}));
};

module.exports = router;
