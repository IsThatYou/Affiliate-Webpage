$(function() {
	var socket = io("http://192.168.0.46:3000/");
	var campaign_id;
	socket.emit("request_approved_campaign", {Campaign_ID: campaign_id});
}