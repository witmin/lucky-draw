var Machine = function(candidatesUpdateHandler, resultUpdateHandler) {
    var updateCandidates = candidatesUpdateHandler;
    var updateResult = resultUpdateHandler;
    var sockjs_url = '/sock';
    var sockjs = new SockJS(sockjs_url);

    sockjs.onopen    = function() {};

    sockjs.onmessage = function(e) {
        var obj = JSON.parse(e.data);
        // Super lazy implementation
        if (obj.candidates) {
            updateCandidates(obj.candidates);
        } else if (obj.poorMan) {
            updateResult(obj.poorMan);
        }
    };

    sockjs.onclose = function() {};

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