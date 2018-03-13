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
});
});
