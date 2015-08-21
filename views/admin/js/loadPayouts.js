$(document).ready(function() {
    var socket = io("http://192.168.0.46:3000/");
    
    var lasturl = document.referrer;
    var index = lasturl.indexOf("aff_id=");
    index = index + 7;
    var desire = lasturl.substr(index, lasturl.length - index);
    console.log(desire);
    socket.emit("payout info", {ID: desire});
    socket.on("payout_info", function(data){
        info = data.payout;
        for (var i in info){
            updateHTML(info[i]);
        }
        var all = [];
        $('#updateValuesButton').click(function() {
        var areusure = confirm("Are You Sure to Update?");
            if (areusure) {
                for (var r in info){
                    clicks = $('#clicks' + info[r].Offer_ID).text();
                    cpc = $('#cpc' + info[r].Offer_ID).text();

                    lead = $('#actions' + info[r].Offer_ID).text();
                    apc = $('#cpa' + info[r].Offer_ID).text();

                    sales = $('#sales' + info[r].Offer_ID).text();
                    spc = $('#salesP' + info[r].Offer_ID).text();
                    var part = {"Clicks": clicks, "cpc": cpc, "lead": lead, "apc": apc, "sales": sales, "spc": spc, "Aff_ID": info[r].Affiliate_ID, "Off_ID": info[r].Offer_ID};
                    all.push(part);
                }
                socket.emit("update payouts", {message: all});
            }
            console.log("lol: " + all[0].cpc);
            socket.emit("update payouts", {message: all});
        });

        $('#archive').click(function() {
        var areusure = confirm("Are You Sure to Archive?  The current payout is going to get reinitialized.");
            if (areusure) {
                for (var r in info){
                    clicks = $('#clicks' + info[r].Offer_ID).text();
                    cpc = $('#cpc' + info[r].Offer_ID).text();

                    lead = $('#actions' + info[r].Offer_ID).text();
                    apc = $('#cpa' + info[r].Offer_ID).text();

                    sales = $('#sales' + info[r].Offer_ID).text();
                    spc = $('#salesP' + info[r].Offer_ID).text();
                    var part = {"Clicks": clicks, "cpc": cpc, "lead": lead, "apc": apc, "sales": sales, "spc": spc, "Aff_ID": info[r].Affiliate_ID, "Off_ID": info[r].Offer_ID};
                    all.push(part);
                }
            }
            console.log("lol: " + all[0].cpc);
            socket.emit("archive payouts", {message: all});
        });
    });
    var totalClicks = 0;
    var totalActions = 0;
    var totalCPA = 0;
    var totalAmount = 0;
    function updateHTML(data){
        var payPerClick = 3;
        var payout_limit = data.Payout_Limit;
        var campaignId = data.Offer_ID;
        var campaignName = data.Name;
        // click pack
        var clicks = data.Clicks;
        var cpc = data.Payout_Clicks;
        var cl = data.Clicks_Limit;
        // lead pack
        var actions = data.Leads;
        var cpa = data.Payout_Leads;
        var al = data.Leads_Limit;
        // sale pack
        var sales = data.Sales;
        var salesP = data.Payout_Sales;
        var sl = data.Sales_Limit;

        var rev = 0;
        var convRate = 0;


        var total = parseFloat(clicks) * parseFloat(cpc) + parseFloat(actions) * parseFloat(cpa) + parseFloat(sales) * parseFloat(salesP);
        total = Math.round(total * 100) / 100;
        $('#tableForPayouts').append('<tr class="payoutTable" id="row' + campaignId + '"name="' + campaignId + '"><td>' + campaignId + '</td><td>' + campaignName + '</td><td contenteditable="false"  id="payoutlimit' + campaignId + '">' + payout_limit + '</td><td contenteditable="true"  id="clicks' + campaignId + '">' + clicks + '</td><td id="cpc' + campaignId + '"" contenteditable="true">' + cpc + '</td><td id="actions' + campaignId + '" contenteditable="true">' + actions + '</td><td contenteditable="true" id="cpa' + campaignId + '">' + cpa + '</td><td id="sales' + campaignId + '" contenteditable="true">' + sales + '</td><td id="salesP' + campaignId + '" contenteditable="true">' + salesP + '</td><td id="total' + campaignId + '">' + total + '</td></tr>');
        totalAmount = totalAmount + total;
        totalActions = totalActions + actions;
        totalCPA = totalCPA + cpa;
        totalClicks = totalClicks + clicks;

        document.getElementById("row" + campaignId).addEventListener("input", function() {
            
            var clickedRow = $(this).attr('name');
            var previousValue = $('#total' + clickedRow).text();

            var currentClicks = $('#clicks' + clickedRow).text();

            var currentCpc = $('#cpc' + clickedRow).text();

            var currentActions = $('#actions' + clickedRow).text();
            var currentCpa = $('#cpa' + clickedRow).text();
            var currentSales = $('#sales' + clickedRow).text();
            var currentSalesP = $('#salesP' + clickedRow).text();
            
            var sum = parseFloat(currentClicks) * parseFloat(currentCpc) + parseFloat(currentActions) * parseFloat(currentCpa) + parseFloat(currentSales) * parseFloat(currentSalesP)
            sum = Math.round(sum * 100) / 100
            $('#total' + clickedRow).text(sum);
            totalAmount = parseFloat(totalAmount) - parseFloat(previousValue) + sum;
            // totalClicks = parseFloat(totalClicks)+ parseFloat(currentClicks);
            $('#totalAmount').text(Math.round(totalAmount*1000)/1000);

            
        }, false);
        $('#totalAmount').text('');
        $('#totalAmount').append(totalAmount);

        var that = $(this);
        $("tr.payoutTable td").click(function() {
            that.css("background", "transparent");

            $(this).css("background", "yellow");
            that = $(this);
        }); 
    }
    //$('#totalClicks').append(totalClicks);
    //$('#totalActions').append(totalActions);
    //$('#totalCPA').append(totalCPA);
    console.log(totalAmount);
    
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
    // $('tr.payoutTable td').click(function() {
    //      $(this).toggleClass("cell");
    //   })




});