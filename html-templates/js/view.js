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
});