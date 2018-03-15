// $(document).ready(function () {
//   $( "#registerBtn" ).click(function() {
//     $('#login').css({
//           'display':'none'
//       });
//     $('#registerBtn').css({
//           'display':'none'
//       });
//     $('#loginBtn').css({
//           'display':'block'
//       });
//     $('#register').css({
//           'display':'block'
//       });
//     $('#forgotBtn').css({
//           'display':'none'
//       });
// });
//   $( "#loginBtn" ).click(function() {
//     $('#register').css({
//           'display':'none'
//       });
//       $('#loginBtn').css({
//             'display':'none'
//         });
//       $('#registerBtn').css({
//             'display':'block'
//         });
//     $('#login').css({
//           'display':'block'
//       });
//     $('#forgotBtn').css({
//           'display':'block'
//       });
// });
// $( "#forgotModal" ).click(function() {
//    $('#login-modal').modal().hide();
//
// });
// });

$(function() {

    $('#login-form-link').click(function(e) {
		$("#login-form").delay(100).fadeIn(100);
 		$("#register-form").fadeOut(100);
		$('#register-form-link').removeClass('active');
		$(this).addClass('active');
		e.preventDefault();
	});
	$('#register-form-link').click(function(e) {
		$("#register-form").delay(100).fadeIn(100);
 		$("#login-form").fadeOut(100);
		$('#login-form-link').removeClass('active');
		$(this).addClass('active');
		e.preventDefault();
	});

});
