$(document).ready(function() {
    var socket = io();

    var lasturl = window.location.href;
    var index = lasturl.indexOf("off_id=");
    index = index + 7;
    // off_id
    var desire = lasturl.substr(index, lasturl.length - index);
    console.log(desire);


    $('#deleteCampaign').click(function() {
        var r = confirm("Are you sure you want to delete the campaign?");
        if (r == true) {
            socket.emit("delete campaign", {message: desire});
            history.go(-1);
        } 
    });
    // Removes the selections in the geo tracking part etc.
    $('#specificCountriesButton').click(function() {
        $('#countries').prop('disabled', false);
    });
    $('#allCountriesButton').click(function() {
        $('#countries').prop('disabled', true);
        $('#countries').val("");
    });
    $('#costPerSale').click(function() {
        if ($('input[id="costPerSale"]:checked').length > 0) {
            $('#monthlyRecurringPayment').prop('disabled', false);
        } else {
            $('#monthlyRecurringPayment').prop('disabled', true);
            $('#monthlyRecurringPayment').prop('checked', false);
        }
    });




    /* for future implement purposes:
    a table with all affiliates having this campaign.


    var socket = io("http://127.0.0.1:3000/");
    
    socket.emit("affliates own this campaign", {ID: desire});
    socket.on("payout_info", function(data){
        info = data.payout;
        other = data.other;
        console.log(other);
        console.log(info);
        for (var i in other){
            for (var j in info){
                if (info[j].Offer_ID == other[i].Offer_ID){
                    if (info[j].Types == "C"){
                        other[i].Clicks += 1;
                    }
                    if (info[j].Types == "L"){
                        other[i].Leads += 1;
                    }
                    if (info[j].Types == "S"){
                        other[i].Sales += 1;
                    }
                }
            }

        }
        console.log(other);
        
        for (var i in other){
            updateHTML(other[i]);
        }
        
        $('#updateValuesButton').click(function() {
            var areusure = confirm("Are You Sure to Update?");
            var all = [];
            if (areusure) {
                for (var r in other){
                    clicks = $('#clicks' + other[r].Offer_ID).text();
                    cpc = $('#cpc' + other[r].Offer_ID).text();

                    lead = $('#actions' + other[r].Offer_ID).text();
                    apc = $('#cpa' + other[r].Offer_ID).text();

                    sales = $('#sales' + other[r].Offer_ID).text();
                    spc = $('#salesP' + other[r].Offer_ID).text();
                    var part = {"Clicks": clicks, "cpc": cpc, "lead": lead, "apc": apc, "sales": sales, "spc": spc, "Aff_ID": info[r].Affiliate_ID, "Off_ID": info[r].Offer_ID};
                    all.push(part);
                }
                socket.emit("update payouts", {message: all});
            }
            console.log("lol: " + all[0].cpc);
            socket.emit("update payouts", {message: all});
        });

        $('#archive').click(function() {
            var areusure = confirm("Are You Sure to Archive?  Cilick yes if you finished the payment.");
            var all = [];
            if (areusure) {
                for (var r in other){
                    all.push({"aff_id":other[r].Affiliate_ID, "off_id":other[r].Offer_ID});
                }
                socket.emit("archive payouts", {message: all});
            }
            
            
        });
    });


    var totalBannerViews = 0;
    var totalClicks = 0;
    var totalLeads = 0;
    var totalSales = 0;
    var totalSubSales = 0;
    var totalComm = 0;

    for (var i = 0; i < 7; i++) {

        var affiliateID = 123456 + i;
        var affiliateName = 'testName ' + i;
        var company = 'testCompany ' + i;
        var bannerViews = 34 * i;
        var clicks = 23 * i;
        var clickthru = 3 * i;
        var leads = i;
        var SU = 2 * i;
        var numSales = 100 * i;
        var sales = 1000 * i;
        var subSales = 10 * i;
        var comm = 35 * i;


        $('#tableForAffiliates').append('<tr id="row' + i + '"><td>' + affiliateID + '</td><td><a href="#">' + affiliateName + '</a></td><td>' + company + '</td><td>' + bannerViews + '</td><td>' + clicks + '</td><td>' + clickthru + '</td><td>' + leads + '</td><td>' + SU + '</td><td>' + numSales + '</td><td>' + sales + '</td><td>' + subSales + '</td><td>' + comm + '</tr>');

        totalClicks = totalClicks + clicks;
        totalComm = totalComm + comm;
        totalSales = totalSales + sales;
        totalLeads = totalLeads + leads;
        totalSubSales = totalSubSales + subSales;
        totalBannerViews = totalBannerViews + bannerViews;
    }

    $('#clicks').append(totalClicks);
    $('#comm').append('$' + totalComm);
    $('#sales').append('$' + totalSales);
    $('#leads').append(totalLeads);
    $('#subSales').append('$' + totalSubSales);
    $('#bannerViews').append(totalBannerViews);

*/
});