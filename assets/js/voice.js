var voice_flg = true;
var voice_tr = null;

// --------------------------------------------------------------------
var rec;
var status=1;
function voice2text(callback) {

        var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition;
        var SpeechGrammarList = SpeechGrammarList || webkitSpeechGrammarList;
        var grammar = '#JSGF V1.0;'
        var lang = 'ja-JP';
        rec = new SpeechRecognition();
        var speechRecognitionList = new SpeechGrammarList();
        speechRecognitionList.addFromString(grammar, 1);
        rec.grammars = speechRecognitionList;
        rec.lang = lang;
        rec.interimResults = false; // 暫定結果
        rec.interimResults = true; // 暫定結果
        rec.continuous = true; // 認識継続

        rec.onresult = function(event) {
            callback(event);
        };
        rec.onspeechend = function() {
            rec.stop();
        };
        rec.onend = function() {
            rec.start();
        }
        rec.onerror = function(event) {
            console.log('Error detected: ' + event.error);
            $("#recog-text").text('エラーが検出されました。再度発言します。');
            $("i.text-start").hide();
            $("i.text-stop").show();
        }
        rec.onnomatch = function(event) {
            console.log(event);
            console.log('onnomatch');
        }
        console.log(rec);
        // recognition start
        rec.start();

}
// --------------------------------------------------------------------
function now() {
    var now = new Date();
    var y = now.getFullYear();
    var m = now.getMonth() + 1;
    var d = now.getDate();
    var w = now.getDay();
    var wd = ['日', '月', '火', '水', '木', '金', '土'];
    var h = now.getHours();
    var mi = now.getMinutes();
    var s = now.getSeconds();
    return h + ':' + mi + ':' + s;
}


$().ready(function() {
    $(".btn-start").click(function(){
        status=1;
        voice2text(add_record_callback);
        $(this).attr("disabled","disabled");
        $(".btn-end").removeAttr("disabled");
    })

    $(".btn-end").click(function(){
        status=0;
        $(this).attr("disabled","disabled");
        $(".btn-start").removeAttr("disabled");
    })
    
});


function add_record_callback(data) {

    if(status==1){
        var last = data.results.length - 1;
        var command = data.results[last][0].transcript.trim();

        if (data.results[last].isFinal) {

            voice_tr = null;
            voice_flg = true;
            $("#recog-text").text(command);
            $("i.text-start").hide();
            $("i.text-stop").show();
            console.log(command);
            console.log("voice end-------------------");
            $html = "<tr><td>"+now()+"</td><td>"+command+"</td></tr>";
            $("#tbl-recog").find("tbody").prepend($html);

        } else {
            if (voice_flg) {
                // first
                console.log("voice start -------------------");
                $("i.text-start").show();
                $("i.text-stop").hide();

            } else {
                // interimResults continue
                $("#recog-text").text(command);
               console.log(command);

            }
        }
    }
    else
    {
        rec.stop();
        rec.abort();
    }
}
