/**
 * Created by millie.lin on 12/9/13.
 */
(function($, window, document) {

    $(document).ready(function(){

        $('button[title="Add"]').bind('click', function() {
/*            var textField = $('#new-candidate');
            machine.addCandidate(textField.val());
            textField.val('');*/
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
        $('#rolling-view-container').click(function(){
            $('.main-container').removeClass('show animated fadeOutUp');
            $('.main-container').addClass('hide');
            $('#result-view-container').addClass('show animated fadeInDown');
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
                'font-size': winHeight/($(this).width())*15  + 'em'
            });
            $('.btn-start .text').css({
                'font-size': winHeight/($(this).width())*15  + 'em'
            });
            $('.btn-start span.text').css({
                'font-size': winHeight/($(this).width())*10  + 'em'
            });

            //Rolling List
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

            //Result View
            $('.winner').css({
                'font-size': winHeight/85 + 'em',
                'margin-top': winHeight/3
            });
            $('#result-view-container .btn-start').css({
                'height' :  winHeight/5,
                'width' : winHeight/5,
                'border-radius': ($(this).width())/2
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


    });
})(jQuery, window, document);