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
      $.getJSON("https://api.mlab.com/api/1/databases/pharmacy-updates/collections/updates?apiKey=dI9gXrgAznHkTgvdNOqCp_WKAwZD2KON",
      function (data) {
        // console.log(data);
        var updates_data ='';
        $.each(data, function (key,value) {
            updates_data += '<div class="card">';
            updates_data += '<h6 class="card-header ">' +value.title+'</h6>';
            updates_data += '<div class="card-body">';
            updates_data += '<p>' +value.paragraph2+'</p>';
            updates_data += '<p>' +value.others+'</p>';
            updates_data += '</div>';
            updates_data += '<small class="card-footer">' +value.date+ ' Pharmacy-pos:powered by :'+ ' <a href="http://magnumdigitalke.com/" class="card-link">'+'Magnum digital Media Ke'+'</a>'+'  '+'</small>';
            updates_data += '</div>';
        });
        $('#updates_div').append(updates_data);
      });
});
