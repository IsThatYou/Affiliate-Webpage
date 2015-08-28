module.exports = function(app, pool, fs, flash) {
	function loggedin(req, res, next){
		if (req.user){
			next();
		}
		else{
			res.redirect('/login');
		}
	}
	
	// offers
	app.get("/offers", loggedin, function(req, res, err){
		if (req.session.passport.user.Identity != 'ad'){

			var sql = "SELECT * FROM campaigns WHERE approved = 1;";
			pool.getConnection(function(err, connection){
				connection.query(sql, function(err, rows){
					res.render('affiliateCampaignsDescription.ejs', { message: rows , mess: req.flash('aff_off_Message')});
					connection.release();
				});
			});
		} else{
			res.render('affiliateLogin.ejs', { message: null });
		}
	});

	app.get("/myoffers", loggedin, function(req, res, err){
		if (req.session.passport.user.Identity != 'ad'){
			console.log(req.session.passport.user.num);
			var sql = "SELECT * FROM affiliate" + req.session.passport.user.num + ";";
			console.log(sql);
			pool.getConnection(function(err, connection){
				connection.query(sql, function(err, rows){
					var id_list = [];
					if (rows){
						for (var i = 0; i < rows.length; i ++){
							id_list.push('/getoffer?off_id=' + rows[i].Offer_ID);
						}
						res.render('affiliateCampaignsDescription2.ejs', { message: rows, toni: id_list});
						
					} else {
						res.render('affiliateCampaignsDescription2.ejs', { message: null, toni: null});
					}
					connection.release();
				});
			});
		} else{
			res.render('affiliateLogin.ejs', { message: null });
		}
	});

	app.get("/getoffer", loggedin, function(req, res, err){
		if (req.session.passport.user.Identity != 'ad'){

			var off_id = req.query.off_id;
			var sql = "SELECT * FROM affiliate" + req.session.passport.user.num + " WHERE Offer_ID = " + off_id + ";";
			var sql1 = "SELECT Long_D, Affiliate_Per_Affiliate, Start_Date, End_Date FROM campaigns WHERE Assigned_ID = " + off_id + ";"; 
			pool.getConnection(function(err, connection){
				connection.query(sql, function selecCb(err, rows){
					if(err) console.log(err.message);
					connection.query(sql1, function(err, fields){
						if(err) console.log(err.message);
						var link = "http://127.0.0.1/tracking?off_id=" + rows[0].Offer_ID + "&aff_id=" + rows[0].Affiliate_ID;
						var path = "./views/admin/uploads/banner-" + rows[0].Offer_ID + "-" + rows[0].Advertiser_ID;
						var link2 = "http://127.0.0.1:3000/upload?camp_id="+ rows[0].Offer_ID + "&advertiser_id=" + rows[0].Advertiser_ID + "&name=";
						var files = fs.readdirSync(path);
						var len = files.length;
						var imagelink = [];
						for (i in files){
							imagelink.push("<a href='" + link + "'>" + "<img src='" + link2 + files[i] + "'>" + "</a>");
						}
						console.log(imagelink);
						res.render('affiliateCampaignDeployment.ejs', { message: rows , campaign: fields, trackinglink: link, imagelink: imagelink});
					});
					connection.release();
				});
			});
		} else{
			res.render('affiliateLogin.ejs', { message: null });
		}
	});


	app.post('/Apply_Offers', function(req, res, err){
		var proparray = [];
		for (var prop in req.body){
			proparray.push(prop);
		}
		var sql = "SELECT * FROM client_info WHERE Assigned_ID = "+ req.user.Assigned_ID +";";


		pool.getConnection(function(err, connection){
			if (err) console.log(err.message);
			connection.query(sql, function(err, rows, fields){
				if (err) console.log(err.message);
				console.log(rows[0]);
				// offers_num : current offers that are running, offers_pending : offers that are pending
				// offers_limit : limit of the number of the offer
				if (rows[0].Offers_Num + proparray.length + rows[0].Offers_Pending <= rows[0].Offers_Limit){
					console.log("shadowblade");
					var offers = "";
					for (var i = 0; i < proparray.length; i++){
						offers = offers + proparray[i] + ',';
					}
					var sql1 = "INSERT INTO affiliate_pending_offers (" + 
						"Offer_Name," +
						"Offer_ID," +
						"Aff_ID," +
						"Aff_Name1," +
						"Aff_Name2," +
						"Company," +
						"Site_URL1," +
						"Site_Category1," +
						"Unique_Visitors_PM, Phone) " + 
						"VALUES ";
					for (var i = 0; i < proparray.length - 1; i++){
						sql1 = sql1 + '("' + req.body[proparray[i]] + '",' +
						'"' + proparray[i] + '",' +
						'"' + rows[0].Assigned_ID + '",' +
						'"' + rows[0].First_Name + '",' +
						'"' + rows[0].Last_Name + '",' +
						'"' + rows[0].Company + '",' + 
						'"' + rows[0].Site_URL1 + '",' + 
						'"' + rows[0].Site_Category1 + '",' +
						'"' + rows[0].Unique_Visitors_PM + '",' +
						'"' + rows[0].Phone + 
						'"),'
					}
					// last one has no comma
					sql1 = sql1 + '("' + req.body[proparray[i]] + '",' +
						'"' + proparray[i] + '",' +
						'"' + rows[0].Assigned_ID + '",' +
						'"' + rows[0].First_Name + '",' +
						'"' + rows[0].Last_Name + '",' +
						'"' + rows[0].Company + '",' + 
						'"' + rows[0].Site_URL1 + '",' + 
						'"' + rows[0].Site_Category1 + '",' +
						'"' + rows[0].Unique_Visitors_PM + '",' +
						'"' + rows[0].Phone + 
						'")';


					console.log(sql1);
					connection.query(sql1, function(err, rows){
						if (err) console.log(err.message);
					});
					var total_pending = proparray.length + rows[0].Offers_Pending;
					sql2 = "UPDATE client_info SET Offers=(" +
						"CASE WHEN Offers='null' " + 
						"THEN '" + offers + "' " + 
	        			" ELSE concat(Offers, '"+ offers + "')" + 
	    				" END" + 
						"), Offers_Pending=" + total_pending + " WHERE Assigned_ID=" + req.user.Assigned_ID + ";";
					console.log(sql2);
					connection.query(sql2, function(err, rows){
						if (err) console.log(err.message);
					});
					var requestLeft = rows[0].Offers_Limit - rows[0].Offers_Num - proparray.length - rows[0].Offers_Pending;
					console.log("request left: " + requestLeft);
					req.flash('aff_off_Message', 'Requests successfully sent, you can have ' + requestLeft + ' out of ' + rows[0].Offers_Limit + ' more requests.');
					res.redirect('/offers');
				} else {
					var requestLeft = rows[0].Offers_Limit - rows[0].Offers_Num - rows[0].Offers_Pending;
					req.flash('aff_off_Message', 'Requests denied. You can only request for ' + requestLeft + ' more offer(s).  You have ' + rows[0].Offers_Num + ' offers running, ' + rows[0].Offers_Pending + ' offers pending.');
					res.redirect('/offers');
				}
				
				connection.release();
			});
		});
	}); 

}