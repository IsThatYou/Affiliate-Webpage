$(document).ready(function() {
    var socket = io("http://127.0.0.1:3000/");
    socket.emit("campaign info");

    var totalUsers = 0;

    function updateHTML(data){
        $('#tableForUsers').append('<tr id="row' + data.Assigned_ID + '"><td>' 
            + data.Assigned_ID + '</td><td>'
            + data.Advertiser_ID + '</td><td><a href="/admin/campaigns?off_id=' + data.Assigned_ID + '">'
            + data.Name + '</a></td><td>' 
            + data.Total_Clicks + '</td><td>'
            + data.Total_Leads + '</td><td>'
            + data.Total_Sales + '</td><td>'
            + data.Short_D+ '</td><td><button type="button" id="' + data.Assigned_ID + '" class="btn btn-danger btn-xs">Remove</button></td></tr>');

    }
    

    socket.on("campaign_info", function(data){
        $("#tableForUsers").empty();
        if (data.results.length > 0){
            for (var i in data.results){
                //create a get
                updateHTML(data.results[i]);
                totalUsers++;
            }}
        $('#usersAmount').append(' (' + totalUsers + ')');
        
    });

    $(document).on("click", ".btn-danger", function(){
        var areusure = confirm("Are You Sure to Remove?");
        if (areusure){
            var id = $(this)[0].id;
            socket.emit("remove campaign", {ID: id});
            $("#row" + id).empty();
            $("#row" + id).remove();
        }
  });

});

