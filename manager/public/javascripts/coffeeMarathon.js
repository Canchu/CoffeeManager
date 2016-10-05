$(function() {

  /* サーバからデータの受け渡し */
  var $main = $('#graph');
  var userRanks = $main.data('user-ranks');
  var drinkRanks = $main.data('drink-ranks');

  /*****　コーヒーレースと品物別売り上げのグラフ作成 ******/ 

  var userRankGraphData =  {
    // labels: allUserName,
    labels: userRanks.map(function(data) { return data.name; }),
    datasets: [{
      label: "UserRank dataset",
      fillColor: "rgba(52,152,219,0.5)",
      strokeColor: "rgba(52,152,219,0.8)",
      highlightFill: "rgba(52,152,219,0.75)",
      highlightStroke: "rgba(52,152,219,1)",
      data: userRanks.map(function(data) { return data.qty; }),
    }],
  };

  var userRankGraph = new Chart(document.getElementById("user_rank").getContext("2d")).Bar(userRankGraphData);

  var drinkRankGraphData = {
    labels: drinkRanks.map(function(data) { return data.name; }),
    datasets: [{
      label: "CoffeeRank dataset price",
      fillColor: "rgba(220,220,220,0.5)",
      strokeColor: "rgba(220,220,220,0.8)",
      highlightFill: "rgba(220,220,220,0.75)",
      highlightStroke: "rgba(220,220,220,1)",
      data: drinkRanks.map(function(data) { return data.qty; }),
    }],
  };

  var drinkRankGraph = new Chart(document.getElementById("coffee_rank").getContext("2d")).Bar(drinkRankGraphData); 
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
    window.location.href = "/coffeeMarathon?month=" + nowMonth;
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
