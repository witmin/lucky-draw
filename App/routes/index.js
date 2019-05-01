var express = require('express'),
    router = express.Router(),
    candidates = require('../conf').preloadCandidates,
    isWithoutReplacement = false,
    numberOfDraws = 1,
    _ = require('lodash'),
    io = require('../lib/io');

function deriveNumberOfDrawsAndEmit() {
    const newNDraws = Math.max(1, Math.min(candidates.length, numberOfDraws));
    if (newNDraws !== numberOfDraws) {
        numberOfDraws = newNDraws;
        io.emitNumberOfDraws(numberOfDraws);
    }
}

router.post("/addCandidate", function (req, res) {
    var val = req.param('candidate');
    if (val && val !== "") {
        candidates.push(val);
        boardcastCandidates();
        deriveNumberOfDrawsAndEmit();
    }
    res.end();
});

router.post('/removeCandidate', function (req, res) {
    var val = req.param('candidate');
    candidates = _.without(candidates, val);
    boardcastCandidates();
    deriveNumberOfDrawsAndEmit();
    res.end();
});

router.post('/clearCandidates', function (req, res) {
    candidates = [];
    boardcastCandidates();
    deriveNumberOfDrawsAndEmit();
    res.end();
});

router.post('/setWithReplacement', function (req, res) {
    isWithoutReplacement = req.param('isWithoutReplacement') === "true";
    io.emitIsWithoutReplacement(isWithoutReplacement);
    res.end();
});

router.post('/setNumberOfDraws', function (req, res) {
    numberOfDraws = +req.param('numberOfDraws');
    io.emitNumberOfDraws(numberOfDraws);
    res.end();
});

router.get('/rand', function (req, res) {
    const result = [];
    for (let i = 0; i < numberOfDraws; i++) {

        var randomNumber = _.random(candidates.length - 1),
            poorMan = candidates[randomNumber];
        result.push(poorMan);
        if (isWithoutReplacement) {
            candidates = _.without(candidates, poorMan);
        }
    }

    io.emitRandResult(result);
    if (isWithoutReplacement) {

        boardcastCandidates();
    }
    res.end();
});

router.get('/configs', (req, res) => {
    res.json({
        candidates,
        isWithoutReplacement,
        numberOfDraws
    });
});

io.on('connection', function (socket) {
    socket.emit('candidates', candidates);
    socket.emit('isWithoutReplacement', isWithoutReplacement);
});

var boardcastCandidates = function () {
    io.emitCandidates(candidates);
};

module.exports = router;
