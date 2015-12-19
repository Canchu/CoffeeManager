$(function() {
    
    var dateList = document.getElementsByName('date');  
    for(var i =0; i < dateList.length; i++){
        var str = comDateFormat(dateList[i].innerHTML);
        document.getElementsByName('date')[i].innerHTML = str;
    }
    
    $('#all_data_table').tablesorter({
        headers:{
            3:{sorter:false}
        }
    });

    socket = io.connect('http://localhost:3000');

    var tbl = document.getElementById('user_data');
    var tableData = {
                        time:[],
                        name:[],
                        item:[],
                        value:[]
    };

    for (var i=0, rowLen=tbl.rows.length; i<rowLen; i++) {
            tableData.time.push(tbl.rows[i].cells[0].innerHTML);
            tableData.name.push(tbl.rows[i].cells[1].innerHTML);
            tableData.item.push(tbl.rows[i].cells[2].innerHTML);
            tableData.value.push(tbl.rows[i].cells[3].innerHTML);
    }
    
    var allUserName = tableData.name.filter(function(x, i, self){
                        return self.indexOf(x) === i;
    });

    var priceByUser = Array(allUserName.length);
    for(var i = 0; i<priceByUser.length; i++){
        priceByUser[i] = 0;
    }
    for(var i=0; i < tableData.value.length; i++){
        for(var j=0; j< allUserName.length; j++){
            if(tableData.name[i] == allUserName[j]){
                priceByUser[j] += parseInt(tableData.value[i],10);
            }
        }
    }

    var priceByCoffee = [0,0,0];
    for(var i=0; i < tableData.item.length; i++){
        var itemName = tableData.item[i];
        if(itemName == "Dolce Gusto") priceByCoffee[0] += 60;
        else if(itemName == "GoldBrend Barista") priceByCoffee[1] += 30;
        else priceByCoffee[2] += 60;
    }

     var user_RankData =  {
        labels: allUserName,
        datasets: [{
                label: "UserRank dataset",
                fillColor: "rgba(220,220,220,0.5)",
                strokeColor: "rgba(220,220,220,0.8)",
                highlightFill: "rgba(220,220,220,0.75)",
                highlightStroke: "rgba(220,220,220,1)",
                data: priceByUser
            }
        ]
    };

    var coffee_RankData =  {
        labels: ["Dolce Gusto", "GoldBrend Barista", "Special.T"],
        datasets: [{
                label: "CoffeeRank dataset price",
                fillColor: "rgba(220,220,220,0.5)",
                strokeColor: "rgba(220,220,220,0.8)",
                highlightFill: "rgba(220,220,220,0.75)",
                highlightStroke: "rgba(220,220,220,1)",
                data: priceByCoffee
            },
            {
                label: "CoffeeRank dataset times",
                fillColor: "rgba(151,187,205,0.5)",
                strokeColor: "rgba(151,187,205,0.8)",
                highlightFill: "rgba(151,187,205,0.75)",
                highlightStroke: "rgba(151,187,205,1)",
                data: [priceByCoffee[0]/60, priceByCoffee[1]/30, priceByCoffee[2]/60]
            }
        ]
    };


    var userRankBar = new Chart(document.getElementById("user_rank").getContext("2d")).Bar(user_RankData);
    var coffeeRankBar = new Chart(document.getElementById("coffee_rank").getContext("2d")).Bar(coffee_RankData);


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


function comDateFormat(date){
        var detailDate = date.split(" ");

        if(detailDate[1] == "Jan"){
            detailDate[1] = 1;
        }
        else if(detailDate[1] == "Feb"){
            detailDate[1] = 2;
        }
        else if(detailDate[1] == "Mar"){
            detailDate[1] = 3;
        }
        else if(detailDate[1] == "Apr"){
            detailDate[1] = 4;
        }
        else if(detailDate[1] == "May"){
            detailDate[1] = 5;
        }
        else if(detailDate[1] == "Jun"){
            detailDate[1] = 6;
        }
        else if(detailDate[1] == "July"){
            detailDate[1] = 7;
        }
        else if(detailDate[1] == "Aug"){
            detailDate[1] = 8;
        }
        else if(detailDate[1] == "Sep"){
            detailDate[1] = 9;
        }
        else if(detailDate[1] == "Oct"){
            detailDate[1] = 10;
        }
        else if(detailDate[1] == "Nov"){
            detailDate[1] = 11;
        }
        else if(detailDate[1] == "Dec"){
            detailDate[1] = 12;
        }

        var result = detailDate[3] + "年" + detailDate[1] + "月" 
                    + detailDate[2] + "日" + detailDate[0] + " "+detailDate[4];

        return result;

}