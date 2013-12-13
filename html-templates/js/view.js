/**
 * Created by millie.lin on 12/9/13.
 */
(function($, window, document) {

    var Machine = function(updateCandidatesCallback, resultCallback) {

        var removeCandidate = function (v) {
            $.get('/removeCandidate', { 'candidate': v }, function() {});
        };

        updateCandidatesCallback = updateCandidatesCallback || function(candidates) {

            var $candidateList = $('#candidate ul');
            $candidateList.empty();
            $.each(candidates, function(i, v) {
                $candidateList.append($("<li></li>").append(v).append($('<button></button>').text('remove').bind('click', function() {
                    removeCandidate(v);
                })));
            });
        };

        resultCallback = resultCallback || function(poorMan) {
            $('#poor-man').text(poorMan);
        };

        var sockjs_url = '/sock';
        var sockjs = new SockJS(sockjs_url);

        sockjs.onopen    = function()  {

        };

        sockjs.onmessage = function(e) {
            var obj = JSON.parse(e.data);
            // Super lazy implementation
            if (obj.candidates) {
                updateCandidatesCallback(obj.candidates);
            } else if (obj.poorMan) {
                resultCallback(obj.poorMan);
            }

        };

        sockjs.onclose   = function()  {

        };

        var $candidate = $('#candidate form');
        $candidate.submit(function() {

            return false;
        });

        $('#rand').bind('click', function() {
            $.get('/rand', {}, function(){});
        });

        // The public API encapsulated the data accessing logic
        return {
            addCandidate: function(v) {
                $.get('/addCandidate', {'candidate': v}, function() {});
            },
            removeCandidate: removeCandidate,
            clearCandidates: function() {
                $.get('/clearCandidates', {}, function() {});

            },
            rand: function() {
                $.get('/rand', {}, function(){});
            }
        }
    };

    $(document).ready(function(){
        var machine = new Machine(function(candidates) {
            var $candidateList = $('ul.item-list');
            $candidateList.empty();
            $.each(candidates, function(i, v) {
                $candidateList.append($("<li></li>").prop('id', v).mouseenter(function(){
                    $(this).addClass("hover");
                }).mouseleave(function(){
                        $(this).removeClass("hover");
                    })
                    .append(v)
                    .append($('<span href="" class="delete"><i class="fa fa-minus-circle"></i></span>').bind('click', function() {
                        // Lazy implementation :P
                        machine.removeCandidate($(this).parent().prop('id'));
                    })));
            });
        }, function(poorMan) {
            function loopAndLoop(counter) {
                var itemsArr = [];
                var $items = $('.item-list li').clone().each(function(i, v){
                    itemsArr[i] = $('<li>').append($(v).text());
                });
                // this is not animation...
                var $rolling = $('ul.rolling-list');
                var newItemsOrder = itemsArr.slice((counter - 2) % $items.length).concat(itemsArr.slice(0, (counter - 2) % $items.length));
                $rolling.empty();
                for (var i = 0; i < newItemsOrder.length; i++) {
                    $rolling.append(newItemsOrder[i]);
                }

                var nextTime = 100;
                $('.rolling-list').css({
                    'height': winHeight-60,
                    'width': winHeight
                });
                $('.rolling-list li').css({
                    'font-size': winHeight/85 + 'em',
                    'margin-top': '10px'
                });
                $('.mask').css({
                    'height': winHeight/2.6
                });
                if (counter > $items.length) {

                    if ($($items.get((counter) % $items.length)).prop('id') == poorMan) {

                        $('#winner-span').text(poorMan);
                        newItemsOrder[2].css('background-color', 'purple');
                        setTimeout(function() {

                            $('.main-container').removeClass('show animated fadeOutUp');
                            $('.main-container').addClass('hide');
                            $('#result-view-container').addClass('show animated fadeInDown');
                        }, 1000);
                        return;
                    } else if ($($items.get((counter+1) % $items.length)).prop('id') == poorMan) {
                        nextTime = 800;
                    } else if ($($items.get((counter+2) % $items.length)).prop('id') == poorMan) {
                        nextTime = 500;
                    } else if ($($items.get((counter+3) % $items.length)).prop('id') == poorMan) {
                        nextTime = 300;
                    }
                }
                if (counter < $items.length * 2) {

                    setTimeout(function() {
                        loopAndLoop(++counter);
                    }, nextTime);
                }
            }
            loopAndLoop(0);
        });

        $('button[title="Add"]').bind('click', function() {
            var textField = $('#new-candidate');
            machine.addCandidate(textField.val());
            textField.val('');
        });

        $('#edit-item-form').submit(function() {
            return false;
        });

//    Page Loading Animate
        $('.logo').addClass('animated slideInLeft');

//    Tooltip
        $('.tooltip').hide();
        $('.tooltip-container').mouseenter(function(){
            $('.tooltip').slideDown('fast');

        });
        $('.tooltip-container').mouseleave(function(){
            $('.tooltip').slideUp('fast');
        });

//        Toggle Views
        $('#start-view-container').addClass('animated fadeInDown');
        $('#edit-item-container').addClass('hide');
        $('#rolling-view-container').addClass('hide');
        $('#result-view-container').addClass('hide');
        $('.logo').click(function(){
            $('.main-container').removeClass('show animated fadeOutUp');
            $('.main-container').addClass('hide');
            $('#edit-item-container').addClass('show animated fadeInDown');
        });
        $('#edit-item-container .btn-done').click(function(){
            $('.main-container').removeClass('show animated fadeOutUp');
            $('.main-container').addClass('hide');
            $('#start-view-container').addClass('show animated fadeInDown');
        });
        $('.btn-start').click(function(){
            $('.main-container').removeClass('show animated fadeOutUp');
            $('.main-container').addClass('hide');
            $('#rolling-view-container').addClass('show animated fadeInDown');
        });
//        $('#rolling-view-container').click(function(){
//            $('.main-container').removeClass('show animated fadeOutUp');
//            $('.main-container').addClass('hide');
//            $('#result-view-container').addClass('show animated fadeInDown');
//        });


//    Define the responsive round START button
        var winHeight = $(window).height();

        var updateStartButtonStyle = function(){
            winHeight = $(window).height();
            $('.btn-start').css({
                'height' :  winHeight/1.5,
                'width' : winHeight/1.5,
                'border-radius': ($(this).width())/2
            });
            $('.btn-start i.fa-compass').css({
                'font-size': winHeight/($(this).width())*15  + 'em'
            });
            $('.btn-start span.text').css({
                'font-size': winHeight/($(this).width())*10  + 'em'
            });

            //Rolling List
            $('.rolling-list').css({
                'height': winHeight-60,
                'width': '100%',
                'overflow':'hidden'
            });
            $('.rolling-list li').css({
                'font-size': winHeight/15,
                'margin-top': '10px'
            });
            $('.mask').css({
                'height': winHeight/2.6
            });

            //Result View
            $('.winner').css({
                'font-size': winHeight/100 + 'em',
                'margin-top': winHeight/3
            });
            $('#result-view-container .btn-start').css({
                'height' :  winHeight/6,
                'width' : winHeight/6,
                'border-radius': ($(this).width())/2
            });
            $('#result-view-container .btn-start i.fa-compass').css({
                'font-size': winHeight/($(this).width())*5  + 'em'
            });
            $('#result-view-container .btn-start span.text').css({
                'font-size': winHeight/($(this).width())*3  + 'em'
            });
        }

        updateStartButtonStyle();
        $(window).resize(function(){
            updateStartButtonStyle();
        });

        $('.btn-start').bind('click', function() {
            machine.rand();
        });

//        Load Start Button View
        $('.btn-start .text').addClass('hide animated');
        $('.btn-start .fa-compass').addClass('show animated rotateIn');
        $('.btn-start').mouseenter(function(){
            $(this).children('.fa-compass').removeClass('show');
            $(this).children('.fa-compass').addClass('hide rotateOut');
            $(this).children('.text').removeClass('hide flipOutX');
            $(this).children('.text').addClass('show flipInX');
        });

        $('.delete-all').bind('click', function() {
            machine.clearCandidates();
        });


    });
})(jQuery, window, document);