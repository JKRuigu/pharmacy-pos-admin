$(function () {

  var $data = $('#users3')
  $.ajax({
    type:'GET',
    url:'https://api.mlab.com/api/1/databases/pharmacy-pos/collections/users?apiKey=dI9gXrgAznHkTgvdNOqCp_WKAwZD2KON',
    success:function (data) {
      console.log(data);
      $.each(data,function (i, data) {
            if (data.facebook)
        $data.append('<tr>'+ '<td>'+data.facebook.name+ '</td>' + '<td>'+data.googleplus.email+ '</td>'+'</td');
      });
    }
  });
});
