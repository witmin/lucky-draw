/**
 * Created by millie.lin on 12/9/13.
 */
(function($, window, document) {

    var machine = new Machine(function(candidates) {
        // Make it empty for now
    }, function(poorMan) {

        // TODO convert these to React style
        $('.main-container').removeClass('show animated fadeOutUp');
        $('.main-container').addClass('hide');
        $('#rolling-view-container').addClass('show animated fadeInDown');
        var itemsArr = [];
        var $items = $('.item-list li').clone().each(function(i, v){
            itemsArr[i] = $('<li>').append($(v).text());
        });
        var posterAngle = 360 / itemsArr.length;
        var $rolling = $('.rolling-list');
        $rolling.empty();
        var winHeight = $(window).height();

        function circlarizeList(items) {
            for (var i = 0; i < items.length; i++) {
                var transform = 'rotateX(' + (posterAngle * i) + 'deg) translateZ(' + 400 + 'px)';
                $rolling.append(items[i].css('-webkit-transform', transform));
                $rolling.append(items[i].css('transform', transform));
            }
        }

        var finalRotation = 0;
        var finalItem = null;
        for (var i = 0; i < itemsArr.length; i++) {
            var name = itemsArr[i].text();
            if (name == poorMan) {
                finalRotation = 360 - posterAngle * i;
                finalItem = itemsArr[i];
                break;
            }
        }

        circlarizeList(itemsArr);
        $rolling.find('li').css({
            'font-size': winHeight/85 + 'em'
        });
        $rolling.css('-webkit-transition-duration', '0s');
        $rolling.css('transition-duration', '0s');
        $rolling.css('height', $rolling.find('li').height());
        $('.mask').css({
            'height': winHeight/2.6
        });

        $rolling.css('-webkit-transform', 'rotateX(' + finalRotation +'deg)');
        $rolling.css('-webkit-transition-duration', '5s');
        $rolling.css('transform', 'rotateX(' + finalRotation +'deg)');
        $rolling.css('transition-duration', '5s');
        $('#winner-span').text(poorMan);
        setTimeout(function() {
            finalItem.addClass('selected');
        }, 5000);
        setTimeout(function() {
            $('.main-container').removeClass('show animated fadeOutUp');
            $('.main-container').addClass('hide');
            $('#result-view-container').addClass('show animated fadeInDown');
        }, 5500);
    });
    window.machine = machine;

    $(document).ready(function(){

//    Tooltip
        $('.tooltip-container').mouseenter(function(){
            $('.tooltip').slideDown('fast');

        }).mouseleave(function(){
            $('.tooltip').slideUp('fast');
        });

//        Toggle Views
        function showEditListView() {
            $('.main-container').removeClass('show animated fadeOutUp');
            $('.main-container').addClass('hide');
            $('#edit-item-container').addClass('show animated fadeInDown');
        }

        $('.logo').click(function(){
            showEditListView();
        });
        function showStartView() {
            $('.main-container').removeClass('show animated fadeOutUp');
            $('.main-container').addClass('hide');
            $('#start-view-container').addClass('show animated fadeInDown');
        }

        $('#edit-item-container .btn-done').click(function(){
            showStartView();
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
                'margin-top': winHeight/2 - winHeight/40
            });
//            $('.rolling-list li').css({
//                'font-size': winHeight/20
//            });
//            $('#mask-top').css({
//                'height': winHeight/2.5
//            });
//            $('#mask-bottom').css({
//
//                'height':winHeight/10,
//                'top': winHeight/1.8
//            });

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
        };

        updateStartButtonStyle();
        $(window).resize(function(){
            updateStartButtonStyle();
        });

        function go() {
            if ($('.item-list li').length > 0) {

                machine.rand();
            } else {
                showEditListView();
            }
        }

        $('.btn-start').bind('click', function() {
            go();
        });
        $('body').on('keydown', function(e) {
            if ((e.keyCode || e.which) == 13 && $('.btn-start').is(':visible')) {
                go();
            }
        });

//        Load Start Button View
        $('.btn-start').mouseenter(function(){
            $(this).children('.fa-compass').removeClass('show');
            $(this).children('.fa-compass').addClass('hide rotateOut');
            $(this).children('.text').removeClass('hide flipOutX');
            $(this).children('.text').addClass('show flipInX');
        });

    });
})(jQuery, window, document);