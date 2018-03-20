$(function() {
	$('#register-form-link').click(function(e) {
    $('#login-header2').css({'display':'none'});
    $('#login-header').css({'display':'block'});
		$("#register-form").delay(200).slideDown("slow");
 		$("#login-form").fadeOut(200);
		$('#login-form-link').removeClass('active');
		$(this).addClass('active');
		e.preventDefault();
	});
  $('#login-form-link').click(function(e) {
  $('#login-header').css({'display':'none'});

	$('#login-header2').css({'display':'block'});
  $("#login-form").delay(200).slideDown("slow");
  $("#register-form").fadeOut(200);
  $('#register-form-link').removeClass('active');
  $(this).addClass('active');
  e.preventDefault();
});
});
