$(document).ready(function() {
    console.log("ready");

    // The following dynamically moves the popup based size / orientation of screen (or window), essentially keeping is centered
    $(window).resize(function() {
        updatePopup();
    });
});

var openPopup = function() {
    //$(buttonID).prop("disabled", true);
    $("#roomView").removeClass('hidden');
    $("#roomView").fadeIn();
    //$("#overlay-bg").fadeIn();
    updatePopup();
}

function closePopup() {
    //$("#model-open-button").prop("disabled", false);
    $("#roomView").fadeOut();
    $("#roomView").addClass('hidden');

}
function killPopup(){
    $("#roomView").addClass('hidden');
}

function updatePopup() {
    var $popupContent = $("#roomView");
    // Compute the height and width of the current window for centering
    var top = "50px"; //center the box vertically
    var left = ($(window).width() - $popupContent.outerWidth()) / 2; //center the box horizontally
    $popupContent.css({
        'top' : top,
        'left' : left
    });
}