/**
 * Created by millie.lin on 12/9/13.
 */
$(document).ready(function(){
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
    var deleteBtn = $('<a href="" class="delete"><i class="fa fa-minus-circle"></i></a>')
    $('.item-list li').append(deleteBtn);
    $('.item-list li').children('.delete');
    $('.item-list li').mouseenter(function(){
        $(this).addClass("hover");
    });
    $('.item-list li').mouseleave(function(){
        $(this).removeClass("hover");
    });

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

    var textGo = $('');
    $('.start-btn').mouseenter(function(){
        $(this).children('i.fa-compass').hide();

    });

});