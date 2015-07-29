$(function() {
	var socket = io('http://127.0.0.1:3000/');
	socket.on("aflogin", function(data){
		console.log('sssssssssssss');
		var message = data.message;
		var warning = $("#warning1");
		if (warning){
			warning.remove();
		}
		$("#maintitle").after('<div class="alert alert-danger" id = "warning1" >' + message + '</div>');
		$("#maintitle").after('<div class="alert alert-danger" id = "warning1" >' + message + '</div>');
		socket.emit("disconnect1");
	});
	socket.on("aflogin_delete", function(){
		$("#warning1").remove();
		socket.emit("disconnect1_delete");
	});
});