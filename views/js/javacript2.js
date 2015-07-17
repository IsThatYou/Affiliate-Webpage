$(document).ready(function(){
	var socket = io("http://127.0.0.1:3000/approve");
	console.log("client socket working...");
	socket.emit("request_application_info");

	//use both empty and remove when removing DOM
	//Haven't been tested yet
	function updateHTML(data){
		/*
		$(".content").append("<div class='firstArea panel panel-default' id=" + data.approved.tostring() + ">" + 
              "<div class='row'>" + 
                "<div class='col-xs-12 padding style=width:100%'>" +
                  "<div class='input-daterange input-group' id='datepicker'>" +
                    "<a class='btn btn-link'>" +
                    "<h2>" + data.FirstName + data.LastName + "</h2>" +
                  "</a>" +
                  "</div>" +
                "</div>" +
              "</div>" +
              "<div class='row'>" +
                "<div class='padding'>" +
                  "<div>" +
                    "<div class='col-md-3'><h6> SSN/Tax ID: <strong>" + data.SSN_Tax_ID + "</strong></h6></div>" +
                    "<div class='col-md-3'><h6>Site URL: <strong>" + data.URL1 + "</strong></h6></div>" +
                    "<div class='col-md-3'><h6>Site Categories: <strong>" + data.Site_Category1 + "</strong></h6></div>"+
                  "</div>" +
                  "<div>" +
                    "<div class='col-md-8'><h6><strong>" + data.Address1 + data.City + data.State + data.Country + data.Zip + "</strong></h6></div>" +
                    "<div class='col-md-4'><h6>Phone: <strong>" + data.Phone + "</strong></h6></div>" +
                    
                  "</div>" +
                  "<a class='btn btn-danger btn-sm pull-right' href='#' style='width:18%;margin-right:15px' role='button'>Deny</a>" +
                  "<a class='btn btn-success btn-sm pull-right' href='#' style='width:18%;' role='button'>Approve</a>" +
                "</div>" +
              "</div>" +
              "</div>");*/)
		conlose.log("success");
	};
	socket.on("application_info", function(data){
		updateHTML(data);
	});


});