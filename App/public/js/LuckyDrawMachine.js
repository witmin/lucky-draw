(function(io) {

    var Machine = function(resultUpdateHandler) {
        var updateResult = resultUpdateHandler,
            updateCandidates = function() {

            },
            updateIsWithoutReplacement = function() {

            },
            updateNumberOfDraws = function() {

            };

        var socket = io.connect();
        socket.on('candidates', function (data) {
            updateCandidates(data);
        });
        socket.on('poorMan', function (data) {
            updateResult(data.poorMan);
        });
        socket.on('isWithoutReplacement', function(data) {
            updateIsWithoutReplacement(data);
        });
        socket.on('numberOfDraws', function(data) {
            updateNumberOfDraws(data);
        });

        function validateHandler(handler) {
            if (!handler || typeof handler != "function") {
                throw "Handler should be a function";
            }
        }

        // The public API encapsulated the data accessing logic
        return {
            registerCandidatesUpdateHandler: function(handler) {
                validateHandler(handler);
                updateCandidates = handler;
            },
            registerUpdateIsWithoutReplacementHandler: function(handler) {
                validateHandler(handler);
                updateIsWithoutReplacement = handler;
            },
            registerUpdateNumberOfDrawHandler: function(handler) {
                validateHandler(handler);
                updateNumberOfDraws = handler;
            },
            addCandidate: function(v) {
                $.post('/addCandidate', {'candidate': v});
            },
            removeCandidate: function (v) {
                $.post('/removeCandidate', { 'candidate': v });
            },
            clearCandidates: function() {
                $.post('/clearCandidates');
            },
            rand: function() {
                $.get('/rand');
            },
            setWithoutReplacement: function(isWithoutReplacement) {
                $.post('/setWithReplacement', {isWithoutReplacement: isWithoutReplacement});
            },
            setNumberOfDraws: function(numberOfDraws) {
                $.post("/setNumberOfDraws", {numberOfDraws: +numberOfDraws})
            }
        }
    };

  this.Machine = Machine;

}).apply(this, [io]);
