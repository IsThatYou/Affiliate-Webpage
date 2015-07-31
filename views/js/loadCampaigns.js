$(document).ready(function() {
    //alert("load data from database");

    // Amount from the data
    var amount = 0;

    var image = 0;
    var type = 'Campaign ';
    var name = 'Test ';
    var update = 'mm-dd-yy';
    var startDate = 'mm-dd-yy';
    var description = 'lorem ipsum';
    var exp = 'mm-dd-yy';
    var payout = 100;

    for (var i = 0; i < 7; i++) {

        var image = image + i;
        var type = 'Campaign ' + i;
        var name = 'Test ' + i;
        var update = update;
        var startDate = startDate;
        var description = description;
        var exp = exp;
        var payout = payout + 100 * i;

        $('#tableForCampaigns').append('<tr id="row' + i + '"><td>' + image + '</td><td>' + type + '</td><td>' + name + '</td><td>' + update + '</td><td>' + startDate + '</td><td>' + description + '</td><td>' + exp + '</td><td>' + payout + '</td><td>');
        amount++;
    }

    $('#campaignAmount').append(' (' + amount + ')');

});