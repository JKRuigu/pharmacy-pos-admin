$(function () {

  var $data = $('#users2')
  $.ajax({
    type:'GET',
    url:'https://api.mlab.com/api/1/databases/pharmacy-pos/collections/users?apiKey=dI9gXrgAznHkTgvdNOqCp_WKAwZD2KON',
    success:function (data) {
      $.each(data, function (i, data) {
        if (data.google)
          $data.append('<tr>'+'<td>'+data.google.username+ '</td>' + '<td>'+  data.google.email+'</td>' +'</tr');
        }
      );
    }
  });
});
