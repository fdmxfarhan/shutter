$(document).ready(function(){
    var num = 5;
    var $buttons = [$('#btn1'), $('#btn2'), $('#btn3'), $('#btn4'), $('#btn5')];
    var $tabs = [$('#tab1'), $('#tab2'), $('#tab3'), $('#tab4'), $('#tab5')];
    
    for(var i = 1; i<num ; i++){
        $tabs[i].hide();
    }
    $buttons[0].addClass("active");
    
    $.each($buttons, function(key,value){
        value.click(function(){
            $buttons[key].addClass("active");
            $tabs[key].slideDown(500);
            for(var j = 0; j<num; j++){
                if(j != key){
                    $buttons[j].removeClass("active");
                    $tabs[j].hide();
                }
            }
        });
    });
 
});