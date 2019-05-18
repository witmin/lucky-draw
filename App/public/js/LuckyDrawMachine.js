(function (io) {

    var Machine = function (resultUpdateHandler) {
        var updateResult = resultUpdateHandler,
            updateCandidates = function () {

            },
            updateIsWithoutReplacement = function () {

            },
            updateNumberOfDraws = function () {

            },
            updateSettings = () => {
            };

        var socket = io.connect();
        socket.on('candidates', function (data) {
            updateCandidates(data);
        });
        socket.on('poorMan', function (data) {
            updateResult(data.poorMan);
        });
        socket.on('isWithoutReplacement', function (data) {
            updateIsWithoutReplacement(data);
        });
        socket.on('numberOfDraws', function (data) {
            updateNumberOfDraws(data);
        });
        socket.on('settings', (data) => {
            updateSettings(data);
        });

        function validateHandler(handler) {
            if (!handler || typeof handler != "function") {
                throw "Handler should be a function";
            }
        }

        // The public API encapsulated the data accessing logic
        return {
            registerCandidatesUpdateHandler: function (handler) {
                validateHandler(handler);
                updateCandidates = handler;
            },
            onResultChange: (handler) => {
                validateHandler(handler);
                updateResult = handler;
            },
            onSettingChange: (handler) => {
                validateHandler(handler);
                updateSettings = handler;
            },
            addCandidate: function (v) {
                $.post('/addCandidate', {'candidate': v});
            },
            removeCandidate: function (v) {
                $.post('/removeCandidate', {'candidate': v});
            },
            clearCandidates: function () {
                $.post('/clearCandidates');
            },
            rand: function () {
                $.get('/rand');
            },
            setSettings: (settings) => {

                fetch('/settings', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(settings)
                });
            }
        }
    };

    this.Machine = Machine;

}).apply(this, [io]);
