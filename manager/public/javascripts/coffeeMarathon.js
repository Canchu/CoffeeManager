$(function() {

  /* サーバからデータの受け渡し */
  var $main = $('#graph');
  var userRanks = $main.data('user-ranks');
  var drinkRanks = $main.data('drink-ranks');

  /* 月の数字の表示と自動ページジャンプ */ 
  $('select[name=selectMonth]').change(function() {
    window.location.href = '/coffeeMarathon?month=' + $(this).val();
  });

  /*****　コーヒーレースと品物別売り上げのグラフ作成 ******/ 

  var ctxUser = document.getElementById("user_rank");
  var userRankGraphData =  {
    type: 'bar',
    data: {
      labels: userRanks.map(function(data) { return data.name; }),
      datasets: [{
        label: "# of coffee",
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        borderColor: 'rgba(255,99,132,1)',
        borderWidth: 1,
        data: userRanks.map(function(data) { return data.qty; }),
      }],
    },
    options: {
      responsive: false,
      legend: {
        display: true,
      },
      scales: {
        xAxes: [{
          ticks: {
            fontSize: 16
          }
        }],
        yAxes: [{
          ticks: {
            fontSize: 14,
            beginAtZero: true
          }
        }]
      }
    }
  };
  var userRankGraph = new Chart(ctxUser, userRankGraphData);

  var ctxDrink = document.getElementById("coffee_rank");
  var drinkRankGraphData = {
    type: 'bar',
    data: {
      labels: drinkRanks.map(function(data) { return data.name; }),
      datasets: [{
        label: "# of coffee",
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        borderColor: 'rgba(255,99,132,1)',
        borderWidth: 1,
        data: drinkRanks.map(function(data) { return data.qty; }),
      }],
    },
    options: {
      responsive: false,
      scales: {
        xAxes: [{
          ticks: {
            fontSize: 16
          }
        }],
        yAxes: [{
          ticks: {
            fontSize: 14,
            beginAtZero:true
          }
        }]
      }
    }
  };
  var drinkRankGraph = new Chart(ctxDrink, drinkRankGraphData); 
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

