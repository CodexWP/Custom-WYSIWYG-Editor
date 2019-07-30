$(document).ready(function()
{

    var ctrlDown = false,
        ctrlKey = 17,
        cmdKey = 91,
        vKey = 86,
        cKey = 67,
        enterKey = 13,
        backspaceKey = 8;

    /*EVENT : Check an event for CTRL + V together*/
    $(document).keydown(function(e) {
        if (e.keyCode == ctrlKey || e.keyCode == cmdKey) ctrlDown = true;
    }).keyup(function(e) {
        if (e.keyCode == ctrlKey || e.keyCode == cmdKey) ctrlDown = false;
    });

    /*EVENT : Paste event and execute function in editor*/
    $(".main-doc-area").on("paste", ".editor", function(e){
        jt = $(this);
        sel = window.getSelection();
        pe = get_parent_element_upto_editor(sel.focusNode);
        setTimeout(function(){
            br= $(pe).eq(0).children().find("br");
            c= $(pe).eq(0).children().eq(0);
            if(br.length>1)
                c.unwrap();
            move_line_down(jt,e);
        },300);
    })

    /*EVENT : Detect Key Up event and execute function in editor*/
    $(".main-doc-area").on("keyup keydown", ".editor", function(e){

        jt = $(this);

        if(e.keyCode == enterKey)
        {
            move_line_down(jt,e);
        }
        else
        {
            //console.log('test');
        }

    });

    /*EVENT : Detect Key Up event and execute function in editor*/
    $(".main-doc-area").on("keyup", ".editor", function(e){

        jt = $(this);
        if(e.keyCode == backspaceKey)
        {
            move_line_up(jt,e);
        }
        else
        {
        }

    });


    $(".main-doc-area").on("click", ".bind-editor", function(){
        ch = $(this).find(".editor").children();
        l_ele = ch.eq(ch.length -1).get(0);
        //placeCaretAtEnd(l_ele);
    })

    /*EVENT : All Sidebar Right Button Controls Events*/
    $ctrl = $(".controls");

   // $(".controls").find("button").click(saveSelection);

    $ctrl.find(".ctrl-page-setup").click(function(){
        show_popup('popup-page-setup');
    })

    $ctrl.find(".ctrl-color").click(function(){
        show_popup('popup-color');
    })

    $ctrl.find(".ctrl-functions").click(function(){
        show_popup('popup-functions');
    })

    /*EVENT : All events inner a popup*/
    $(".popup").on("click", ".btn-return", function(){
        $(this).parents(".popup").slideUp();
    })



    $(".left-sidebar").on("click",".page-box-slide",function(){
        var eid = $(this).attr("eid");
        eid--;
        $be = $(".bind-editor");
        $('html, body').animate({
            scrollTop: ($be.eq(eid).offset().top) - 70
        }, 1000);
    })


})