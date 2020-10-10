$(document).ready(function(){
    $('#register').hide();
    $('#login-btn').click(function(){
        $('#login').show();
        $('#register').hide();
        $('#login-btn').addClass('active');
        $('#register-btn').removeClass('active');
    });
    $('#register-btn').click(function(){
        $('#login').hide();
        $('#register').show();
        $('#login-btn').removeClass('active');
        $('#register-btn').addClass('active');
    });
    
});