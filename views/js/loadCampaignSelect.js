$(document).ready(function() {
    //alert("load data from database");

    // Amount from the data

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

        $('#tableForCampaignSelect').append('<tr id="row' + i + '"><td><input type="checkbox" name="row'+i+'"></td><td>' + image + '</td><td>' + type + '</td><td><a href="#">' + name + '</a></td><td>' + update + '</td><td>' + startDate + '</td><td>' + description + '</td><td>' + exp + '</td><td>' + payout + '</td><td>');
    }


    // Limits the amount of allowed selects
    var max = 5;
    var checkboxes = $('input[type="checkbox"]');

    checkboxes.change(function(){
        var current = checkboxes.filter(':checked').length;
        checkboxes.filter(':not(:checked)').prop('disabled', current >= max);
    });

    $('#campaignAmount').append(' (max ' + max + ')');

});