$(function() {

  /* サーバからデータの受け渡し */
  var $main = $('#graph');
  var userRanks = $main.data('user-ranks');
  var drinkRanks = $main.data('drink-ranks');

  /* 月の数字の表示と自動ページジャンプ */
  $('select[name=selectMonth]').change(function() {
    window.location.href = '/coffeeMarathon?month=' + $(this).val();
  });


  /* コーヒーマラソン */
  var ctxUser = document.getElementById("user_rank");
  var userRankGraphData = {
    type: 'bar',
    data: {
      labels: userRanks.map(function(data) { return data.name; }),
      datasets: [{
        label: "# of coffee",
        backgroundColor: 'rgba(83, 120, 72, 0.3)',
        borderColor: 'rgba(83, 120, 72, 0.6)',
        borderWidth: 1,
        data: userRanks.map(function(data) { return data.qty; }),
      }],
    },
    options: {
      responsive: true,
      legend: {
        display: true,
      },
      scales: {
        xAxes: [{
          ticks: {
            fontSize: 12
          }
        }],
        yAxes: [{
          ticks: {
            fontSize: 12,
            beginAtZero: true
          }
        }]
      }
    }
  };
  var userRankGraph = new Chart(ctxUser, userRankGraphData);

  /* 種類別売上 */
  var ctxDrink = document.getElementById("coffee_rank");
  var drinkRankGraphData = {
    type: 'bar',
    data: {
      labels: drinkRanks.map(function(data) { return data.name; }),
      datasets: [{
        label: "# of coffee",
        backgroundColor: 'rgba(83, 120, 72, 0.3)',
        borderColor: 'rgba(83, 120, 72, 0.6)',
        borderWidth: 1,
        data: drinkRanks.map(function(data) { return data.qty; }),
      }],
    },
    options: {
      responsive: true,
      scales: {
        xAxes: [{
          ticks: {
            fontSize: 12
          }
        }],
        yAxes: [{
          ticks: {
            fontSize: 12,
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

