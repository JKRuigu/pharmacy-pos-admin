$(document).ready(function () {
  $('#add-updates').on('submit',function (e) {
    e.preventDefault();
    var title = $('#title').val();
    var date = $('#date').val();
  //  var  paragraph= $('paragraph').val();
    var paragraph2 = $('#paragraph2').val();
    var others = $('#others').val();

    $.ajax( {
      url: "https://api.mlab.com/api/1/databases/pharmacy-updates/collections/updates?apiKey=dI9gXrgAznHkTgvdNOqCp_WKAwZD2KON",
		  data: JSON.stringify({
        "title" :title,
         "date" :date,
        // "paragraph" : paragraph,
         "paragraph2" : paragraph2,
         "others" : others
     }),
		  type: "POST",
		  contentType: "application/json",
      success:function (data,msg) {
          window.location.href="admin-updates",
          alert( msg)

      },
      error: function (xhr,status,err) {
        //console.log('data sent!');
        console.log(err);
      }
    });
  });
});
