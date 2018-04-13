$(document).ready(function () {
  $( "#monthly" ).click(function() {
    $('#monthly-text').css({'display':'none'});
    $('#yeary-text').css({'display':'block'});
    $('.summary-content').css({'display':'block'});
    $('#checkOut').css({'display':'block'});
    $('#formNum').css({'display':'block'});
    $('#life-text').css({'display':'block'});
    $('#monthlyCard').css({'display':'block'});
    $('#lifetimeCard').css({'display':'none'});
    $('#yearCard').css({'display':'none'});
		$("#monthlyCard").delay(500).slideDown("slow");
 		$("#monthly-text").fadeOut(200);
    $("#packageType").text('Monthly');
    $("#packageTitle").text('Monthly');
    $("#NumberOf").text('Number of months');
    $(".summary-text").text('2,999.00/=');
    $("#NumberOfItem").val('1');
    computeTotal();
});

  $( "#yeary" ).click(function() {
    $('#yeary-text').css({'display':'none'});
    $('#monthly-text').css({'display':'block'});
    $('.summary-content').css({'display':'block'});
    $('#checkOut').css({'display':'block'});
    $('#formNum').css({'display':'block'});
    $('#life-text').css({'display':'block'});
    $('#yearCard').css({'display':'block'});
    $('#monthlyCard').css({'display':'none'});
    $('#lifetimeCard').css({'display':'none'});
		$("#yearCard").delay(500).slideDown("slow");
 		$("#plan-text").fadeOut(200);
    $("#packageType").text('Yearly');
    $("#packageTitle").text('Yearly');
    $("#NumberOf").text('Number of years');
    $(".summary-text").text('29,999.00/=');
    $("#NumberOfItem").val('1');
    computeTotal();
});
  $( "#lifeTime" ).click(function() {
    $('#life-text').css({'display':'none'});
    $('#formNum').css({'display':'none'});
    $('.summary-content').css({'display':'block'});
    $('#checkOut').css({'display':'block'});
    $('#monthly-text').css({'display':'block'});
    $('#yeary-text').css({'display':'block'});
    $('#lifetimeCard').css({'display':'block'});
    $('#monthlyCard').css({'display':'none'});
    $('#yearCard').css({'display':'none'});
		$("#lifetimeCard").delay(500).slideDown("slow");
 		$("#plan-text").fadeOut(200);
    $("#packageType").text('Life Time');
    $("#packageTitle").text('Lifetime');
    $(".summary-text").text('Ksh 39,999.00/=');
    computeTotal();
});
  $( "#checkOut" ).click(function() {
    $("#checkOut").text('Processing..');
    setTimeout(function(){
      $("#checkOut").text('CheckOut');
    }, 300);
});
});
