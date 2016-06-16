$(function() {

/*****　webSocket ******
    socket = io.connect('http://localhost:3000');

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
********************************/

/*****　詳細データテーブルの日付表示 ******/
    var dateList = document.getElementsByName('date');  
    for(var i =0; i < dateList.length; i++){
        var str = comDateFormat(dateList[i].innerHTML);
        document.getElementsByName('date')[i].innerHTML = str;
    }
/********************************/

/*****　テーブルにソート機能をつける ******/
    $('#all_data_table').tablesorter({
        headers:{
            3:{sorter:false} //値段にはソートつけない
        }
    });
/********************************/


/*****　テーブルの値をtableDataに格納 ******/
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
/********************************/


/*****　コーヒーレースと品物別売り上げのグラフ作成 ******/ 
    var allUserName = tableData.name.filter(function(x, i, self){
                        return self.indexOf(x) === i;
    });

    var priceByUser = Array(allUserName.length);
    for(var i = 0; i<priceByUser.length; i++){
        priceByUser[i] = 0;
    }
    for(var i=0; i < tableData.value.length; i++){
        for(var j=0; j< allUserName.length; j++){
            if(tableData.name[i] == allUserName[j])　priceByUser[j] += parseInt(tableData.value[i],10);
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
/********************************/


/*****　月の数字の表示と自動ページジャンプ******/ 
    var query = window.location.search.substring(1);
    var paramValue = query.split('=')[1];
    var monthName = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    if(paramValue == undefined){
         var day = new Date();
         paramValue = day.getMonth()+1;
         $('#'+monthName[day.getMonth()]).attr('selected', 'true');
    }

    for(var i=0; i<12; i++){
        if(i+1 == paramValue){
            $('#'+monthName[i]).attr('selected', 'true');
        }
    }

    changePageByMonth(paramValue);
/********************************/

  $('#DL_csv').live ('click', function(){
        $.ajax({
            type: 'POST',
            url: 'http://localhost:3000/hello',
            data: paramValue,
            success: function(){
                 var day = new Date();
                 var a = document.createElement('a');
                 var csvFileName = "2016-"+ paramValue + "_" + (day.getMonth()+1) + "-" + day.getDate() + "-" + day.getHours() + "-" + day.getMinutes() + "-" + day.getSeconds() + ".csv";

                 a.download = "2016-" +  paramValue + ".csv";
                 a.hidden = "hidden";
                 a.href = "http://localhost:3000/" + csvFileName;
                 a.click();
            }
        });
    });
});


function changePageByMonth(paramValue){
    var nowMonth = document.getElementById('month').value;
    if(nowMonth - paramValue != 0){
        window.location.href = "http://localhost:3000/coffeeMarathon?month=" + nowMonth;
        return;
    }
    else if(paramValue == undefined){
        return;
    }
    setTimeout("changePageByMonth("+ paramValue +")",500);
}

/*****　表の日付のフォーマットを整える ******/
function comDateFormat(date){
        var detailDate = date.split(" ");
        var monthName = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        
        for(var i = 0; i<12; i++){
            if(detailDate[1] == monthName[i]){
                detailDate[1] = i+1;
            }
        }

        var result = detailDate[3] + "年" + detailDate[1] + "月" 
                    + detailDate[2] + "日" + detailDate[0] + " "+detailDate[4];

        return result;
}
/********************************/