$(function () {
  $.ajax({
    type:'GET',
    url:'https://api.mlab.com/api/1/databases/pharmacy-pos/collections/users?apiKey=dI9gXrgAznHkTgvdNOqCp_WKAwZD2KON',
    success:function (users) {
      $.each(users,function (i, data) {
        // console.log('users table',req.app.locals.user );
        if (data) $("#users").append('<tr>'+ '<td>'+data.email+ '</td>' + '<td>'+data.tel+ '</td>'+ '<td>'+data.subscriptions[0].activationDate+ '</td>'+ '<td>'+data.subscriptions[0].expiryDate+ '</td>'+ '<td>'+ data.subscriptions[0].status + '</td>' +'</tr>');
      });
    }
  });
});
