module.exports = function(io, email) {
	io.on("connection", function(socket){
	console.log("socket connected...");
	//// Send affiliate's info when requested.
	socket.on("application info", function(data){
		var sql = '';
		if (data.message == '1'){
			sql = "SELECT First_Name, Last_Name, Company, SSN_TAX_ID, Site_URL1, Site_Category1," +
			"Address1, City, State, Country, Zip, Phone, Assigned_ID FROM client_info " +
			"WHERE approved = 0;";
		} else {
			sql = "SELECT First_Name, Last_Name, Email, Company, SSN_TAX_ID, Site_URL1, Site_Category1," +
			"Address1, City, State, Country, Zip, Phone, Assigned_ID FROM client_info " +
			"WHERE approved = 1;";
		}

		pool.getConnection(function(err, connection) {
	  	// Use the connection
	  		connection.query(sql, function selectCb(err, results, fields) {
	  		if (err){
	  			console.log(err.message);
	  		}
	    // And done with the connection.
	    	if (results.length > 0){

		    	console.log("page updated");
		    	if (data.message == '1'){
					socket.emit("application_info", {results:results});
				} else {
					socket.emit("application_info2", {results:results});
				}
		    	
	    	}
	    	connection.release();
	    // Don't use the connection here, it has been returned to the pool.
	 	 });
	  	});
	});
	socket.on("campaign info", function(data){

		sql = "SELECT * FROM campaigns WHERE approved=1;";
		
		pool.getConnection(function(err, connection) {
	  	// Use the connection
	  		if (err) throw err; 
	  		connection.query(sql, function selectCb(err, results, fields) {
	  		if (err){
	  			console.log(err.message);
	  		}
	    // And done with the connection.
	    	if (results && results.length > 0){

		    	console.log("request_approval page updated");
				socket.emit("campaign_info", {results:results});	
	    	}
	    	connection.release();
	    // Don't use the connection here, it has been returned to the pool.
	 	 });
	  	});
	});
	socket.on("remove campaign", function(data){
		var id = data.ID;
		sql = "DELETE FROM campaigns WHERE Assigned_ID=" + id + ";";
		
		pool.getConnection(function(err, connection) {
	  	// Use the connection
	  		connection.query(sql, function selectCb(err, results, fields) {
	  		if (err){
	  			console.log(err.message);
	  		}
	  		console.log("Campaign removed: " + results);
	    	connection.release();
	    // Don't use the connection here, it has been returned to the pool.
	 	 });
	  	});
	});
	// ----------------------affiliatecampaigninformation.ejs---------------------------//
	// ---------------------------edit the campsigns here ------------------------------//

	socket.on("delete campaign", function(data){
		off_id = data.message;
		sql = "DELETE FROM campaigns WHERE Assigned_ID=" + off_id + ";";
		pool.getConnection(function(err, connection){
			if (err) throw err;
			connection.query(sql, function(err, rows){
				if (err) console.log(err);
			})
			connection.release();
		})
	});


	// ----------------------the approval process for----------------------------//
	// ----------------------campaigns/offers request ---------------------------//

	socket.on("request info", function(data){
		var sql = '';
		
		sql = "SELECT * FROM affiliate_pending_offers;";
		
		
		pool.getConnection(function(err, connection) {
	  	// Use the connection
	  		connection.query(sql, function selectCb(err, results, fields) {
	  		if (err){
	  			console.log(err.message);
	  		}
	    // And done with the connection.
	    	if (results.length > 0){

		    	console.log("request_approval page updated");
				socket.emit("request_info", {results:results});	
	    	}
	    	connection.release();
	    // Don't use the connection here, it has been returned to the pool.
	 	 });
	  	});
	});

	socket.on("approve_offers", function(id){
		sql = "SELECT * FROM campaigns WHERE Assigned_ID=" + id.Off_ID;
		sql1 = "INSERT INTO affiliate" + id.Aff_ID + " (" +
			"Name," +
			"Offer_ID," +
			"Affiliate_ID," +
			"Advertiser_ID," +
			"Payout_Limit," +
			"Payout_Clicks," +
			"Payout_Leads," +
			"Payout_Sales," +
			"Clicks_Limit," +
			"Leads_Limit," +
			"Sales_Limit," +
			"Start_Date," +
			"Expire_Date)" +
			"VALUES (" +
			"";


		sql2 = "SELECT Email FROM advertiser_info WHERE Assigned_ID = " + id.ID + ";";
		pool.getConnection(function(err, connection){
			connection.query(sql, function selectCb(err, results, fields) {
				if (err){
					console.log(err.message);
				}
				if (results.length > 0){
					console.log(results);
					sql1 = "INSERT INTO affiliate" + id.Aff_ID + " (" +
						"Name," +
						"Offer_ID," +
						"Affiliate_ID," +
						"Advertiser_ID," +
						"Payout_Limit," +
						"Payout_Clicks," +
						"Payout_Leads," +
						"Payout_Sales," +
						"Clicks_Limit," +
						"Leads_Limit," +
						"Sales_Limit," +
						"Start_Date," +
						"Expire_Date)" +
						"VALUES (" +
						'"' + results[0].Name + '",' +
						'"' + id.Off_ID + '",' + 
						'"' + results[0].Advertiser_ID + '",' + 
						'"' + results[0].Affiliate_Per_Affiliate + '",' +
						'"' + results[0].Affiliate_Per_Click + '",' +
						'"' + results[0].Affiliate_Lead_PC + '",' +
						'"' + results[0].Affiliate_Per_Sale + '",' +
						'"' + results[0].Affiliate_Offered_Clicks + '",' +
						'"' + results[0].Affiliate_Offered_Leads + '",' +
						'"' + results[0].Affiliate_Offered_Sales + '",' +
						'"' + results[0].Start_Date + '",' +
						'"' + results[0].End_Date + 
						'");';
					connection.query(sql1, function(err, rows){
						if (err) console.log(err.message);
					});

				}
				
			});
			// Will test it when the server goes up
			connection.query(sql2, function selectCb(err, results, fields) {
				if (err){
					console.log(err.message);
				}
				if (results.length > 0){
					console.log(results[0].Email);
					var to = results[0].Email;
					var from = 'Affiliate_test@cminyc.com';
					var emailserver = email.server.connect({
					   user:    "Affiliate_test@cminyc.com", 
					   password:"affiliate2015%", 
					   // the host needs to be setup SMTP
					   host:    "smtp.cminyc.com", 
					   ssl:     false
					});

					emailserver.send({
					   text:    "approved advertiser", 
					   from:    from,
					   //to
					   to:      "me <jwang@cminyc.com>",
					   cc:      "",
					   subject: "testing emailjs"
					}, function(err, message) { console.log(err || message); });

				}
				connection.release();
			});
		});
	});
	
	// ------------------------------ the payout process ----------------------------//

	socket.on("payout info", function(data){
		aff_id = data.ID;
		sql = "SELECT * FROM affiliate_archive" + aff_id + " WHERE Paid=0;";
		sql1 = "SELECT * FROM affiliate" + aff_id + ";";
		console.log(sql);
		pool.getConnection(function(err, connection){
			if (err) console.log(err.message);
			connection.query(sql1, function(err, fields){
				if (err) console.log(err.message);
				connection.query(sql, function(err, rows){
					if (err) console.log(err.message);
					console.log(rows[0])
					socket.emit("payout_info", {payout: rows, other: fields});
				})
			})
			connection.release();
		})

	});

	socket.on("update payouts", function(data){
		for (var i in data.message){
			sql = "UPDATE affiliate" + data.message[i].Aff_ID + " SET " +
			"Clicks=" + data.message[i].Clicks +
			",Leads=" + data.message[i].lead +
			",Sales=" + data.message[i].sales +
			",Payout_Clicks=" + data.message[i].cpc +
			",Payout_Leads=" + data.message[i].apc +
			",Payout_Sales=" + data.message[i].spc +
			" WHERE Offer_ID=" + data.message[i].Off_ID + ";";
 

			console.log(sql);
			pool.getConnection(function(err, connection){
				if (err) console.log(err.message);
				connection.query(sql, function(err, rows){
					if (err) console.log(err.message);

				})
				connection.release();
			})
		}
	});

	socket.on("archive payouts", function(data){
		for (var i in data.message){
			sql = "UPDATE affiliate_archive" + data.message[i].aff_id + " SET Paid=1 " +
				"WHERE Offer_ID=" + data.message[i].off_id + ";";  
			
			console.log(sql);
			pool.getConnection(function(err, connection){
				if (err) console.log(err.message);
				connection.query(sql, function(err, rows){
					if (err) console.log(err.message);

				})
				connection.release();
			})
		}
	});

	socket.on("overview between dates", function(data){
		
		sql = "SELECT * FROM affiliate_archive" + data.aff_id + 
			" WHERE DATE(Time)>='" + data.begin + "' AND DATE(Time)<='" + data.end + "';";  
		sql1 = "SELECT * FROM affiliate" + data.aff_id + ";";
		console.log(sql);
		pool.getConnection(function(err, connection){
			if (err) console.log(err.message);
			connection.query(sql1, function(err, fields){
				if (err) console.log(err.message);
				connection.query(sql, function(err, rows){
					if (err) console.log(err.message);
					socket.emit("overview_between_dates", {message: rows, other: fields});

				});
			});
			connection.release();
		});
		
	});
	// --------the approval process for advertisers & affiliates sign ups -----------//
	//
	socket.on("remove affiliate", function(data){
		var id = data.ID;
		sql = "DELETE FROM client_info WHERE Assigned_ID=" + id + ";";
		pool.getConnection(function(err, connection){
			connection.query(sql, function selectCb(err, rows, fields){
				console.log("Affiliate deleted");
			});
			connection.release();
		});
	});
	//// Send advertiser's info when requested.
	socket.on("application ad info", function(){
		
		sql = "SELECT First_Name, Last_Name, Email, Phone, " +
		"Address, City, State, State2, Country, Zip, Affiliate_Marketing, " +
		"Media_Buying, Campaign_Dev, Lead_Gene, SEO, Assigned_ID FROM advertiser_info " +
		"WHERE approved = 0;";
		pool.getConnection(function(err, connection) {
	  	// Use the connection
	  		connection.query(sql, function selectCb(err, results, fields) {
	  		if (err){
	  			console.log(err.message);
	  		}
	    // And done with the connection.
	    	if (results.length > 0){

		    	console.log("page updated");
				socket.emit("application_ad_info", {results:results});
		    	
	    	}
	    	connection.release();
	    // Don't use the connection here, it has been returned to the pool.
	 	 });
	  	});
	});
	// 0, not vertified.  1, approved.  2, denied.
	//// approve affiliates
	socket.on("approve", function(id){
		
		console.log("approveing request sent");
		var sql = "UPDATE client_info SET approved = 1 WHERE Assigned_ID = " + id.ID + ";";
		var sql2 = "SELECT Email FROM client_info WHERE Assigned_ID = " + id.ID + ";";
		var sql3 = "CREATE TABLE affiliate" + id.ID + " (" +
			"Name VARCHAR(50) NOT NULL," +
			"Offer_ID INT(10) NOT NULL," +
			"Affiliate_ID INT(10) NOT NULL," +
			"Advertiser_ID INT(10) NOT NULL," +
			"Tracking_Link TEXT," + 
			"Total_Payout INT(11) NOT NULL DEFAULT '0'," + 
			"Payout_Limit INT(11) NOT NULL DEFAULT '0'," + 
			"Total_Clicks INT(11) NOT NULL DEFAULT '0'," + 
			"Clicks INT(10) NOT NULL DEFAULT '0'," +
			"Total_Leads INT(11) NOT NULL DEFAULT '0'," + 
			"Leads INT(10) NOT NULL DEFAULT '0'," + 
			"Total_Sales INT(11) NOT NULL DEFAULT '0'," + 
			"Sales INT(10) NOT NULL DEFAULT '0'," + 
			"Payout_Clicks VARCHAR(10) NOT NULL DEFAULT '0'," + 
			"Payout_Leads VARCHAR(10) NOT NULL DEFAULT '0'," + 
			"Payout_Sales VARCHAR(10) NOT NULL DEFAULT '0'," + 
			"Clicks_Limit INT(10) NOT NULL DEFAULT '0'," + 
			"Leads_Limit INT(10) NOT NULL DEFAULT '0'," + 
			"Sales_Limit INT(10) NOT NULL DEFAULT '0'," + 
			"Start_Date DATE NOT NULL," + 
			"Last_Date DATE NOT NULL," + 
			"Expire_Date DATE NOT NULL)" ;

		var sql4 = "CREATE TABLE affiliate_archive" + id.ID + " (" +
			"Offer_ID INT(10) NOT NULL," +
			"Advertiser_ID INT(10) NOT NULL," +
			"IP VARCHAR(20) NOT NULL," +
			"Types CHAR NOT NULL," +
			"Paid INT(1) NOT NULL DEFAULT '0'," +
			"Time DATE NOT NULL) ENGINE=ARCHIVE" ;

		pool.getConnection(function(err, connection){
			connection.query(sql, function selectCb(err, results, fields) {
				if (err){
					console.log(err.message);
				}
				if (results.length > 0){
					console.log("ID:" + id.ID + "has been approved");

				}
				
			});
			// Will test it when the server goes up
			connection.query(sql2, function selectCb(err, results, fields) {
				if (err){
					console.log(err.message);
				}
				if (results.length > 0){
					console.log(results[0].Email);
					var to = results[0].Email;
					var from = 'Affiliate_test@cminyc.com';
					var emailserver = email.server.connect({
					   user:    "Affiliate_test@cminyc.com", 
					   password:"affiliate2015%", 
					   // the host needs to be setup SMTP
					   host:    "smtp.cminyc.com", 
					   ssl:     false
					});

					emailserver.send({
					   text:    "approved", 
					   from:    from,
					   //to
					   to:      "me <jwang@cminyc.com>, Ian <production@mckenziepictures.com>",
					   cc:      "",
					   subject: "testing emailjs"
					}, function(err, message) { console.log(err || message); });

				}
				
			});
			connection.query(sql3, function(err, rows){
				if (err) console.log(err.message);

			});
			connection.query(sql4, function(err, rows){
				if (err) console.log(err.message);

			});
			
			connection.release();
		});
	});
	//// advertiser approve
	socket.on("approve2", function(id){
		
		console.log("approveing request sent");
		sql = "UPDATE advertiser_info SET approved = 1 WHERE Assigned_ID = " + id.ID + ";";
		sql2 = "SELECT Email FROM advertiser_info WHERE Assigned_ID = " + id.ID + ";";
		pool.getConnection(function(err, connection){
			connection.query(sql, function selectCb(err, results, fields) {
				if (err){
					console.log(err.message);
				}
				if (results.length > 0){
					console.log("ID:" + id.ID + "has been approved");

				}
				
			});
			// Will test it when the server goes up
			connection.query(sql2, function selectCb(err, results, fields) {
				if (err){
					console.log(err.message);
				}
				if (results.length > 0){
					console.log(results[0].Email);
					var to = results[0].Email;
					var from = 'Affiliate_test@cminyc.com';
					var emailserver = email.server.connect({
					   user:    "Affiliate_test@cminyc.com, Ian <production@mckenziepictures.com>", 
					   password:"affiliate2015%", 
					   // the host needs to be setup SMTP
					   host:    "smtp.cminyc.com", 
					   ssl:     false
					});

					emailserver.send({
					   text:    "approved advertiser", 
					   from:    from,
					   //to
					   to:      "me <jwang@cminyc.com>",
					   cc:      "",
					   subject: "testing emailjs"
					}, function(err, message) { console.log(err || message); });

				}
				connection.release();
			});
		});
	});
	//// Affiliate deny
	socket.on("deny", function(id){
		console.log("denying request sent");
		sql = "UPDATE client_info SET approved = 2 WHERE Assigned_ID = " + id.ID + ";";
		sql2 = "SELECT Email FROM client_info WHERE Assigned_ID = " + id.ID + ";";
		pool.getConnection(function(err, connection){
			connection.query(sql, function selectCb(err, results, fields) {
				if (err){
					console.log(err.message);
				}
				if (results.length > 0){
					console.log("ID:" + id.ID + "has been denied");
					
				}
				// Will test it when the server goes up
				connection.query(sql2, function selectCb(err, results, fields) {
				if (err){
					console.log(err.message);
				}
				if (results.length > 0){
					console.log(results[0].Email);
					var to = results[0].Email;
					var from = 'Affiliate_test@cminyc.com';
					var emailserver = email.server.connect({
					   user:    "Affiliate_test@cminyc.com", 
					   password:"affiliate2015%", 
					   // the host needs to be setup SMTP
					   host:    "smtp.cminyc.com", 
					   ssl:     false
					});

					emailserver.send({
					   text:    "denied", 
					   from:    from, 
					   to:      "me <jwang@cminyc.com>, Ian <production@mckenziepictures.com>",
					   cc:      "",
					   subject: "testing emailjs"
					}, function(err, message) { console.log(err || message); });

				}
				connection.release();
			});

			});
		});
	});
	//// Advertiser deny
	socket.on("deny2", function(id){
		console.log("denying request sent");
		sql = "UPDATE advertiser_info SET approved = 2 WHERE Assigned_ID = " + id.ID + ";";
		sql2 = "SELECT Email FROM advertiser_info WHERE Assigned_ID = " + id.ID + ";";
		pool.getConnection(function(err, connection){
			connection.query(sql, function selectCb(err, results, fields) {
				if (err){
					console.log(err.message);
				}
				if (results.length > 0){
					console.log("ID:" + id.ID + "has been denied");
					
				}
				// Will test it when the server goes up
				connection.query(sql2, function selectCb(err, results, fields) {
				if (err){
					console.log(err.message);
				}
				if (results.length > 0){
					console.log(results[0].Email);
					var to = results[0].Email;
					var from = 'Affiliate_test@cminyc.com';
					var emailserver = email.server.connect({
					   user:    "Affiliate_test@cminyc.com", 
					   password:"affiliate2015%", 
					   // the host needs to be setup SMTP
					   host:    "smtp.cminyc.com", 
					   ssl:     false
					});

					emailserver.send({
					   text:    "denied advertiser", 
					   from:    from, 
					   to:      "me <jwang@cminyc.com>, Ian <production@mckenziepictures.com>",
					   cc:      "",
					   subject: "testing emailjs"
					}, function(err, message) { console.log(err || message); });

				}
				connection.release();
			});

			});
		});
	});
	

});
}