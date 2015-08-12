$(function() {
	console.log('sssssssssssss');
	var socket = io('http://192.168.0.22:3000/',  {
'sync disconnect on unload': true });
	socket.on("aflogin", function(data){
		
		var message = data.message;
		var warning = $("#warning1");
		if (warning){
			warning.remove();
		}
		$("#maintitle").after('<div class="alert alert-danger" id = "warning1" >' + message + '</div>');
		$("#maintitle").after('<div class="alert alert-danger" id = "warning1" >' + message + '</div>');
		socket.emit("disconnect1");
	});
	socket.on("aflogin_delete", function(data){
		console.log("haha");
		$("#warning1").remove();
		socket.emit("disconnect1_delete");
	});
});