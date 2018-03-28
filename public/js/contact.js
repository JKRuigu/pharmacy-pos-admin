$(document).ready(function () {
  $('#add-message').on('submit',function (e) {
    e.preventDefault();
    var message = $('#message').val();

    if (!message) {
      swal({
				title: "Error!",
				text: "Try to fill all the spaces !",
				icon: "info",
			});
    }else {
      $.ajax( {
        url: "/users/profile/messages",
        data: JSON.stringify({
          name :user.username,
          email :user.email,
          tel : user.tel,
					body: message
        }),
        type: "POST",
        contentType: "application/json",
        success:function (data,msg) {
          if (data) {
            $("#add-message").get(0).reset();
            swal({
              title: "Success!",
              text: "Sent, we will contact you shortly. Thank you.",
              icon: "success",
            });
          }
        },
        error: function (xhr,status,err) {
          swal({
            title: "Oopps!",
            text: "Error sending your message",
            icon: "info",
          });
        }
      });
    }
  });
});
