/**
 * Created by millie.lin on 12/9/13.
 */
(function($, window, document) {

    $(document).ready(function(){

        var machine = new Machine(function(candidates) {
            // Make it empty for now
        }, function(poorMan) {

            // TODO convert these to React style
            $('.main-container').removeClass('show animated fadeOutUp');
            $('.main-container').addClass('hide');
            $('#rolling-view-container').addClass('show animated fadeInDown');

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
                var winHeight = $(window).height();
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
                'font-size': $('.btn-start').height()/2.5
            });
            $('.btn-start span.text').css({
                'font-size': $('.btn-start').height()/2.5
            });

            //Rolling List
            $('.rolling-list').css({
                'height': winHeight,
                'width': '100%',
                'overflow':'hidden'
            });
            $('.rolling-list li').css({
                'font-size': winHeight/20
            });
            $('#mask-top').css({
                'height': winHeight/2.5
            });
            $('#mask-bottom').css({

                'height':winHeight/10,
                'top': winHeight/1.8
            });

            //Result View
            $('.winner').css({
                'font-size': winHeight/100 + 'em',
                'margin-top': winHeight/3.5
            });
            $('#result-view-container .btn-start').css({
                'height' :  winHeight/5,
                'width' : winHeight/5,
                'border-radius': ($(this).width())/2,
                'margin-top': winHeight/8
            });
            $('#result-view-container .btn-start i.fa-compass').css({
                'font-size': $('#result-view-container .btn-start').height()/2
            });
            $('#result-view-container .btn-start span.text').css({
                'font-size': $('#result-view-container .btn-start').height()/5
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

        window.machine = machine;
    });
})(jQuery, window, document);