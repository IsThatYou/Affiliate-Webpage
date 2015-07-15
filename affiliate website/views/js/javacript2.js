$(document).ready(function(){
	var socket = io();

	function updateHTML(data){
		
	};
	socket.on("new application", function(data){
		updateHTML(data);
	});


});