/*
////////////////////////////////////
All Functions of Custom Editor
Author : Dhaka Jaccos Co Ltd
Developed by : Md Saiful Islam (Saif)
Author Contact : http://www.codexwp.com/about
////////////////////////////////////
*/

/*Global variables*/

var g_margin= {"left":"0.5in","top":"0.5in","right":"0.5in","bottom":"0.5in"};

var g_page_size = 'a4';

var g_page_size_dim = {
    "a5":{"width":"5.8in","height":"8.3in"},
    "a4":{"width":"8.3in","height":"11.7in"},
    "a3":{"width":"11.7in","height":"16.5in"},
    "a2":{"width":"16.5in","height":"23.4in"},
}

var g_range;

$('.bind-editor').on('selectstart', ".editor", function () { $(document).one('mouseup', saveSelection)});

$.fn.focusEnd = function() {
    $(this).focus();
    var tmp = $('<span />').appendTo($(this)),
        node = tmp.get(0),
        range = null,
        sel = null;
    if (document.selection) {
        range = document.body.createTextRange();
        range.moveToElementText(node);
        range.select();
    } else if (window.getSelection) {
        range = document.createRange();
        range.selectNode(node);
        sel = window.getSelection();
        sel.removeAllRanges();
        sel.addRange(range);
    }
    tmp.remove();
    return this;
}


function saveSelection() {
    if (window.getSelection) {
        sel = window.getSelection();
        if (sel.getRangeAt && sel.rangeCount) {
            g_range = sel.getRangeAt(0);
        }
    } else if (document.selection && document.selection.createRange) {
        g_range = document.selection.createRange();
    }
    else {
        g_range = null;
    }
}

function restoreSelection() {
    if (g_range) {
        if (window.getSelection) {
            sel = window.getSelection();
            sel.removeAllRanges();
            sel.addRange(g_range);
        } else if (document.selection && g_range.select) {
            g_range.select();
        }
    }
}

/*
Function Name : show_popup
Hide all the popups
Show only the popup with arg. name
Name is class name
*/

function show_popup(name)
{
    $(".popup").hide();
    $(".popup."+name).slideDown();
}

/*
Function Name : page_setup
Change page size (a4, b4, c4)
Show only the popup with arg. name
Name is class name
*/
function page_setup(size,margin)
{
    $(".main-doc-area").css({"width":g_page_size_dim[size].width});
    be = $(".bind-editor");
    be.css(g_page_size_dim[size]);

    $(".ru-left").css({"width":margin.left});
    $(".ru-right").css({"width":margin.right});
    $(".ru-top").css({"height":margin.top});
    $(".ru-bottom").css({"height":margin.bottom});

    var mar = margin.top + margin.right + margin.bottom + margin.left;
    ed = $(".editor");
    ed.css({"padding":mar});
}

function word_change_page_size(t)
{
    g_page_size = $(t).val();
    page_setup(g_page_size,g_margin);
}

function getCaretPosition() {
    if (window.getSelection && window.getSelection().getRangeAt) {
        var range = window.getSelection().getRangeAt(0);
        var selectedObj = window.getSelection();
        var rangeCount = 0;
        var childNodes = selectedObj.anchorNode.parentNode.childNodes;
        for (var i = 0; i < childNodes.length; i++) {
            if (childNodes[i] == selectedObj.anchorNode) {
                break;
            }
            if (childNodes[i].outerHTML)
            {
                rangeCount += childNodes[i].outerHTML.length;
            }

            else if (childNodes[i].nodeType == 3) {
                rangeCount += childNodes[i].textContent.length;
            }
        }
        var data = {"pos":range.startOffset + rangeCount,"len":childNodes.length};
        return data;//range.startOffset + rangeCount;
    }
    return -1;
}


function prepage_image_print(){
    $("#print-area").html("");
    var element = $(".bind-editor");
    var done = 0;
    var timer;
    element.each(function(e){
        doc = $(this);
        options = {scale:2,};
        html2canvas(doc[0], options).then(function(canvas) {
            var src = canvas.toDataURL();
            w = global_page_size_obj[global_page_size].width;
            h = global_page_size_obj[global_page_size].height;
            $html = "<img style='width:"+w+";' class='print-images' src='"+src+"'>";
            console.log($html);
            $("#print-area").append($html);
            done++;
        });
    })
    timer = setInterval(function(){
        if(element.length == done)
        {
            clearInterval(timer);
            $(".print-images").printThis();
        }
    },1000);

}



/*
FUNCTION : move_line_down
DESCRIPTIONS : This function can move the line to next pages, can create new page while need
 */
function move_line_down(jt,e)
{
    var i,j;
    var new_be = '<div style="margin-top:0.2in;" class="bind-editor bg-white">\n' +
        '<div class="ru-left"></div>\n' +
        '<div class="ru-right"></div>\n' +
        '<div class="ru-top"></div>\n' +
        '<div class="ru-bottom"></div>'+
        '<div class="editor bg-white" contenteditable="true">\n' +
        '</div></div>';

    var offset = 21;//25;

    doc = $(".main-doc-area");

    c_be = jt.parents(".bind-editor"); // Current bind editor
    be = $(".bind-editor"); // All bind bind editor
    c_be_i = be.index(c_be); // Current bind editor index
    c_be_t = be.length; // Total number of bind editor
    c_ed =tmp_c_ed= be.eq(c_be_i).find(".editor"); // Current editor
    sel = window.getSelection();
    sel_element = get_parent_element_upto_editor(sel.focusNode);
    c_ed_childs = $(c_ed.get(0).childNodes).filter(function(){this.nodeType == 3;return this;});
    c_ed_ch_total = parseInt(c_ed_childs.length);
    c_ed_ch_row = parseInt(c_ed_childs.index(sel_element)) + 1; // Selected row number


    h_px = be.innerHeight();
    height = Math.ceil(c_ed.outerHeight()) + offset; // Current editor's offset height

    if(height>h_px)
    {
        n_be = tmp_n_be = be.eq(c_be_i + 1);

        if(n_be.length==0)
        {
            doc.append(new_be);
            page_setup(g_page_size,g_margin);
            set_pagination_numbers();
            be = $(".bind-editor");
            c_be_t = be.length;
            tmp_n_be = be.eq(c_be_i + 1);
        }

        for(i=c_be_i; i< c_be_t ; i++)
        {
            c_be = be.eq(i);
            c_ed = c_be.find(".editor");
            c_height = Math.ceil(c_ed.outerHeight()) + offset;

            if(c_height > h_px)
            {
                n_be = be.eq(i + 1);

                if (n_be.length == 0) {
                    doc.append(new_be);
                    page_setup(g_page_size,g_margin);
                    set_pagination_numbers();
                    be = $(".bind-editor");
                    c_be_t = be.length;
                }

                c_be = be.eq(i);
                c_ed = c_be.find(".editor");
                c_ed_ch = nodes_to_element(c_ed.get(0).childNodes);//c_ed.children(); // Children list of current editor

                c_ed_ch_t = c_ed_ch.length - 1;

                for (j = c_ed_ch_t; j >= 0; j--)
                {
                    c_height = Math.ceil(c_ed.outerHeight() + offset);
                    if (c_height <= h_px) { break; }
                    el = c_ed_ch.eq(j); // Last element of current editor
                    n_ed = be.eq(i + 1).find(".editor");
                    n_ed.prepend(el.clone());
                    el.remove();
                }

            }
        }

        if(c_ed_ch_row == c_ed_ch_total)
        {
            tmp_n_be.find(".editor").focus();
        }
    }
}


/*
FUNCTION : move_line_up
DESCRIPTIONS : This function can back the line to prev pages, can remove a page while need
 */
function move_line_up(jt,e)
{

    var sel = window.getSelection();

    c_be = jt.parents(".bind-editor"); // Current bind editor

    be = $(".bind-editor"); // All bind bind editor

    h_px = be.innerHeight();

    c_be_i = be.index(c_be); // Current bind editor index

    c_be_t = be.length; // Total number of bind editor

    c_ed = be.eq(c_be_i).find(".editor"); // Current editor

    prev_ed = be.eq(c_be_i-1).find(".editor"); // Prev editor

    next_ed = be.eq(c_be_i+1).find(".editor"); // Next editor

    sel_element = get_parent_element_upto_editor(sel.focusNode);

    c_ed_childs = nodes_to_element(c_ed.get(0).childNodes);

    line = c_ed_childs.index(sel_element);

    caret = getCaretPosition();


    if(be.length == 1)
        return;


    if((line==-1 || (line==0 && c_ed_childs.length==0) ) && next_ed.length==0)
    {
        prev_ed.focusEnd();
        c_be.remove();
        set_pagination_numbers();
        focus_ele = prev_ed.children().eq(prev_ed.children().length -1);
        $('html, body').animate({
            scrollTop: focus_ele.offset().top
        }, 10);
    }
    else if(line==0 && caret.pos==0)
    {
        sel_ele_h = $(sel_element).height();
        prev_ed_h = Math.ceil(prev_ed.outerHeight() + sel_ele_h);

        if(prev_ed_h<=h_px)
        {
            prev_ed.append($(sel_element));
            prev_ed.focusEnd();
            focus_ele = $(sel_element);
        }
        else
        {
            focus_ele = prev_ed.children().eq(prev_ed.children().length -1);
            prev_ed.focusEnd();
        }

        $('html, body').animate({
            scrollTop: focus_ele.offset().top
        }, 10);

    }
    else
    {
        move_line_up_helper(c_be_i)
    }


}

/*
FUNCTION : move_line_up_helper
DESCRIPTIONS : This function will help the move_line_up function
 */

function move_line_up_helper(cbei)
{
    $be = $(".bind-editor");
    $hpx = Math.ceil($be.innerHeight());
    off = 21;

    var i;
    for(i=cbei;i<$be.length;i++)
    {
        $cbe = $be.eq(i);
        $ced = $cbe.find(".editor");
        $nbe = $be.eq(i+1);

        if($nbe.length!=0)
        {
            $ned = $nbe.find(".editor");
            $ned_ch = nodes_to_element($ned.get(0).childNodes);
            $chi =0;

            while(1)
            {
                $cavh = $hpx - (Math.ceil($ced.outerHeight()) + off);
                $cele = $ned_ch.eq($chi);

                if($cele.length==0)
                {
                    $nbe.remove();
                    set_pagination_numbers();
                    break;
                }

                try {
                    $celeh = $cele.height();
                    if($cavh >= $celeh)
                    {
                        $ced.append($cele);
                    }
                    else
                    {
                        break;
                    }
                }
                catch(err) {
                    $nbe.remove();
                    set_pagination_numbers();
                    break;
                }

                $chi++;
            }
        }
    }
}


/*
FUNCTION :  set_pagination_numbers
DESCRIPTION : This function will set page numbers while creating new pages or removing pages
*/
function set_pagination_numbers()
{
    $(".pagi-number").remove();
    $be = $(".bind-editor");
    var len = $be.length;
    var sn = 1;
    $be.each(function(){
        $(this).append("<div class='pagi-number'>ページ "+sn+" / "+len+"</div>");
        sn++;
    })
    set_sidebar_slideshow();
}

function set_sidebar_slideshow()
{
    $(".left-sidebar").html("");
    $be = $(".bind-editor");
    var page = 0;
    for(i=0;i<$be.length;i++)
    {
        page++;
        $slide = '<div eid="'+page+'" class="page-box-slide"><span>枠 - '+page+'</span></div>';
        $(".left-sidebar").append($slide);
    }
}

function word_font_color(code) {
    restoreSelection();
    var span = document.createElement("span");
    span.style.color = code;
    if (window.getSelection) {
        var sel = window.getSelection();
        if (sel.rangeCount) {
            var range = sel.getRangeAt(0).cloneRange();
            range.surroundContents(span);
            sel.removeAllRanges();
            sel.addRange(range);
        }
    }

}

function word_font_size(size) {
    var span = document.createElement("span");
    span.style.fontsize = size;

    if (window.getSelection) {
        var sel = window.getSelection();
        if (sel.rangeCount) {
            var range = sel.getRangeAt(0).cloneRange();
            range.surroundContents(span);
            sel.removeAllRanges();
            sel.addRange(range);
        }
    }
}

function get_parent_element_upto_editor(node)
{
    ele = $(node).filter(function(){this.nodeType == 3;return this;}).get(0);
    cls = ele.className;
    if(cls=="editor bg-white")
    {
        ele = $("");
    }
    else
    {
        while (1) {
            par = ele.parentElement;
            cls = par.className;
            if(cls=="editor bg-white")
            {
                break;
            }
            ele=par;
        }
    }
    return ele;
}

function get_child_element_upto_text_br(ele)
{
    var i,l,flag;
    el = ele.get(0);
    if(ele.text()=='' || ele.html() == "<br>")
    {
        var resp = {"status":"end","element":ele};
        return resp;
    }

    if(el.nodeName == "#text" || el.nodeName == "BR")
    {
        var resp = {"status":"end","element":ele};
        return resp;
    }

    n = el.childNodes;
    e = nodes_to_element(n);

    l = e.length;

    flag = 0;

    for(i=0;i<l;i++)
    {
        c_n_name = e.get(i).nodeName;
        if(c_n_name=="#text" || c_n_name=="BR")
            flag = 1;
    }

    if(flag==1)
    {
        var resp = {"status":"end","element":ele};
        return resp;
    }
    child_e = e.eq(l-1);
    resp = get_child_element_upto_text_br(child_e);
    if(resp.status=='end')
    {
        return resp;
    }
}

function nodes_to_element(nodes)
{
    element = $(nodes).filter(function(){ this.nodeType == 3; return this; });
    return element;
}