$(document).ready(function () {
  $('#add-message').on('submit',function (e) {
    e.preventDefault();
    var name = $('#name').val();
    var email = $('#email').val();
    var tel = $('#tel').val();
    var message = $('#message').val();

    if (!name || !email || !tel || !message) {
      swal({
				title: "Error!",
				text: "Try to fill all the spaces !",
				icon: "info",
			});
    }else {
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
          if (data) {
            $("#add-message").get(0).reset()
            swal({
              title: "Success!",
              text: "We'll get in touch!",
              icon: "success",
            });
          }
        },
        error: function (xhr,status,err) {
          console.log(err);
        }
      });
    }
  });
  $('#myform').on('submit',function (e) {
    e.preventDefault();
		// var newUser = new User();
    var username = $('#lname').val();
    var tel = $('#tel').val();
		var email = $('#email').val();
    var password = $('#password').val();
		if (!username || !tel || !email || !password) {
			swal({
				title: "Error!",
				text: "Try to fil all the spaces !",
				icon: "warning",
			});
		}else {
			$.ajax({
				url: 'https://api.mlab.com/api/1/databases/pharmacy-pos/collections/users?apiKey=dI9gXrgAznHkTgvdNOqCp_WKAwZD2KON',
				data: JSON.stringify({
					local:{
						"username" :username,
						"email" :email,
						"tel" : tel,
						"password" : password
					}
				}),
				type: "POST",
				contentType: "application/json",
				success:function (data,msg) {
					if (data) {
						$("#myform").get(0).reset()
						swal({
							title: "Successful registration!",
							text: "You can now login!",
							icon: "success",
						});
					}
				},
				error: function (xhr,status,err) {
					if (err) {
						console.log(err);
					}
				}
			});

		}
  });
});
