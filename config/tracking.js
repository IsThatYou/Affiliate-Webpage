module.exports = function(app, pool) {
	app.get('/upload', function(req, res, err){
		console.log("get the images");
		var camp_id = req.query.camp_id;
		var advertiser_id = req.query.advertiser_id;
		var name = req.query.name;
		console.log(req.signedCookies['track']);
		var path = "./views/admin/uploads/banner-" + camp_id + "-" + advertiser_id + "/" + name;
		console.log(path);
		res.sendFile(path, {root: __dirname});
		//console.log(req);
	});

	app.get('/tracking', function(req, res, err){
		var off_id = req.query.off_id;
		var aff_id = req.query.aff_id;
		var sql = "SELECT Url FROM campaigns WHERE Assigned_ID = " + off_id + ";";
		var sql1 = "UPDATE affiliate" + aff_id + " SET Total_Clicks = Total_Clicks + 1 WHERE Offer_ID = " + off_id + ";";
		var sql3 = "UPDATE campaigns SET Total_Clicks = Total_Clicks + 1 WHERE Assigned_ID = " + off_id + ";";
		var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
		var today = new Date();
		time = today.getFullYear() + "-" + parseInt(today.getMonth() + 1)  + "-" + today.getDate();
		var sql2 = "INSERT INTO affiliate_archive" + aff_id + " (Offer_ID, IP, Types, Time) Value(" +
				"'" + off_id + "'," +
				"'" + ip + "'," +
				"'Clicks'," +
				"'" + time + "');";
		console.log(sql2);

		pool.getConnection(function(err, connection){
			connection.query(sql1, function(err, rows){
				if (err) console.log(err.message);
			});
			connection.query(sql, function(err, rows){
				if (err) console.log(err.message);
				res.cookie("track", "o:" + off_id + ":a:" + aff_id, {signed: true, maxAge: 180 * 24 * 60 * 60 * 1000});
				var url = rows[0].Url;
				console.log(url);
				if (url.substring(0,7) == 'http://'){
					res.redirect(rows[0].Url);
					console.log(url.substring(0,7));
				} else {
					res.redirect('http://' + rows[0].Url);
					console.log(url.substring(0,7));
				}
				
			});
			connection.query(sql2, function(err, rows){
				if (err) console.log(err.message);
			});
			connection.query(sql3, function(err, rows){
				if (err) console.log(err.message);
			});
			connection.release();
		})
	});

	// tracking pixel on Thank you page
	app.get('/pixel.gif', function(req, res, err){

		/* Browser type, ip, start time, session
		var ua = req.headers['user-agent'],
	    $ = {};

		if (/mobile/i.test(ua))
		    $.Mobile = true;

		if (/like Mac OS X/.test(ua)) {
		    $.iOS = /CPU( iPhone)? OS ([0-9\._]+) like Mac OS X/.exec(ua)[2].replace(/_/g, '.');
		    $.iPhone = /iPhone/.test(ua);
		    $.iPad = /iPad/.test(ua);
		}

		if (/Android/.test(ua))
		    $.Android = /Android ([0-9\.]+)[\);]/.exec(ua)[1];

		if (/webOS\//.test(ua))
		    $.webOS = /webOS\/([0-9\.]+)[\);]/.exec(ua)[1];

		if (/(Intel|PPC) Mac OS X/.test(ua))
		    $.Mac = /(Intel|PPC) Mac OS X ?([0-9\._]*)[\)\;]/.exec(ua)[2].replace(/_/g, '.') || true;

		if (/Windows NT/.test(ua))
	    $.Windows = /Windows NT ([0-9\._]+)[\);]/.exec(ua)[1];

		---------------------------------
		---> console.log(req.session);
		---------------------------------
		---> console.log(req.headers['x-forwarded-for'] || req.connection.remoteAddress);
		---------------------------------
		---> console.log(req.startTime);
		*/
	///////////////////////////////////////////////////////////////////////////////////////////////
		// put this as one of the first middleware so it acts 
		// before other middleware spends time processing the request
		//
		// -- It is not wroking as intended
		var countip = true;
		/*console.log(accesses.check(req.connection.remoteAddress));
		if (accesses.check(req.connection.remoteAddress)){
			countip = true;
		}*/
	//////////////////////////////////////////////////////////////////////////////////////////////
		// count the clicks in mysql
		// make sure one ip address only counts once
		var add_id = req.query.add_id;
		var off_id0 = req.query.off_id;
		var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

		//var sql2 = "SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS WHERE Table_Name = 'campaigns' AND COLUMN_NAME LIKE 'af%';"
		var cookie = req.signedCookies['track'];
		var off_id;
		var aff_id;
		console.log("cookie" + cookie);
		if (cookie){
			off_id = cookie.split(':')[1];
			aff_id = cookie.split(':')[3];
			console.log("in: " + off_id);
			console.log("in2: " + off_id0);
			if (off_id == off_id0){

				if (countip){

					var sql = "UPDATE affiliate" + aff_id + " SET Total_Leads = Total_Leads + 1 WHERE Offer_ID = " + off_id + ";";
					var sql_s = "UPDATE affiliate" + aff_id + " SET Total_Sales = Total_Sales + 1 WHERE Offer_ID = " + off_id + ";";
					
					var sql1 = "UPDATE campaigns SET Total_Leads = Total_Leads + 1 WHERE Assigned_ID = " + off_id + ";";
					var sql2 = "UPDATE campaigns SET Total_Sales = Total_Sales + 1 WHERE Assigned_ID = " + off_id + ";";
					
					var sql3 = "SELECT Cost_Per_Lead, Cost_Per_Sale, Total_Leads, Total_Sales, Offered_Leads, Offered_Sales FROM campaigns WHERE Assigned_ID = " + off_id + ";";
					
					console.log(sql);
					pool.getConnection(function(err, connection){
						connection.query(sql3, function selectCb(err, rows, fields){
							var today = new Date();
							time = today.getFullYear() + "-" + parseInt(today.getMonth() + 1) + "-" + today.getDate();
							if (err) console.log(err.message);
							// if clicks per lead
							if (rows[0].Cost_Per_Lead != 'null'){
								// add this to archive
								var sql4 = "INSERT INTO affiliate_archive" + aff_id + " (Offer_ID, IP, Types, Time) Value(" +
									"'" + off_id + "'," +
									"'" + ip + "'," +
									"'Leads'," +
									"'" + time + "');";
								console.log(sql4);
								connection.query(sql4, function(err, rows){
									if (err) console.log(err.message);
								});
								connection.query(sql1, function(err, rows){
									if (err) console.log(err.message);
									console.log("Style: Cost Per Lead");
									connection.query(sql, function(err, rows){
										if (err) console.log(err.message);
										console.log("Style: Cost Per Lead, all info added");
									});								
								});
							}
							// if clicks per sale
							if (rows[0].Cost_Per_Sale != 'null'){
								// add this to archive
								var sql5 = "INSERT INTO affiliate_archive" + aff_id + " (Offer_ID, IP, Types, Time) Value(" +
									"'" + off_id + "'," +
									"'" + ip + "'," +
									"'Sales'," +
									"'" + time + "');";
								console.log(sql5);
								connection.query(sql5, function(err, rows){
									if (err) console.log(err.message);
								});

								connection.query(sql2, function(err, rows){
									if (err) console.log(err.message);
									console.log("Style: Cost Per Sale");
									connection.query(sql_s, function(err, rows){
										if (err) console.log(err.message);
										console.log("Style: Cost Per Sale, clicks added");
									});
								});
							}
							console.log("success:", rows[0]);
							res.clearCookie("track");
							res.sendFile("views/pixel.html", {root: __dirname});
							connection.release();
						});
					});
				} 
			}
		} else {
			res.sendStatus(200);
		}

	});
};