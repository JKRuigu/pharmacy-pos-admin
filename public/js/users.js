$(function () {
  $.ajax({
    type:'GET',
    url:'https://api.mlab.com/api/1/databases/pharmacy-pos/collections/users?apiKey=dI9gXrgAznHkTgvdNOqCp_WKAwZD2KON',
    success:function (users) {
      $.each(users,function (i, data) {
        if (data.local) $("#users").append('<tr>'+ '<td>'+data.local.username+ '</td>' + '<td>'+data.local.password+ '</td>' +'</tr>');
        if (data.facebook) $("#users3").append('<tr>'+ '<td>'+data.facebook.name+ '</td>' + '<td>'+(typeof data.google !== 'undefined'? data.google.email: "")+ '</td>'+'</td>');
        if (data.google) $("#users2").append('<tr>'+'<td>'+data.google.username+ '</td>' + '<td>'+  data.google.email+'</td>' +'</tr>');
      });
    }
  });
});