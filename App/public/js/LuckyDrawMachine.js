(function(io) {

    var Machine = function(resultUpdateHandler) {
        var updateResult = resultUpdateHandler,
            updateCandidates = function() {

            },
            updateIsWithoutReplacement = function() {

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
            }
        }
    };

  this.Machine = Machine;

}).apply(this, [io]);
