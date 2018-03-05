$(document).ready(function () {
  $('#add-email').on('submit',function (e) {
    e.preventDefault();
    var email = $('#email').val();
    $.ajax( {

      url: 'https://api.mlab.com/api/1/databases/pharmacy-pos/collections/users?apiKey=dI9gXrgAznHkTgvdNOqCp_WKAwZD2KON&q=',
		  data: JSON.stringify({
         "email" :email,
     }),
		  type: "PUT",
		  contentType: "application/json",
      success:function (data,msg) {
          window.location.href="profile",
          alert( msg)
      }
    });
  });
});
