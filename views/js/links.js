$(function() {
	var socket = io("http://127.0.0.1:3000/");
	var campaign_id;
	socket.emit("request_approved_campaign", {Campaign_ID: campaign_id});
}