$(document).ready(function() {
    var socket = io("http://192.168.0.46:3000/");
    socket.emit("application info", {message: '0'});

    var totalUsers = 0;

    function updateHTML(data){
        $('#tableForUsers').append('<tr id="row' + data.Assigned_ID + '"><td>' 
            + data.Assigned_ID + '</td><td><a href="/admin/users?aff_id=' + data.Assigned_ID + '">' 
            + data.First_Name + ' ' + data.Last_Name +'</a></td><td>' 
            + data.Company + '</td><td>'
            + data.Email + '</td><td>'
            + data.Site_URL1 + '</td><td><button type="button" id="' + data.Assigned_ID + '" class="btn btn-danger btn-xs">Remove</button></td></tr>');

    }
    

    socket.on("application_info2", function(data){
        $("#tableForUsers").empty();
        if (data.results.length > 0){
            for (var i in data.results){
                //create a get
                console.log(data.results[i].Name);
                updateHTML(data.results[i]);
                totalUsers++;
            }}
        $('#usersAmount').append(' (' + totalUsers + ')');
        
    });

    $(document).on("click", ".btn-danger", function(){
        var id = $(this)[0].id;
        socket.emit("remove affiliate", {ID: id});
        $("#row" + id).empty();
        $("#row" + id).remove();
  });

});

