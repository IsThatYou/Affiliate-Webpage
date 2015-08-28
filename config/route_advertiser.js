module.exports = function(app, pool, upload, fs) {
	function loggedin_ad(req, res, next){
		if (req.user){
			next();
		}
		else{
			res.redirect('/login_ad');
		}
	}

	app.get("/Create_Campaign", loggedin_ad, function(req, res, err){

		console.log(req.session.passport.user.Identity =='ad');
		if (req.session.passport.user.Identity == 'ad'){

			res.render('affiliateCreateCampaign.ejs', { message: null });
		} else {
			res.redirect('/login_ad');
		}
	});


	app.post('/Create_Campaign', upload.array('fileUploaded', 12), function (req, res, next) {
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
							"Note)" +
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
							'"' + req.body[proparray[48]] + 
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
			    		var tracking_pixel = 
				    	sql2 = 'UPDATE campaigns SET Tracking_Pixel="' + "<script type='text/javascript'> var ClickMeter_pixel_url = '//127.0.0.1:3000/pixel.gif?off_id=" + fields.insertId +"aff_id=" + req.body['add_id'] +"'; </script> <script type='text/javascript' id='cmpixelscript' src='//s3.amazonaws.com/scripts-clickmeter-com/js/pixelNew.js'></script> <noscript> <img height='0' width='0' alt='' src='http://127.0.0.1:3000/pixel.gif' /> </noscript>" +
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
		res.render("thankYou.ejs", {message: 'Thank you for creating the campaign'});

	});
}