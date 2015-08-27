$(function() {
	var socket = io("http://127.0.0.1:3000/");
  socket.emit("application info", {message: '1'});
  $("#app-content").append("There seems to be nothing left.");
  //var $button = $('.btn');
	//use both empty and remove when removing DOM
	//Haven't been tested yet
  
	function updateHTML(data){
		
		$("#app-content").append("<div class='firstArea panel panel-default' id='wrap" + data.Assigned_ID + "'>" + 
              "<div class='row'>" + 
                "<div class='col-xs-12 padding style=width:100%'>" +
                  "<div class='input-daterange input-group' id='datepicker'>" +
                    "<a class='btn btn-link'>" +
                    "<h2>" + data.First_Name + ' ' +data.Last_Name + "</h2>" +
                  "</a>" +
                  "</div>" +
                "</div>" +
              "</div>" +
              "<div class='row'>" +
                "<div class='padding'>" +
                  "<div>" +
                    "<div class='col-md-3'><h6> SSN/Tax ID: <strong>" + data.SSN_TAX_ID + "</strong></h6></div>" +
                    "<div class='col-md-3'><h6>Site URL: <strong>" + data.Site_URL1 + "</strong></h6></div>" +
                    "<div class='col-md-3'><h6>Site Categories: <strong>" + data.Site_Category1 + "</strong></h6></div>"+
                  "</div>" +
                  "<div>" +
                    "<div class='col-md-8'><h6><strong>" + data.Address1 + data.City + data.State + data.Country + data.Zip + "</strong></h6></div>" +
                    "<div class='col-md-4'><h6>Phone: <strong>" + data.Phone + "</strong></h6></div>" +
                    
                  "</div>" +
                  "<a class='btn btn-danger btn-sm pull-right' id='" + data.Assigned_ID+'' + "' style='width:18%;margin-right:15px' role='button'>"  + "Deny</a>" +
                  "<a class='btn btn-success btn-sm pull-right' style='width:18%;' role='button' id='" + data.Assigned_ID+'' + "'>"  + "Approve</a>" +
                "</div>" +
              "</div>" +
              "</div>");
		console.log("success");
	};
  
  var email = '';
	socket.on("application_info", function(data){
    $("#app-content").empty();
    console.log(data.results.length);
    if (data.results.length > 0){
    for (var i in data.results){
      
      updateHTML(data.results[i]);
    }}
		
	});
  /*
  var halo = $('#halo');
  halo.on("click", function(){
    console.log($(this)[0].id);
  })*/
  var $buttons = $(".btn-danger");
  $(document).on("click", ".btn-danger", function(){
    var id = $(this)[0].id;
    console.log(id);
  });
  // Approve
  $(document).on("click", ".btn-success", function(){
    var id = $(this)[0].id;
    socket.emit("approve", {ID: id});
    var name = "wrap"  + id;
    $("#" + name).empty();
    $("#" + name).remove();
  });
  // Deny
  $(document).on("click", ".btn-danger", function(){
    var id = $(this)[0].id;
    socket.emit("deny", {ID: id});
    var name = "wrap"  + id;
    $("#" + name).empty();
    $("#" + name).remove();
  });

});