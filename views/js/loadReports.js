$(document).ready(function() {
alert("load data from database");

// Amount from the data
var totalClicks = 0;
var totalActions = 1;
var totalCPA = 2;
var totalAmount = 3;

$('#totalClicks').append(totalClicks);
$('#totalActions').append(totalActions);
$('#totalCPA').append('$' + totalCPA);
$('#totalAmount').append('$' + totalAmount);

$('#updateReportButton').click(function() {
var startDate = document.getElementById("start").value;
var endDate = document.getElementById("end").value;
var actionsOnly = document.getElementById("actionsOnly").checked;
var showSubIDs = document.getElementById("actionsOnly").checked;
//TODO: new mysql query with the new dates and options
});
});
