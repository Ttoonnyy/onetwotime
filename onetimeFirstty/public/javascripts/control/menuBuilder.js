var menuCount = 0;
$('#mobileMenu').bind('click', function() {
    console.log("mobileMenu");
    if (menuCount % 2 === 0) {
        $('#myMenu').css('left', '0px');
        $('#myMenu').css('bottom', '0px');
        $('#myMenu').css('top', '300px');
        $('#myMenu').css('background-color', 'white');
        $('#myMenu').css('width', '100%');
        $('#myMenu').css('max-height', '400px');
    } else {
        $('#myMenu').css('left', '940px');
    }
    menuCount++;
});

$('a').mouseover(function(){
    $(this).removeClass('btn-default');
    $(this).addClass('btn-primary');
});
$('a').mouseout(function(){
    $(this).removeClass('btn-primary');
    $(this).addClass('btn-default');
});
