module.exports = function(app, pool, upload, fs) {
	app.get("/admin", function(req, res, err){
		res.render('adminLogin.ejs', { message: req.flash('login_admin_Message') });
	});

	function adminloggedin(req, res, next){
		if (req.user){
			if (req.user.Identity == 'admin'){
				next();
			}
			else{
				res.redirect('/admin');
			}
		} else{
				res.redirect('/admin');
		}
	}

	app.get('/admin/approve', adminloggedin, function(req,res){
	  res.sendFile("views/affiliateApproval.html", {root:__dirname});
	});

	app.get('/admin/approve_ad', adminloggedin, function(req,res){
	  res.sendFile("views/advertiserApproval.html", {root:__dirname});
	});

	app.get("/admin/affiliates", adminloggedin, function(req, res, err){
		res.render('affiliateUserManagementList.ejs', { message: null });
	});

	app.get("/admin/approve_offers", adminloggedin, function(req, res, err){
		res.sendFile('views/adminOffersApproval.html', { root:__dirname });
	});

	app.get("/admin/affiliate_pay", adminloggedin, function(req, res, err){
		res.sendFile('views/affiliatePayouts.html', { root:__dirname });
	});

	app.get('/admin/users', adminloggedin, function(req,res){
		var aff_id = req.query.aff_id;
		if (aff_id){


			console.log("aff_id: " + aff_id);
			sql = "SELECT * FROM client_info WHERE Assigned_ID=" + aff_id + ";";
			pool.getConnection(function(err, connection){
				connection.query(sql, function selectCb(err, results, fields){
					console.log(results[0]);
					res.render('affiliateUserInformation.ejs', { message: results[0]});
				});
				connection.release();
			})
		} else {
			res.render('affiliateUserInformation.ejs', { message: null });
		}
		
	});

	// affiliate
	app.post('/admin/Update_Campaign', upload.array('fileUploaded', 12), function (req, res, next) {
		// body
		var proparray = [];
		for (var prop in req.body){
			proparray.push(prop);
		}
		console.log(proparray.length + 2);
		for (var i = 0; i < proparray.length; i++){
			if (req.body[proparray[i]] == '' || req.body[proparray[i]] == 'http://' || req.body[proparray[i] == undefined]){
				req.body[proparray[i]] = null;
			}	
		}
		// special case for no.47 entry
		var country = req.body[proparray[47]];
		if (req.body[proparray[47]] != null && req.body[proparray[47]][0] == ','){
			country = req.body[proparray[47]].substring(1, req.body[proparray[47]][0].length);
			country = country[1];
		}

		var info = "UPDATE campaigns SET " +
							"Cost_Per_Lead = '" + req.body[proparray[0]] +                   
							"',Cost_Per_Click = '" + req.body[proparray[1]] +
							"',Cost_Per_TI = '" + req.body[proparray[2]] +
							"',Cost_Per_Sale = '" + req.body[proparray[3]] + 
							"',Monthly_Recurring_Payment = '" + req.body[proparray[4]] + 
							"',Product_Specific = '" + req.body[proparray[5]] +
							"',Pop_up = '" + req.body[proparray[6]] + 
							"',Pop_UnderUp_Value = '" + req.body[proparray[7]] + 
							"',SCP = '" + req.body[proparray[8]] + 
							"',Name = '" + req.body[proparray[9]] + 
							"',Advertiser_ID = '" + req.body[proparray[10]] + 
							"',Url = '" + req.body[proparray[11]] + 
							"',Long_D = '" + req.body[proparray[12]] +
							"',Short_D = '" + req.body[proparray[13]] +
							"',Start_Date = '" + req.body[proparray[14]] + 
							"',End_Date = '" + req.body[proparray[15]] + 
							"',Offered_Clicks = '" + req.body[proparray[16]] + 
							"',Offered_Leads = '" + req.body[proparray[17]] + 
							"',Offered_Sales = '" + req.body[proparray[18]] + 
							"',Offered_Impressions = '" + req.body[proparray[19]] + 
							"',Offered_CoRegi = '" + req.body[proparray[20]] + 
							"',Affiliate_Per_Affiliate = '" + req.body[proparray[21]] + 
							"',Affiliate_Per_Click = '" + req.body[proparray[22]] + 
							"',Affiliate_Lead_PC = '" + req.body[proparray[23]] + 
							"',Affiliate_Impression_PC = '" + req.body[proparray[24]] + 
							"',Affiliate_Per_Sale = '" + req.body[proparray[25]] + 
							"',Affiliate_Per_Sub_Sale = '" + req.body[proparray[26]] + 
							"',Affiliate_Flat_Per_Sale = '" + req.body[proparray[27]] + 
							"',Affiliate_Flat_Per_Sub_Sale = '" + req.body[proparray[28]] + 
							"',run = '" + req.body[proparray[29]] + 
							"',sel1 = '" + req.body[proparray[30]] +
							"',sel2 = '" + req.body[proparray[31]] + 
							"',sel3 = '" + req.body[proparray[32]] +
							"',Ndate = '" + req.body[proparray[33]] +
							"',NClicks = '" + req.body[proparray[34]] +
							"',NLeads = '" + req.body[proparray[35]] +
							"',NSales = '" + req.body[proparray[36]] +
							"',NImpression = '" + req.body[proparray[37]] + 
							"',Notif_Date = '" + req.body[proparray[38]] + 
							"',Clicks_Level = '" + req.body[proparray[39]] + 
							"',Leads_Level = '" + req.body[proparray[40]] + 
							"',Sales_Level = '" + req.body[proparray[41]] + 
							"',Impression_Level = '" + req.body[proparray[42]] + 
							"',Threshold_Email = '" + req.body[proparray[43]] + 
							"',Type_Tracking = '" + req.body[proparray[44]] +
							"',Tracking_Pixel = " + '"' + req.body[proparray[45]] + '"' +
							",Country = '" + req.body[proparray[46]] +
							"',Specific_Country = '" + country +
							"',Note = '" + req.body[proparray[48]] + 
							"' WHERE Assigned_ID=" + req.body[proparray[49]] + ";";

		console.log(info);
		var camp_id = 2;
		var advertiser_id = 2;
		var path = '';
		pool.getConnection(function(err, connection){
			if (err) throw err;
			connection.query(info, function(error, fields) {
					if (err) console.log(err);

					console.log(fields);

			    	camp_id = req.body[proparray[49]];
			    	advertiser_id = req.body['add_id'];
			    	// create a folder with camp_id and advertiser_id to store banners.
			    	path = "./views/admin/uploads/banner-" + camp_id + "-" + advertiser_id;

					var mkdirSync = function (path) {
						  try {
						    fs.mkdirSync(path);
						  } catch(e) {
						    if ( e.code != 'EEXIST' ) throw e;
						  }
						}
		
					mkdirSync(path);
					// store the images 
					console.log("lol is awful" + path);
					for (var i in req.files){
						
						var tmp_path = req.files[i].path;
						var target_path = path + "/" + req.files[i].originalname;
						console.log("lol is awful" + req.files[i]);
						var src = fs.createReadStream(tmp_path);
						var dest = fs.createWriteStream(target_path);
						src.pipe(dest);

						fs.unlink(tmp_path, function (err) {
						  if (err) throw err;
						  console.log('successfully deleted ' + tmp_path);
						});
						src.on('error', function(err) { res.render('affiliateCampaignInformation.ejs', { message: null }); });
						}
			    	
							    
			    connection.release();
			    
			    // Don't use the connection here, it has been returned to the pool.
		  	});
		});
		res.redirect('/admin/all_campaigns');

	});

	app.post('/admin/users', adminloggedin, function(req, res){
		var proparray = [];
		for (var prop in req.body){
			proparray.push(prop);
		}
		for (var i = 0; i < proparray.length; i++){
			if (req.body[proparray[i]] == '' || req.body[proparray[i]] == 'http://' || req.body[proparray[i] == undefined]){
				req.body[proparray[i]] = null;
			}
		}
		console.log(req.body);
		sql = "UPDATE client_info SET" + 
		" First_Name='" + req.body[proparray[0]] + "', " +
		"Last_Name='" + req.body[proparray[1]] + "', " +
		"Company='" + req.body[proparray[2]] + "', " +
		"Checks_To='" + req.body[proparray[3]] + "', " +
		"SSN_TAX_ID='" + req.body[proparray[4]] + "', " +
		"Payment_Threshhold='" + req.body[proparray[5]] + "', " +
		"Email='" + req.body[proparray[6]] + "', " +
		"Phone='" + req.body[proparray[7]] + "', " +
		"Address1='" + req.body[proparray[8]] + "', " +
		"Address2='" + req.body[proparray[9]] + "', " +
		"City='" + req.body[proparray[10]] + "', " +
		"State='" + req.body[proparray[11]] + "', " +
		"Country='" + req.body[proparray[12]] + "', " +
		"Zip='" + req.body[proparray[13]] + "', " +
		"Site_URL1='" + req.body[proparray[14]] + "', " +
		"Alexa_Ranking1='" + req.body[proparray[15]] + "', " +
		"Site_URL2='" + req.body[proparray[16]] + "', " +
		"Alexa_Ranking2='" + req.body[proparray[17]] + "', " +
		"Site_URL3='" + req.body[proparray[18]] + "', " +
		"Alexa_Ranking3='" + req.body[proparray[19]] + "', " +
		"Site_URL4='" + req.body[proparray[20]] + "', " +
		"Alexa_Ranking4='" + req.body[proparray[21]] + "', " +
		"CPA_Affiliate_Marketing='" + req.body[proparray[22]] + "', " +
		"Site_Category1='" + req.body[proparray[23]] + "', " +
		"Site_Category2='" + req.body[proparray[24]] + "', " +
		"Site_Category3='" + req.body[proparray[25]] + "', " +
		"Unique_Visitors_PM='" +req.body[proparray[26]] + "', " +
		"News_Letter='" + req.body[proparray[27]] + "', " +
		"Solo_Email='" + req.body[proparray[28]] + "', " +
		"Sin_Dou_Optin='" + req.body[proparray[29]] + "', " +
		"Mailing_Freq='" + req.body[proparray[30]] + "', " +
		"Time_Record='" + req.body[proparray[31]] +
		"' WHERE Assigned_ID = " + req.body[proparray[i-1]] + ";"; 
		console.log(sql);
		pool.getConnection(function(err, connection){
			connection.query(sql, function(err, fields){
				if (err){
					console.log("Genuis strikes again: " + err.message);
				}
			});
			connection.release();
		});
	});


	app.get("/admin/Create_Campaign", adminloggedin, function(req, res, err){
		res.render('adminCreateCampaign.ejs', { message: null });
	});

	app.get("/admin/all_campaigns", adminloggedin, function(req, res, err){
		res.render('affiliateCampaignManagementList.ejs', { message: null });
	});

	app.get("/admin/campaigns", adminloggedin, function(req, res, err){
		var camp_id= req.query.off_id;
		sql = "SELECT * FROM campaigns WHERE Assigned_ID=" + camp_id + ";";
		console.log(sql);
		if (camp_id){
			pool.getConnection(function(err, connection){
				if (err) throw err; 
				connection.query(sql, function(err, rows){
					if (err) console.log(err);
					//rows[0].Tracking_Pixel = rows[0].Tracking_Pixel.replace(/'/g, " &quot ");
					//rows[0].Tracking_Pixel = rows[0].Tracking_Pixel;
					console.log(rows[0]);
					console.log(rows[0].Tracking_Pixel);
					res.render('affiliateCampaignInformation.ejs', { message: rows[0] });
				})
			});
		} else {
			res.redirect("/all_campaigns");
		}
	});


	app.post('/admin/Create_Campaign', upload.array('fileUploaded', 12), function (req, res, next) {
		// body
		var proparray = [];
		for (var prop in req.body){
			proparray.push(prop);
		}
		console.log(proparray.length + 2);
		for (var i = 0; i < proparray.length; i++){
			if (req.body[proparray[i]] == '' || req.body[proparray[i]] == 'http://' || req.body[proparray[i] == undefined]){
				req.body[proparray[i]] = null;
			}	
		}
		// special case for no.47 entry
		var country = req.body[proparray[47]];
		if (req.body[proparray[47]] != null && req.body[proparray[47]][0] == ','){
			country = req.body[proparray[47]].substring(1, req.body[proparray[47]][0].length);
			country = country[1];
		}
		var parallel_universe = false;
		if (req.body['tracking_pixel'] == null){
			parallel_universe =  false;
		} else {
			parallel_universe = true;
		}
		console.log("parallel universe? " + parallel_universe);
		var info = "INSERT INTO campaigns" + 
							"(Cost_Per_Lead," +
							"Cost_Per_Click," +
							"Cost_Per_TI," +
							"Cost_Per_Sale," + 
							"Monthly_Recurring_Payment," + 
							"Product_Specific," +
							"Pop_up," + 
							"Pop_UnderUp_Value," + 
							"SCP," + 
							"Name," + 
							"Advertiser_ID," + 
							"Url," + 
							"Long_D," +
							"Short_D," +
							"Start_Date," + 
							"End_Date," + 
							"Offered_Clicks," + 
							"Offered_Leads," + 
							"Offered_Sales," + 
							"Offered_Impressions," + 
							"Offered_CoRegi," + 
							"Affiliate_Per_Affiliate," + 
							"Affiliate_Per_Click," + 
							"Affiliate_Lead_PC," + 
							"Affiliate_Impression_PC," + 
							"Affiliate_Per_Sale," + 
							"Affiliate_Per_Sub_Sale," + 
							"Affiliate_Flat_Per_Sale," + 
							"Affiliate_Flat_Per_Sub_Sale," + 
							"run," + 
							"sel1," +
							"sel2," + 
							"sel3," +
							"Ndate," +
							"NClicks," +
							"NLeads," +
							"NSales," +
							"NImpression," + 
							"Notif_Date," + 
							"Clicks_Level," + 
							"Leads_Level," + 
							"Sales_Level," + 
							"Impression_Level," + 
							"Threshold_Email," + 
							"Type_Tracking," +
							"Tracking_Pixel," +
							"Country," +
							"Specific_Country," +
							"Note," +
							"approved)" +
							" VALUES " +
							"(" + 
							'"' + req.body[proparray[0]] + '",' +
							'"' + req.body[proparray[1]] + '",' +
							'"' + req.body[proparray[2]] + '",' +
							'"' + req.body[proparray[3]] + '",' +
							'"' + req.body[proparray[4]] + '",' +
							'"' + req.body[proparray[5]] + '",' + 
							'"' + req.body[proparray[6]] + '",' +
							'"' + req.body[proparray[7]] + '",' +
							'"' + req.body[proparray[8]] + '",' + 
							'"' + req.body[proparray[9]] + '",' + 
							'"' + req.body[proparray[10]] + '",' +
							'"' + req.body[proparray[11]] + '",' + 
							'"' + req.body[proparray[12]] + '",' + 
							'"' + req.body[proparray[13]] + '",' +
							'"' + req.body[proparray[14]] + '",' + 
							'"' + req.body[proparray[15]] + '",' +
							'"' + req.body[proparray[16]] + '",' + 
							'"' + req.body[proparray[17]] + '",' + 
							'"' + req.body[proparray[18]] + '",' + 
							'"' + req.body[proparray[19]] + '",' + 
							'"' + req.body[proparray[20]] + '",' +
							'"' + req.body[proparray[21]] + '",' +
							'"' + req.body[proparray[22]] + '",' +
							'"' + req.body[proparray[23]] + '",' +
							'"' + req.body[proparray[24]] + '",' +
							'"' + req.body[proparray[25]] + '",' +
							'"' + req.body[proparray[26]] + '",' +
							'"' + req.body[proparray[27]] + '",' + 
							'"' + req.body[proparray[28]] + '",' + 
							'"' + req.body[proparray[29]] + '",' + 
							'"' + req.body[proparray[30]] + '",' +
							'"' + req.body[proparray[31]] + '",' +
							'"' + req.body[proparray[32]] + '",' + 
							'"' + req.body[proparray[33]] + '",' + 
							'"' + req.body[proparray[34]] + '",' +
							'"' + req.body[proparray[35]] + '",' +
							'"' + req.body[proparray[36]] + '",' + 
							'"' + req.body[proparray[37]] + '",' +
							'"' + req.body[proparray[38]] + '",' +
							'"' + req.body[proparray[39]] + '",' + 
							'"' + req.body[proparray[40]] + '",' +
							'"' + req.body[proparray[41]] + '",' +
							'"' + req.body[proparray[42]] + '",' +
							'"' + req.body[proparray[43]] + '",' +
							'"' + req.body[proparray[44]] + '",' +
							'"' + req.body[proparray[45]] + '",' +
							'"' + req.body[proparray[46]] + '",' +
							'"' + country + '",' +
							'"' + req.body[proparray[48]] + '",' +
							'"' + '1' + 
							'");';
		console.log(info);
		var camp_id = 2;
		var advertiser_id = 2;
		var path = '';
		pool.getConnection(function(err, connection){
			console.log('1');
			connection.query(info, function(error, fields) {
				
			    console.log('did it:'  + fields.insertId);

			    // get the advertiser_id of the row just inserted
			    	if (parallel_universe == false){

				    	sql2 = 'UPDATE campaigns SET Tracking_Pixel="' + "<script type='text/javascript'> var ClickMeter_pixel_url = '//127.0.0.1:3000/pixel.gif?off_id=" + fields.insertId +"&add_id=" + req.body['add_id'] +"'; </script> <script type='text/javascript' id='cmpixelscript' src='//s3.amazonaws.com/scripts-clickmeter-com/js/pixelNew.js'></script> <noscript> <img height='0' width='0' alt='' src='http://127.0.0.1:3000/pixel.gif' /> </noscript>" +
				    	'" WHERE Assigned_ID = ' + fields.insertId + ";";
				    	console.log(sql2);
				    	connection.query(sql2, function(err, rows){
				    		if (err) console.log(err.message);
				    	});
			    	}
			    	camp_id = fields.insertId;
			    	advertiser_id = fields.insertId;
			    	// create a folder with camp_id and advertiser_id to store banners.
			    	path = "./views/admin/uploads/banner-" + camp_id + "-" + advertiser_id;

					var mkdirSync = function (path) {
						  try {
						    fs.mkdirSync(path);
						  } catch(e) {
						    if ( e.code != 'EEXIST' ) throw e;
						  }
						}
		
					mkdirSync(path);
					// store the images 
					for (var i in req.files){

						var tmp_path = req.files[i].path;
						var target_path = path + "/" + req.files[i].originalname;
						
						var src = fs.createReadStream(tmp_path);
						var dest = fs.createWriteStream(target_path);
						src.pipe(dest);

						fs.unlink(tmp_path, function (err) {
						  if (err) throw err;
						  console.log('successfully deleted ' + tmp_path);
						});
						src.on('error', function(err) { res.render('affiliateCreateCampaign.ejs', { message: null }); });
						}
			    	
							    
			    connection.release();
			    
			    // Don't use the connection here, it has been returned to the pool.
		  	});
		});
		res.redirect('/admin/all_campaigns');

	});
}