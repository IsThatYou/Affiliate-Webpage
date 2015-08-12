$(document).ready(function() {
    //alert("load data from database");

    // Amount from the data
    var totalClicks = 0;
    var totalActions = 0;
    var totalCPA = 0;
    var totalAmount = 0;

    for (var i = 0; i < 7; i++) {

        var campaignId = 123456 + i;
        var campaignName = 'testCampaign' + i;
        var subId = i;
        var clicks = 1001 + i;
        var cpc = 23;
        var actions = 0;
        var cpa = 0;
        var sales = 23;
        var rev = 0;
        var convRate = 0;
        var total = 5423 + i;
        var eCpc = 0;

        $('#tableForReports').append('<tr id="row' + i + '"><td>' + campaignId + '</td><td>' + campaignName + '</td><td>' + subId + '</td><td>' + clicks + '</td><td>' + cpc + '</td><td>' + actions + '</td><td>$' + cpa + '</td><td>' + sales + '</td><td>' + rev + '</td><td>' + convRate + '%</td><td>$' + total + '</td><td>$' + eCpc + '</tr>');

        totalAmount = totalAmount + total;
        totalActions = totalActions + actions;
        totalCPA = totalCPA + cpa;
        totalClicks = totalClicks + clicks;
    }

    $('#totalClicks').append(totalClicks);
    $('#totalActions').append(totalActions);
    $('#totalCPA').append('$' + totalCPA);
    $('#totalAmount').append('$' + totalAmount);


    // Updates the list when the update button is pressed
    $('#updateReportButton').click(function() {
        alert('update the following list');
        var startDate = document.getElementById("start").value;
        var endDate = document.getElementById("end").value;
        console.log("From " + startDate + " to " + endDate);
        var actionsOnly = document.getElementById("actionsOnly").checked;
        var showSubIDs = document.getElementById("actionsOnly").checked;
        //TODO: new mysql query with the new dates and options
    });
});