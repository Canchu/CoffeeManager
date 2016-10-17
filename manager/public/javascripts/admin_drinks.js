$(function() {
  var $main = $("#main");
  var drinks = $main.data('drinks');

  // 編集を保存
  $("#saveChanges").click(function(e) {
    var newPrices = [];
    drinks.forEach(function(drink) {
      var newPrice = parseInt($("#" + drink.id).val());
      if (newPrice !== drink.price) {
        newPrices.push({
          id: drink.id,
          price: newPrice,
        });
      }
    });

    if (newPrices.length > 0) {
      $.ajax({
        type: 'PUT',
        url: 'http://localhost:3000/api/drinks',
        data: JSON.stringify(newPrices),
        contentType: 'application/JSON',
        success: function() {
          alert('ええで');
          location.reload();
        },
        error: function(data) {
          console.log('あかん');
        }
      });
    } else {
      alert('なんも変わっとらんよ');
    }
  });

  // 編集を破棄
  $("#discardChanges").click(function(e) {
    drinks.forEach(function(drink) {
      $("#" + drink.id).val(drink.price);
    });
  });
})
