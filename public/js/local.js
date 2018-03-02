$(function () {

  var $data = $('#users')
  $.ajax({
    type:'GET',
    url:'https://api.mlab.com/api/1/databases/pharmacy-pos/collections/users?apiKey=dI9gXrgAznHkTgvdNOqCp_WKAwZD2KON',
    success:function (data) {
      $.each(data,function (i, data) {
          if (data.local)
        $data.append('<tr>'+ '<td>'+data.local.username+ '</td>' + '<td>'+data.local.password+ '</td>' +'</tr');
      }
    );
    }
  });
});
