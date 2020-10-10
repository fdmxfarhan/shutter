$(document).ready(function(){
    var show = 1;
    $('#coopration').hide();
    $('#btn1').click(function(){
        if(show == 0){
            $('#coopration').slideUp(1000);
            show = 1;
        }
        else if(show == 1){
            $('#coopration').slideDown(1000);
            show = 0;
        }
    });
});