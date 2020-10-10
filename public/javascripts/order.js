$(document).ready(function(){
    $('#link1').removeClass('active');
    $('#link3').addClass('active');
    $('#info').mouseenter(function(){
        $('.info-panel').fadeIn(500);
    });
    $('body').click(function(){
        $('.info-panel').fadeOut(500);
    });
    $('.order-modal').click(function(){
        $('.order-modal').hide();
        $('.calculate-words-area').hide();
        $('.calculate-price-area').hide();
        $('.prices-area').hide();
    });
    $('.close-button').click(function(){
        $('.order-modal').hide();
        $('.calculate-words-area').hide();
        $('.calculate-price-area').hide();
        $('.prices-area').hide();
    });
    $('#calculate-words').click(function(){
        $('.order-modal').fadeIn(500);
        $('.calculate-words-area').fadeIn(500);
    });
    $('#calculate-price').click(function(){
        $('.order-modal').fadeIn(500);
        $('.calculate-price-area').fadeIn(500);
    });
    $('#prices').click(function(){
        $('.order-modal').fadeIn(500);
        $('.prices-area').fadeIn(500);
    });
    
    
    $('#calculate1').click(function(){
        var text = $('#copy-text').val();
        var cnt = 1;
        for(var i=0; i<text.length; i++){
            if(text[i] == ' ') cnt++;
            // if(i<text.length){
            //     if(text[i] == '.' && text[i+1] != ' ') cnt++;
            // }
        }
        if(text.length == 0) cnt = 0;
        $('#words').html(` ${cnt}`);
        var baseLanguage = $('#baseLanguage').val();
        var destLanguage = $('#destLanguage').val();
        var price = 0;
        var savecnt = cnt;
        if(cnt < 250) {
            cnt = 250;
            $('p#count-error').html('سفارشات کمتر از ۲۵۰ کلمه، معادل ۲۵۰ کلمه محاسبه خواهند شد.')
        }
        if(baseLanguage == 'انگلیسی (طلائی)' && destLanguage == 'فارسی')        price = cnt * 65;
        else if(baseLanguage == 'انگلیسی (نقره ای)' && destLanguage == 'فارسی') price = cnt * 45;
        else if(baseLanguage == 'انگلیسی (برنزی)' && destLanguage == 'فارسی') price = cnt * 25;
        else if(baseLanguage == 'فارسی' && destLanguage == 'انگلیسی') price = cnt * 80;
        else if(baseLanguage == 'عربی' && destLanguage == 'فارسی') price = cnt * 85;
        else if(baseLanguage == 'فارسی' && destLanguage == 'عربی') price = cnt * 85;
        else if(baseLanguage == 'روسی' && destLanguage == 'فارسی') price = cnt * 160;
        else if(baseLanguage == 'فارسی' && destLanguage == 'روسی') price = cnt * 190;
        else if(baseLanguage == 'چینی' && destLanguage == 'فارسی') price = cnt * 130;
        else if(baseLanguage == 'فارسی' && destLanguage == 'چینی') price = cnt * 410;
        else if(baseLanguage == 'ترکی' && destLanguage == 'فارسی') price = cnt * 155;
        else if(baseLanguage == 'فارسی' && destLanguage == 'ترکی') price = cnt * 185;
        else if(baseLanguage == 'آلمانی' && destLanguage == 'فارسی') price = cnt * 185;
        else if(baseLanguage == 'فارسی' && destLanguage == 'آلمانی') price = cnt * 205;
        else if(baseLanguage == 'فرانسوی' && destLanguage == 'فارسی') price = cnt * 185;
        else if(baseLanguage == 'فارسی' && destLanguage == 'فرانسوی') price = cnt * 205;
        else if(baseLanguage == 'ایتالیایی' && destLanguage == 'فارسی') price = cnt * 200;
        else if(baseLanguage == 'فارسی' && destLanguage == 'آلمانی') price = cnt * 250;
        else if(baseLanguage == 'هندی' && destLanguage == 'فارسی') price = cnt * 200;
        else if(baseLanguage == 'فارسی' && destLanguage == 'هندی') price = cnt * 200;
        else if(baseLanguage == 'اردو' && destLanguage == 'فارسی') price = cnt * 200;
        else if(baseLanguage == 'فارسی' && destLanguage == 'اردو') price = cnt * 200;
        else if(baseLanguage == 'کوردی' && destLanguage == 'فارسی') price = cnt * 200;
        else if(baseLanguage == 'فارسی' && destLanguage == 'کوردی') price = cnt * 200;
        else if(baseLanguage == 'فارسی' && destLanguage == 'فارسی') {
            price = cnt * 40;
            $('#lang-error').html(`خدمات ویراستاری شاتر شامل متون از پیش ترجمه شده نمی شود. و متون مطبوعاتی یا ادبی را دربر می گیرد.`);
        }
        
        else {
            price = '-';
            if(baseLanguage != destLanguage) $('#lang-error').html(`جهت انجام ترجمه از ${baseLanguage} به ${destLanguage} با اپراتور تماس بگیرید.`);
        }
        
        
        $('#price').html(` ${price} تومان`);
    });
    $('#calculate2').click(function(){
        var cnt = $('#words-input').val();
        $('#words1').html(` ${cnt}`);
        var baseLanguage = $('#baseLanguage1').val();
        var destLanguage = $('#destLanguage1').val();
        var price = 0;
        var savecnt = cnt;
        if(cnt < 250) {
            cnt = 250;
            $('p#count-error2').html('سفارشات کمتر از ۲۵۰ کلمه، معادل ۲۵۰ کلمه محاسبه خواهند شد.')
        }
        if(baseLanguage == 'انگلیسی (طلائی)' && destLanguage == 'فارسی')        price = cnt * 65;
        else if(baseLanguage == 'انگلیسی (نقره ای)' && destLanguage == 'فارسی') price = cnt * 45;
        else if(baseLanguage == 'انگلیسی (برنزی)' && destLanguage == 'فارسی') price = cnt * 25;
        else if(baseLanguage == 'فارسی' && destLanguage == 'انگلیسی') price = cnt * 80;
        else if(baseLanguage == 'عربی' && destLanguage == 'فارسی') price = cnt * 85;
        else if(baseLanguage == 'فارسی' && destLanguage == 'عربی') price = cnt * 85;
        else if(baseLanguage == 'روسی' && destLanguage == 'فارسی') price = cnt * 160;
        else if(baseLanguage == 'فارسی' && destLanguage == 'روسی') price = cnt * 190;
        else if(baseLanguage == 'چینی' && destLanguage == 'فارسی') price = cnt * 130;
        else if(baseLanguage == 'فارسی' && destLanguage == 'چینی') price = cnt * 410;
        else if(baseLanguage == 'ترکی' && destLanguage == 'فارسی') price = cnt * 155;
        else if(baseLanguage == 'فارسی' && destLanguage == 'ترکی') price = cnt * 185;
        else if(baseLanguage == 'آلمانی' && destLanguage == 'فارسی') price = cnt * 185;
        else if(baseLanguage == 'فارسی' && destLanguage == 'آلمانی') price = cnt * 205;
        else if(baseLanguage == 'فرانسوی' && destLanguage == 'فارسی') price = cnt * 185;
        else if(baseLanguage == 'فارسی' && destLanguage == 'فرانسوی') price = cnt * 205;
        else if(baseLanguage == 'ایتالیایی' && destLanguage == 'فارسی') price = cnt * 200;
        else if(baseLanguage == 'فارسی' && destLanguage == 'آلمانی') price = cnt * 250;
        else if(baseLanguage == 'هندی' && destLanguage == 'فارسی') price = cnt * 200;
        else if(baseLanguage == 'فارسی' && destLanguage == 'هندی') price = cnt * 200;
        else if(baseLanguage == 'اردو' && destLanguage == 'فارسی') price = cnt * 200;
        else if(baseLanguage == 'فارسی' && destLanguage == 'اردو') price = cnt * 200;
        else if(baseLanguage == 'کوردی' && destLanguage == 'فارسی') price = cnt * 200;
        else if(baseLanguage == 'فارسی' && destLanguage == 'کوردی') price = cnt * 200;
        else if(baseLanguage == 'فارسی' && destLanguage == 'فارسی') {
            price = cnt * 40;
            $('#lang-error2').html(`خدمات ویراستاری شاتر شامل متون از پیش ترجمه شده نمی شود. و متون مطبوعاتی یا ادبی را دربر می گیرد.`);
        }
        
        else {
            price = '-';
            $('#lang-error2').html(`جهت انجام ترجمه از ${baseLanguage} به ${destLanguage} با اپراتور تماس بگیرید.`);
        }
        
        $('#price1').html(` ${price} تومان`);
    });
    $('button.clear').click(()=>{
        $('#copy-text').val('');
    });
});
