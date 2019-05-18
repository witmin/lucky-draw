/**
 * Created by millie.lin on 12/9/13.
 */
(function ($, window, document) {

    window.machine = new Machine();

//        Toggle Views
    function showEditListView() {
        $('.main-container').removeClass('show animated fadeOutUp');
        $('.main-container').addClass('hide');
        $('#edit-item-container').addClass('show animated fadeInDown');
    }

    window.showEditListView = showEditListView;

    $(document).ready(function () {

//    Tooltip
        $('.tooltip-container').mouseenter(function () {
            $('.tooltip').slideDown('fast');

        }).mouseleave(function () {
            $('.tooltip').slideUp('fast');
        });


        $('.logo').click(function () {
            showEditListView();
        });

        function showStartView() {
            $('.main-container').removeClass('show animated fadeOutUp');
            $('.main-container').addClass('hide');
            $('#start-view-container').addClass('show animated fadeInDown');
        }

        $('#edit-item-container .btn-done').click(function () {
            showStartView();
        });

//    Define the responsive round START button
        var winHeight = $(window).height();

        var updateStartButtonStyle = function () {
            winHeight = $(window).height();
            $('.btn-start').css({
                'height': winHeight / 1.5,
                'width': winHeight / 1.5,
                'border-radius': ($(this).width()) / 2
            });
            $('.btn-start i.fa-compass').css({
                'font-size': $('.btn-start').height() / 2.5
            });
            $('.btn-start span.text').css({
                'font-size': $('.btn-start').height() / 2.5
            });

            //Rolling List
            $('.rolling-list').css({
                'height': winHeight,
                'width': '100%',
                'overflow': 'hidden'
            });
            $('.rolling-list li').css({
                'font-size': winHeight / 20
            });
            $('#mask-top').css({
                'height': winHeight / 2.5
            });
            $('#mask-bottom').css({

                'height': winHeight / 10,
                'top': winHeight / 1.8
            });

            //Result View
            // $('.winner').css({
            //     'font-size': winHeight/100 + 'em'
            // });

            $('#result-view-container .btn-start').css({
                'height': winHeight / 5,
                'width': winHeight / 5,
                'border-radius': ($(this).width()) / 2,
                'margin-top': winHeight / 8
            });
            $('#result-view-container .btn-start i.fa-compass').css({
                'font-size': $('#result-view-container .btn-start').height() / 2
            });
            $('#result-view-container .btn-start span.text').css({
                'font-size': $('#result-view-container .btn-start').height() / 5
            });
        };

        updateStartButtonStyle();
        $(window).resize(function () {
            updateStartButtonStyle();
        });

        function go() {
            if ($('.item-list li').length > 0) {

                machine.rand();
            } else {
                showEditListView();
            }
        }

        $('.btn-start').bind('click', function () {
            go();
        });
        $('body').on('keydown', function (e) {
            if ((e.keyCode || e.which) == 13 && $('.btn-start').is(':visible')) {
                go();
            }
        });

//        Load Start Button View
        $('.btn-start').mouseenter(function () {
            $(this).children('.fa-compass').removeClass('show');
            $(this).children('.fa-compass').addClass('hide rotateOut');
            $(this).children('.text').removeClass('hide flipOutX');
            $(this).children('.text').addClass('show flipInX');
        });

    });
})(jQuery, window, document);