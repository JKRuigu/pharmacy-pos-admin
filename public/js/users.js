$(function () {
  $.ajax({
    type:'GET',
    url:'https://api.mlab.com/api/1/databases/pharmacy-pos/collections/users?apiKey=dI9gXrgAznHkTgvdNOqCp_WKAwZD2KON',
    success:function (users) {
      $.each(users,function (i, data) {

        if (data) $("#users").append('<tr>'+ '<td>'+data.username+ '</td>' + '<td>'+data.tel+ '</td>'+ '<td>'+data.email+ '</td>'+ '<td>'+data.active+ '</td>' +'</tr>');
      });
    }
  });
});
