$(document).ready(function(){
    $('#top-text').hide().fadeIn(2000);
    $('#top-link').hide().fadeIn(2500);
    $('#top-logo').hide().fadeIn(3000);
    var scrollValue = 0;
    var textNumber = 0;
    function checkImage(){
        textNumber %= 3;
        if(textNumber == 0){
            $('p.first').show();
            $('p.second').hide();
            $('p.third').hide();
        }
        else if(textNumber == 1){
            $('p.first').hide();
            $('p.second').show();
            $('p.third').hide();
        }
        else if(textNumber == 2){
            $('p.first').hide();
            $('p.second').hide();
            $('p.third').show();
        }
    }
    $('.next').click(function(){
        textNumber++;
        checkImage()
    });
    $('.prev').click(function(){
        if(textNumber == 0) textNumber = 2;
        else textNumber--;
        checkImage()
    });

    $('#second-level').click(function(){
        $('.register-part').css({'right': '-100vw', 'transition-duration': '1s'});
        $('.level.second').addClass('active');
        $('.upload-part').css({'right': '2.5vw', 'transition-duration': '1s'});
    });
    $('#return-first').click(function(){
        $('.upload-part').css({'right': '100vw', 'transition-duration': '1s'});
        $('.level.second').removeClass('active');
        $('.register-part').css({'right': '2.5vw', 'transition-duration': '1s'});
    });
    $(document).scroll();
});