$(document).ready(function(){
    var languagesFa = ['فارسی', 'انگلیسی', 'عربی', 'ترکی', 'استانبولی', 'روسی', 'چینی', 'هندی', 'اردو', 'آلمانی', 'فرانسوی', 'کوردی'];
    var base = 0, dest = 0;
    $('#add-base-lang').click(() => {
        $('#base-list').fadeIn(500);
    });
    $('#base-list').click(() => {
        $('#base-list').hide();
    });
    
    $('#add-dest-lang').click(() => {
        $('#dest-list').fadeIn(500);
    });
    $('#dest-list').click(() => {
        $('#dest-list').hide();
    });
    
    $('#error0').hide().slideDown(1000);
    $('#error1').hide().slideDown(1000);
    $('#error2').hide().slideDown(1000);
    $('#error3').hide().slideDown(1000);
    $('#error4').hide().slideDown(1000);
    $('#error5').hide().slideDown(1000);
    
    languagesFa.forEach(lang => {
        $('#LB' + lang).click(() => {
            $('#B' + lang).show();
            $('input[name="baseLangs[' + base + ']"]').attr('value', lang);
            base++
        });
        $('#CB' + lang).click(() => {
            $('#B' + lang).hide();
            var a = $('#baseLangs').attr('value');
            for(var i=0; i<languagesFa.length; i++){
                var a = $('input[name="baseLangs[' + i + ']"]').attr('value');
                if(a == lang){
                    $('input[name="baseLangs[' + i + ']"]').attr('value', '');
                }
            }
        });
        $('#LD' + lang).click(() => {
            $('#D' + lang).show();
            $('input[name="destLangs[' + dest + ']"]').attr('value', lang);
            dest++
        });
        $('#CD' + lang).click(() => {
            $('#D' + lang).hide();
            var a = $('#destLangs').attr('value');
            for(var i=0; i<languagesFa.length; i++){
                var a = $('input[name="destLangs[' + i + ']"]').attr('value');
                if(a == lang){
                    $('input[name="destLangs[' + i + ']"]').attr('value', '');
                }
            }
        });
    });
    var time0 = 0.0, time1 = -10.0, time2 = -15.0, time3 = -20.0, time4 = -25.0, time5 = -30.0;
    setInterval(() => {
        $('#time0').css('width', `${time0}%`);
        time0+=0.1;
        if(time0 >= 100.0) $('#error0').hide(500);
        
        $('#time1').css('width', `${time1}%`);
        time1+=0.1;
        if(time1 >= 100.0) $('#error1').hide(500);
        
        $('#time2').css('width', `${time2}%`);
        time2+=0.1;
        if(time2 >= 100.0) $('#error2').hide(500);
        
        $('#time3').css('width', `${time3}%`);
        time3+=0.1;
        if(time3 >= 100.0) $('#error3').hide(500);
        
        $('#time4').css('width', `${time4}%`);
        time4+=0.1;
        if(time4 >= 100.0) $('#error4').hide(500);
        
        $('#time5').css('width', `${time5}%`);
        time5+=0.1;
        if(time5 >= 100.0) $('#error5').hide(500);
    }, 10);

});