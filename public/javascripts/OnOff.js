$(function() {
 
    socket = io.connect('http://localhost:3000');

    $('#switch').click(function() {
        var msg = new Object();
        if ($('#switch').attr('checked') === 'checked') {
            console.log('ON');
            msg.led = 'ON';
        } else {
            console.log('OFF');
            msg.led = 'OFF';
        }
        //メッセージを送信する
        socket.emit('message', { value: msg });
    });


    // WebSocketでの接続
    socket.on('connect', function(msg) {
        console.log("connect");
    });

    // メッセージを受けたとき
    socket.on('message', function(msg) {
        if (typeof msg.value != undefined) {
            console.log(msg.value);
            // LEDの状態を反映
            if ( msg.value === 1) {
                $('#switch').attr('checked', 'checked');
            } else {
                $('#switch').removeAttr('checked');
            }
        }
    });

    socket.on('DBmessage', function(msg) {
        console.log(msg.value);
    });
    
});

  //メッセージを送る
    function SendMsg() {
        var msg = "";
        var attr = typeof $('#switch').attr('checked');

        console.log(attr);
        if (attr == 'undefined') {
            msg = "OFF";
        }
        else {
            msg = "ON";
        }

        // メッセージを送信する
        socket.emit('message', { value: msg });
    }