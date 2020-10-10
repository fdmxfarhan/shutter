$(document).ready(function(){
    $('#register').hide();
    var textNumber = 0;
    time = 0;
    function next(){
        textNumber %= 3;
        if(textNumber == 0){
            $('#text3').css({'right': '-100vw', 'transition-duration': '1s'});
            $('#text1').css({'right': '0', 'transition-duration': '0'}).delay(300).fadeIn(500);
            $('#img3').fadeOut(300);
            $('#img1').delay(300).fadeIn(500);
        }
        else if(textNumber == 1){
            $('#text1').css({'right': '-100vw', 'transition-duration': '1s'});
            $('#text2').css({'right': '0', 'transition-duration': '0'}).delay(300).fadeIn(500);
            $('#img1').fadeOut(300);
            $('#img2').delay(300).fadeIn(500);
        }
        else if(textNumber == 2){
            $('#text2').css({'right': '-100vw', 'transition-duration': '1s'});
            $('#text3').css({'right': '0', 'transition-duration': '0'}).delay(300).fadeIn(500);
            $('#img2').fadeOut(300);
            $('#img3').delay(300).fadeIn(500);
        }
    }
    function prev(){
        textNumber %= 3;
        if(textNumber == 0){
            $('#text2').css({'right': '100vw', 'transition-duration': '1s'});
            $('#text1').css({'right': '0'}).delay(300).fadeIn(500);
            $('#img2').fadeOut(300);
            $('#img1').delay(300).fadeIn(500);
        }
        else if(textNumber == 1){
            $('#text3').css({'right': '100vw', 'transition-duration': '1s'});
            $('#text2').css({'right': '0'}).delay(300).fadeIn(500);
            $('#img3').fadeOut(300);
            $('#img2').delay(300).fadeIn(500);
        }
        else if(textNumber == 2){
            $('#text1').css({'right': '100vw', 'transition-duration': '1s'});
            $('#text3').css({'right': '0'}).delay(300).fadeIn(500);
            $('#img1').fadeOut(300);
            $('#img3').delay(300).fadeIn(500);
        }
    }
    
    $('.next').click(function(){
        textNumber++;
        next();
        time = 0;
    });
    $('.prev').click(function(){
        if(textNumber == 0) textNumber = 2;
        else textNumber--;
        prev();
        time = 0;
    });

    var myTimer = setInterval(function(){
        time++;
        if(time == 500){
            textNumber++;
            next();
            time = 0;
        }
    }, 10);
    $('#login-link').click(function(){
        $('.login-modal').fadeIn(500);
    });
    $('#close-login').click(function(){
        $('.login-modal').fadeOut(500);
    });
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
    // $('#dropdownuser').hide();
    $('.userbtn').click(function(){
        $('#dropdownuser').slideToggle(100);
    });
    $('button.navbar-toggler').click(function(){
        $('#navbarcontent').show(500);
        $('.nav-modal').show(500);
    });
    $('#navbarcontent').click(function(){
        $('#navbarcontent').hide(100);
        $('.nav-modal').hide(100);
    });
    $('.nav-modal').click(()=>{
        $('#navbarcontent').hide(100);
        $('.nav-modal').hide(100);
    });
});