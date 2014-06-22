var Machine = function(candidatesUpdateHandler, resultUpdateHandler) {
    var updateCandidates = candidatesUpdateHandler;
    var updateResult = resultUpdateHandler;

    var socket = io.connect();
    socket.on('candidates', function (data) {
        updateCandidates(data);
    });
    socket.on('poorMan', function (data) {
        updateResult(data.poorMan);
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
        registerResultUpdateHandler: function(handler) {
            validateHandler(handler);
            updateResult = handler;
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
        }
    }
};