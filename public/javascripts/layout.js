$(document).ready(function(){
    $('#dropdownuser').hide();
    $('#userbtn').click(function(){
        $('#dropdownuser').slideToggle(100);
    });
    $('#begin-translation').click(function(){
        $('#translate-modal').fadeIn(1000);
    });
    $('#translateclose').click(function(){
        $('#translate-modal').fadeOut(500);
    });
    $('button.navbar-toggler').click(function(){
        $('#navbarSupportedContent.collapse').slideToggle(500);
    });
    $('#slide-toggler').click(function(){
        $('#slide-modal').fadeIn(500);
        $('#sidebar').fadeIn(500);
    });
    $('#slide-modal').click(function(){
        $('#slide-modal').hide();
        $('#sidebar').hide();
    });
    
    // $('#translate-modal').click(function(){
    //     $('#translate-modal').hide();
    // });
});