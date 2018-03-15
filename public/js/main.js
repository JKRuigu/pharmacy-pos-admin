

$(function() {


	$('#register-form-link').click(function(e) {
      $('#login-header2').css({'display':'none'});
      $('#login-header').css({'display':'block'});

		$("#register-form").delay(100).fadeIn(100);
 		$("#login-form").fadeOut(100);
		$('#login-form-link').removeClass('active');
		$(this).addClass('active');
		e.preventDefault();
	});

  $('#login-form-link').click(function(e) {
  $('#login-header').css({'display':'none'});
  $('#login-header2').css({'display':'block'});
  $("#login-form").delay(100).fadeIn(100);
  $("#register-form").fadeOut(100);
  $('#register-form-link').removeClass('active');
  $(this).addClass('active');
  e.preventDefault();
});

});
