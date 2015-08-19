$(document).ready(function() {

    // Amount from the data
    var campaignTarget = "testTarget";
    var payout = 11;
    var campaignExp = "testExp";
    var campaignLimits = "testLimits";

    $('#campaignTarget').append(campaignTarget);
    $('#payout').append('$' + payout);
    $('#campaignExp').append(campaignExp);
    $('#campaignLimits').append(campaignLimits);

    $('#downloadSuppressionFile').click(function() {
        alert('download suppression file');
    });

    $('#viewHTMLForAds').click(function() {
        alert('show html');
    });

    $('#deployAds').click(function() {
        alert('deploy ads');
    });

    $('#deployBanners').click(function() {
        alert('deploy banners');
    });
});