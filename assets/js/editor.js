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
            //console.log('test');
        }

    });





    $(".controls").find(".ctrl-print").click(function(){
        prepage_image_print();
    })

    $(".main-doc-area").on("click", ".bind-editor", function(){
        ch = $(this).find(".editor").children();
        l_ele = ch.eq(ch.length -1).get(0);
        //placeCaretAtEnd(l_ele);
    })

/*
    $('div[contenteditable]').keydown(function(e) {
        // trap the return key being pressed
        if (e.keyCode === 13) {
            // insert 2 br tags (if only one br tag is inserted the cursor won't go to the next line)
            document.execCommand('insertHTML', false, '<div class="edi-row"><br></div>');
            // prevent the default behaviour of return key pressed
            return false;
        }
    });
*/

















    c = $(".controls");

    c.find(".ctrl-page-setup").click(function(){
        show_popup('popup-page-setup');
    })

    $(".popup").on("click", ".btn-return", function(){
        $(this).parents(".popup").slideUp();
    })

    $(".popup").on("click", ".btn-save", function(){
        p = $(this).parents(".popup");
        var ml = p.find(".ml").val() + "in ";
        var mt = p.find(".mt").val() + "in ";
        var mr = p.find(".mr").val() + "in ";
        var mb = p.find(".mb").val() + "in ";
        if(ml=='' || ml==undefined) ml=0 + "in ";
        if(mt=='' || mt==undefined) mt=0 + "in ";
        if(mr=='' || mr==undefined) mr=0 + "in ";
        if(mb=='' || mb==undefined) mb=0 + "in ";

        var margin = {"left":ml,"top":mt,"right":mr,"bottom":mb};
        var size = p.find("select[name='sel-page-size']").val();
        global_margin = margin;
        global_page_size = size;
        page_setup(size,margin);
        $(this).parents(".popup").slideUp();
    })
})