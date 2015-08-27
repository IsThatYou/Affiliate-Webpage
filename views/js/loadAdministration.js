$(document).ready(function() {

var publisher = 'testPublisher';
var campaignName = 'testCampaignName';
var startDate = 'mm-dd-yy';
var endDate = 'mm-dd-yy';

$('#detailsText').append(' ' + publisher + ' for campaign ' + campaignName + ' from ' + startDate + ' to ' + endDate + '.');

for (var i = 0; i<7;i++)
{

var dateStamp = 'mm-dd-yy';
var bannerId = 111 + i;
var referrer = 'test' + i;
var ipAddress = '111.11.11.1' + i;
var cookieId = '32d2dsa243dfasada3214';
var publisherOptInfo = 'dTest';
var advertiserOptInfo ='AdTest';
var deployId = 0;
var landingPageId = 0;
var poolId = 0;

$('#tableForDetails').append('<tr id="row'+i+'"><td>'+ dateStamp +'</td><td>' + bannerId + '</td><td>' + ipAddress +'</td><td>' + referrer + '</td><td>' + cookieId + '</td><td>' + publisherOptInfo + '</td><td>' + advertiserOptInfo + '</td><td>' + deployId + '</td><td>' + landingPageId + '</td><td>' + poolId +'</td><td><button type="button" onClick=removeRow('+i+') class="btn btn-danger btn-xs">Remove</button></td></tr>');
}

});

function removeRow (id) {
	console.log(id);
	alert('remove row ' + id);
	$('#row'+ id).hide();
}