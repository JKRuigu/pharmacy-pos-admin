$(document).ready(function () {
  $('#add-message').on('submit',function (e) {
    e.preventDefault();
    var name = $('#name').val();
    var email = $('#email').val();
    var tel = $('#tel').val();
    var message = $('#message').val();

    $.ajax( {
      url: "https://api.mlab.com/api/1/databases/pharmacy-contact/collections/contact?apiKey=dI9gXrgAznHkTgvdNOqCp_WKAwZD2KON",
		  data: JSON.stringify({
        "name" :name,
         "email" :email,
         "tel" : tel,
       "message" : message
     }),
		  type: "POST",
		  contentType: "application/json",
      success:function (data,msg) {
          window.location.href="contact",
          alert( msg)

      },
      error: function (xhr,status,err) {
        console.log(err);
      }
    });
  });
});
