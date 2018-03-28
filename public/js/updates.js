$(document).ready(function () {
  $('#add-updates').on('submit',function (e) {
    e.preventDefault();
    var title = $('#title').val();
    var date = $('#date').val();
    var body = $('#body').val();

    if(!title || !date || !body){
      swal({
        title: "Error!",
        text: 'All fields are required.',
        icon: "error"
      });
    }

    $.ajax( {
      url: "/admin/updates",
		  data: JSON.stringify({
        title, date, body
     }),
		  type: "POST",
		  contentType: "application/json",
      success:function (data,msg) {
          swal({
            icon: "info",
            title: "Sent",
            type: 'success',
            text: "Update added successfully"
          }).then(function () {
            $('#addUpdatesForm').modal('hide');
          });
      },
      error: function (xhr,status,err) {
        var message;
        if (xhr.responseJSON)
          message = xhr.responseJSON.status;
        else if(msg)
          message = msg;
        else
          message = "Fatal error.";
        swal({
          title: "Error!",
          text: message,
          icon: "error"
        });
      }
    });
  });

  var updates_data ='';
  if(updates.length !== 0){
    updates.forEach(function (value, index) {
      updates_data += '<div class="card">';
      updates_data += '<h3 class="card-header ">' +value.title+'</h3>';
      updates_data += '<div class="card-body">';
      updates_data += '<p>' +value.body+'</p>';
      updates_data += '</div>';
      updates_data += '<small class="card-footer">'+ 'Updated on '+ value.date+'</small>';
      updates_data += '</div>';
    });
  } else {
    updates_data += '<div class="card">';
    updates_data += '<h3 class="card-header ">No updates</h3>';
    updates_data += '<div class="card-body">';
    updates_data += '<p>No Updates available, use the + to add them.</p>';
    updates_data += '</div>';
    updates_data += '</div>';
  }
  $('#updates_div').append(updates_data);

});

//TODO:: Add delete and update capability