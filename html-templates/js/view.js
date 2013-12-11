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
                var $items = $('.item-list li');
                $items.removeClass('selected');
                $($items.get(counter % $items.length)).addClass('selected');
                var nextTime = 100;
                if (counter > $items.length) {

                    if ($($items.get((counter) % $items.length)).prop('id') == poorMan) {
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

// hover Added Items to add hover class
//        var deleteBtn = $('<span href="" class="delete"><i class="fa fa-minus-circle"></i></span>').bind('click', function() {
//            // Lazy implementation :P
//            machine.removeCandidate("");
//        });
//        $('.item-list li').append(deleteBtn);
//        $('.item-list li').children('.delete');
//        $('.item-list li').mouseenter(function(){
//            $(this).addClass("hover");
//        });
//        $('.item-list li').mouseleave(function(){
//            $(this).removeClass("hover");
//        });

//    Define the responsive round START button
        var winHeight = $(window).height();

        var updateStartButtonStyle = function(){
            winHeight = $(window).height();
            $('.start-btn').css({
                'height' :  winHeight/2,
                'width' : winHeight/2,
                'border-radius': ($(this).width())/2
            });
            $('.start-btn i.fa-compass').css({
                'font-size': winHeight/($(this).width())*10  + 'em'
            });
            $('.start-btn span.text').css({
                'font-size': winHeight/($(this).width())*10  + 'em'
            });
        }

        updateStartButtonStyle();
        $(window).resize(function(){
            updateStartButtonStyle();
        });

        $('.start-btn').bind('click', function() {
            machine.rand();
        });

        var textGo = $('');
        $('.start-btn').mouseenter(function(){
            $(this).children('i.fa-compass').hide();

        });

    });
})(jQuery, window, document);