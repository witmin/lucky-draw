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

});