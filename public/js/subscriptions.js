let systemUsers = [];

$("#activateForm").submit((e) =>{
  e.preventDefault();
  var selected = $("#time").val();
  var now = moment()
  var expiryDate = now;
  const id =$("#userId").val();
  if (selected === '0'){
    expiryDate = now.add(parseInt($("#months").val()), 'months');
  } else if (selected === '1'){
    expiryDate = now.add(parseInt($("#years").val()), 'years');
  } else if (selected === '2'){
    expiryDate = now.add(10, 'years');
  } else {
    $("#activationError").text("No package selected");
    return;
  }
  let data = {
    expiryDate: expiryDate._d,
    activationDate: moment()._d,
    status: 1
  };
  axios.post(`/admin/${id}/activate`, data).then( response => {
    if(response.data.status === 'ok') swal({
      title: "Success...",
      text: "Subscription added...!!",
      icon: "info"
    }).then( ()=> {
      $("#activate-modal").modal("hide"); // Hide modal
      getUsers();
    })
  }).catch( error => {
    swal({
      title: "Error adding subscription...!!",
      text: error.message,
      icon: "error",
      dangerMode: true,
    })
  });
});
$("#deactivateForm").submit((e) =>{
  e.preventDefault();
  const id =$("#userIdDe").val();
  let user = systemUsers[id];
  let updates = [];
  $("#subscriptionsTable").children('.subscription-row').each((index, element)=>{
    updates[index] ={
      index: $(element).find('.index').val(),
      status: $(element).find('.statusValue').val(),
      checked: $(element).find('.status')[0].checked
    };
  });
  user.subscriptions.forEach((subscription, index)=> {
    if (updates[index].status==='1')
      subscription.status = updates[index].checked?0:1;
    else
      subscription.status = updates[index].checked?1:0;
  });
  axios.post(`/admin/${id}/deactivate`, user.subscriptions).then( response => {
    if(response.data.status === 'ok') swal({
      title: "Success...",
      text: "Subscription updated...!!",
      icon: "info"
    }).then( ()=> {
      $("#deactivate-modal").modal("hide"); // Hide modal
      getUsers();
    })
  }).catch( error => {
    swal({
      title: "Error updating subscription...!!",
      text: error.message,
      icon: "error",
      dangerMode: true,
    })
  });
});


function reloadUsersTable(id=null) {
  var userTable = $("#userTable");
  userTable.text('');
  if(systemUsers) {
    let i =1;
    for(let user in systemUsers){
      if(systemUsers[user]._id== id) continue;
      userTable.append('<tr><td>'+((page-1)*perPage+i)+'</td><td>'+systemUsers[user].username+ '</td>'+
        '<td><buttton class="btn btn-sm btn-success" onClick="showActivateModal(\''+systemUsers[user]._id+'\')">Activate</buttton>'+
        '<button class="btn btn-warning btn-sm '+(systemUsers[user].subscriptions===undefined?'disabled': '')+'\" onClick="showDeactivateModal(\''+systemUsers[user]._id+'\')">Deactivate</button>'+
        '<button class="btn btn-danger btn-sm" onclick="deleteUser(\''+systemUsers[user]._id+'\')">Delete</button></td></tr>');
      i++;
    }
  }else {
    userTable.text("No subscribed users...");
  }
}

function showActivateModal(id) {
  let user = systemUsers[id];
  $("#activateUsername").text(user.username);
  $("#userId").val(id);
  $("#activationError").text('');
  $("#activate-modal").modal("show");
}

function showDeactivateModal(id) {
  let user = systemUsers[id];
  let subscriptionsTable = $("#subscriptionsTable");
  subscriptionsTable.text('');
  user.subscriptions.forEach( (subscription, index) =>{
    let activationDate = moment(subscription.activationDate).format('DD/MM/YYYY');
    let expiryDate = moment(subscription.expiryDate).format('DD/MM/YYYY');
    let color = subscription.status===1?'success':'warning';
    let disabled = subscription.status===0?'check':'simple-remove';
    let data = subscription.status===0?'Activate':'Deactivate';
    subscriptionsTable.append(`<tr class="text-${color} subscription-row">
          <td><input type="hidden" class="index" value="${index}"><input type="hidden" class="statusValue" value="${subscription.status}">${index+1}</td>
          <td>${activationDate}</td>
          <td>${expiryDate}</td>
          <td>
            <div class="form-check" title="${data}">
              <label class="form-check-label">
                <input class="form-check-input status" type="checkbox">
                <span class="form-check-sign"></span>
              </label>
              <i class="now-ui-icons ui-1_${disabled}"></i>
            </div>
        </td>
      </tr>`);
  });
  $("#deactivateUsername").html(`<i class="now-ui-icons users_single-02"></i> ${user.username}`);
  $("#userIdDe").val(user._id);
  $("#deactivationError").text('');
  $("#deactivate-modal").modal("show");
}

function deleteUser(id) {
  swal({
    title: "Are you sure?",
    text: "Once deleted, you will not be able to recover user information!",
    icon: "warning",
    buttons: true,
    dangerMode: true,
  }).then((willDelete) => {
    if(willDelete)
      return axios.delete(`/admin/${id}/delete`);
  }).then(deleted => {
    if (deleted){
      swal("Poof! User deleted!", {
        icon: "success",
      });
      reloadUsersTable(id);
    }
  }).catch(error =>{
    swal("User not deleted!"+error);
  });
}

function getOption() {
  let option = $("#time").val();
  let error = $("#activationError");
  let monthsInput = $("#monthsInput");
  let yearsInput = $("#yearsInput");
  error.text('');
  if (option === '0') {
    monthsInput.show();
    yearsInput.hide();
  } else if (option === '1') {
    monthsInput.hide();
    yearsInput.show();
  } else if (option === '2') {
    monthsInput.hide();
    yearsInput.hide();
  } else {
    monthsInput.hide();
    yearsInput.hide();
    error.text("Please selecting a package");
  }
}