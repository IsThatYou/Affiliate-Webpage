$(function() {
  var socket = io("http://127.0.0.1:3000/");
  socket.emit("application ad info");
  $("#app-content").append("There seems to be nothing left.");

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
                    "<div class='col-md-4'><h6>Affiliate Marketing: <strong>" + data.Affiliate_Marketing + "</strong></h6></div>" +
                    "<div class='col-md-4'><h6>Site Media Buying: <strong>" + data.Media_Buying + "</strong></h6></div>" +
                    "<div class='col-md-4'><h6>Campaign Development: <strong>" + data.Campaign_Dev + "</strong></h6></div>"+
                    
                  "</div>" +
                  "</div>" +
                  "<div>" +
                    "<div class='col-md-4'><h6>Lead Genneration: <strong>" + data.Lead_Gene + "</strong></h6></div>"+
                    "<div class='col-md-4'><h6>Search Engine Optimization: <strong>" + data.SEO + "</strong></h6></div>"+
                  "</div>" +
                  "<div>" +
                    "<div class='col-md-8'><h6>Address: <strong>" + data.Address + data.City + data.State + data.Country + data.Zip + "</strong></h6></div>" +
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
  socket.on("application_ad_info", function(data){
    $("#app-content").empty();
    console.log(data.results.length);
    if (data.results.length > 0){
    for (var i in data.results){
      if (data.results[i].Affiliate_Marketing != 'No'){
        data.results[i].Affiliate_Marketing = 'Yes';
      } 
      if (data.results[i].Media_Buying != 'No'){
        data.results[i].Media_Buying = 'Yes';
      } 
      if (data.results[i].Campaign_Dev != 'No'){
        data.results[i].Campaign_Dev = 'Yes';
      } 
      if (data.results[i].Lead_Gene != 'No'){
        data.results[i].Lead_Gene = 'Yes';
      } 
      if (data.results[i].SEO != 'No'){
        data.results[i].SEO = 'Yes';
      } 

      updateHTML(data.results[i]);
    }}
    
  });

  var $buttons = $(".btn-danger");
  $(document).on("click", ".btn-danger", function(){
    var id = $(this)[0].id;
    console.log(id);
  });
  // Approve
  $(document).on("click", ".btn-success", function(){
    var id = $(this)[0].id;
    socket.emit("approve2", {ID: id});
    var name = "wrap"  + id;
    $("#" + name).empty();
    $("#" + name).remove();
  });
  // Deny
  $(document).on("click", ".btn-danger", function(){
    var id = $(this)[0].id;
    socket.emit("deny2", {ID: id});
    var name = "wrap"  + id;
    $("#" + name).empty();
    $("#" + name).remove();
  });

});