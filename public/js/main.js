$(document).ready(function () {
  $( "#registerBtn" ).click(function() {
    $('#login').css({
          'display':'none'
      });
    $('#registerBtn').css({
          'display':'none'
      });
    $('#loginBtn').css({
          'display':'block'
      });
    $('#register').css({
          'display':'block'
      });
    $('#forgotBtn').css({
          'display':'none'
      });
});
  $( "#loginBtn" ).click(function() {
    $('#register').css({
          'display':'none'
      });
      $('#loginBtn').css({
            'display':'none'
        });
      $('#registerBtn').css({
            'display':'block'
        });
    $('#login').css({
          'display':'block'
      });
    $('#forgotBtn').css({
          'display':'block'
      });
});
// $( "#restBtn" ).click(function() {
//   swal({
//     title: "Rest password",
//     text: "Check whether an email was sent to you.If you do receive an email try the process again",
//     icon: "info",
//   });
// });
});
