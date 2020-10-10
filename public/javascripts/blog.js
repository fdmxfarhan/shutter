$(document).ready(function(){
    $('#link1').removeClass('active');
    $('#link2').addClass('active');

    $('#star1').mouseenter(function(){
        $('#star1').addClass('active');
        $('#star2').removeClass('active');
        $('#star3').removeClass('active');
        $('#star4').removeClass('active');
        $('#star5').removeClass('active');
    });
    $('#star2').mouseenter(function(){
        $('#star1').addClass('active');
        $('#star2').addClass('active');
        $('#star3').removeClass('active');
        $('#star4').removeClass('active');
        $('#star5').removeClass('active');
    });
    $('#star3').mouseenter(function(){
        $('#star1').addClass('active');
        $('#star2').addClass('active');
        $('#star3').addClass('active');
        $('#star4').removeClass('active');
        $('#star5').removeClass('active');
    });
    $('#star4').mouseenter(function(){
        $('#star1').addClass('active');
        $('#star2').addClass('active');
        $('#star3').addClass('active');
        $('#star4').addClass('active');
        $('#star5').removeClass('active');
    });
    $('#star5').mouseenter(function(){
        $('#star1').addClass('active');
        $('#star2').addClass('active');
        $('#star3').addClass('active');
        $('#star4').addClass('active');
        $('#star5').addClass('active');
    });

    
    $('.sidebar-toggle').click(()=>{
        $('.sidebar-modal').fadeIn(500);
        $('.news-sidebar').show(500);
    });
    $('.sidebar-modal').click(()=>{
        $('.sidebar-modal').hide();
        $('.news-sidebar').hide();
    });
    var title = false;
    var paragraph = false;
    var image = false;
    $('a.add-paragraph-btn').click(()=>{
        if(image == true){
            $('form.image').hide();
            image = false;
        }
        if(title == true){
            $('form.title').hide();
            title = false;
        }
        $('form.paragraph').slideDown(500);
        paragraph = true;
    });
    $('a.add-image-btn').click(()=>{
        if(paragraph == true){
            $('form.paragraph').hide();
            paragraph = false;
        }
        if(title == true){
            $('form.title').hide();
            title = false;
        }
        $('form.image').slideDown(500);
        image = true;
    });
    $('a.add-title-btn').click(()=>{
        if(paragraph == true){
            $('form.paragraph').hide();
            paragraph = false;
        }
        if(image == true){
            $('form.image').hide();
            image = false;
        }
        $('form.title').slideDown(500);
        title = true;
    });
    

});


