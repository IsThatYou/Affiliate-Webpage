var LocalStrategy = require('passport-local').Strategy;


module.exports = function(passport, pool) {
	passport.serializeUser(function(user, done) {
		// if the user is an advertiser, add 'ad' before the ID to differentiate it from affiliates
		if (user) {
			if (user == "signup"){
				done(null, "signup");
			} else {
				console.log('identity: ' + user.Identity);
				var id = {num:user.Assigned_ID, Identity:user.Identity};
			    done(null, id);
			}
		};
	});
	passport.deserializeUser(function(id, done) {
		console.log('test: ' + id.Identity);
		console.log(!id.Identity);
		if (id == "signup"){
			done(null, "signing up");
		} else if (id.Identity == 'ad'){
			console.log("guacomoli" + id.num);
			pool.getConnection(function(err, connection){
		    	connection.query("SELECT * FROM advertiser_info WHERE Assigned_ID = ? ",[id.num], function(err, rows){
			        console.log("guacomoli" + rows[0]);
			        done(err, rows[0]);
			        connection.release();
		    	});
	    	});
		} 
		else if (id.Identity == 'admin'){
			done(null, id);
		}
		else {
			pool.getConnection(function(err, connection){
	    		connection.query("SELECT * FROM client_info WHERE Assigned_ID = ? ",[id.num], function(err, rows){
			        done(err, rows[0]);
			        connection.release();
	    		});
	    	});
		}
	});

	//---------------------------------Affiliate Login-----------------------------------//
	//-----------------------------------------------------------------------------------//
	passport.use(
	    'local-login',
	    new LocalStrategy({
	        // by default, local strategy uses username and password, we will override with email
	        usernameField : 'email',
	        passwordField : 'password',
	        passReqToCallback : true // allows us to pass back the entire request to the callback
	    },
	    function(req, username, password, done) { // callback with email and password from our form
	        pool.getConnection(function(err, connection){
		        connection.query("SELECT * FROM client_info WHERE Email = ?",[username], function(err, rows){
		            if (err)
		                return done(err);
		            if (!rows.length || !bcrypt.compareSync(password, rows[0].Password)){
		                return done(null, false, req.flash('loginMessage', 'Oops! Wrong Password or Email.')); // create the loginMessage and save it to session as flashdata
		            }
		            if (rows[0].approved == 0){
		            	return done(null, false, req.flash('loginMessage', 'Account Pending'));
		            }
		            if (rows[0].approved == 2){
		            	return done(null, false, req.flash('loginMessage', 'Account Denied'));
		            }
		            // if the user is found but the password is wrong
		            
		            // all is well, return successful user
		            return done(null, rows[0]);
		            connection.release();
		        });
	        });
    })
);


	//---------------------------------Advertiser Login-----------------------------------//
	//-----------------------------------------------------------------------------------//
	passport.use(
	    'local-login-ad',
	    new LocalStrategy({
	        // by default, local strategy uses username and password, we will override with email
	        usernameField : 'email',
	        passwordField : 'password',
	        passReqToCallback : true // allows us to pass back the entire request to the callback
	    },
	    function(req, username, password, done) { // callback with email and password from our form
	        pool.getConnection(function(err, connection){
		        connection.query("SELECT * FROM advertiser_info WHERE Email = ?",[username], function(err, rows){
		            if (err)
		                return done(err);
		            if (!rows.length || !bcrypt.compareSync(password, rows[0].Password)){
		                return done(null, false, req.flash('login_ad_Message', 'Oops! Wrong Password or Email.')); // create the loginMessage and save it to session as flashdata
		            }
		            if (rows[0].approved == 0){
		            	return done(null, false, req.flash('login_ad_Message', 'Account Pending'));
		            }
		            if (rows[0].approved == 2){
		            	return done(null, false, req.flash('login_ad_Message', 'Account Denied'));
		            }
		            // if the user is found but the password is wrong
		            
		            // all is well, return successful user
		            return done(null, rows[0]);
		            connection.release();
		        });
	        });
	    })
	);

	//---------------------------------Affiliate Signup-----------------------------------//
	//------------------------------------------------------------------------------------//
	passport.use(
        'local-signup',
        new LocalStrategy({
            // by default, local strategy uses username and password, we will override with email
            usernameField : 'email',
            passwordField : 'password',
            passReqToCallback : true // allows us to pass back the entire request to the callback
        },
        function(req, username, password, done) {
        	var proparray = [];
			for (var prop in req.body){
				proparray.push(prop);
			}
			console.log(req.body);
			for (var i = 0; i < proparray.length; i++){
				if (req.body[proparray[i]] == '' || req.body[proparray[i]] == 'http://' || req.body[proparray[i] == undefined]){
					req.body[proparray[i]] = null;
				}
			}
            // find a user whose email is the same as the forms email
            // we are checking to see if the user trying to login already exists
            pool.getConnection(function(err, connection){
	            connection.query("SELECT * FROM client_info WHERE Email = ?",[username], function(err, rows) {
	                if (err)
	                    return done(err);
	                if (rows.length) {
	                    return done(null, false, req.flash('signupMessage', 'That email is already registered.'));
	                } else {
	                    // if there is no user with that username
	                    // create the user
						var info = "INSERT INTO client_info" + 
						"(First_Name," +
						"Last_Name," +
						"SSN_TAX_ID," +
						"Company," + 
						"Email," + 
						"Phone," + 
						"Address1," + 
						"Address2," + 
						"City," + 
						"State," +
						"Zip," + 
						"Country," + 
						"Password," +
						"Checks_To," + 
						"CPA_Affiliate_Marketing," + 
						"Site_URL1," + 
						"Site_URL2," + 
						"Site_URL3," + 
						"Site_URL4," +
						"Site_Category1," + 
						"Site_Category2," + 
						"Site_Category3," +  
						"Unique_Visitors_PM," +
						"Source_of_Site_Analytics," + 
						"CP_PPC," +
						"CP_Monthly_Speed," +
						"CP_SEO," +
						"CP_Incentives," +
						"CP_Email," +
						"CP_Other," + 
						"News_Letter," + 
						"Num_Subs," + 
						"Solo_Email," + 
						"Sin_Dou_Optin," + 
						"Mailing_Freq," + 
						"Time_Record)" + 
						" VALUES " +
						"(" + 
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
						'"' + bcrypt.hashSync(req.body[proparray[13]], null, null) + '",'+
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
						'"' + req.body[proparray[36]] + 
						'");';

						console.log(info);
						
					  	// Use the connection

					  	connection.query(info, function(err, fields) {
						    console.log('did it:');
						 
						    sql1 = "SELECT * FROM client_info WHERE Email = ?"
						    connection.query(sql1, [username], function(err, rows){
						    	console.log(rows[0]);
						    	return done(null, "signing up",req.flash('thankyouMessage', 'Thank you for signing up as an affiliate'));
						    	
						    });
						    
						    // Don't use the connection here, it has been returned to the pool.
					  	});
					  	connection.release();

	                }
	            });
			});
		})); 


	//---------------------------------Advertiser Signup-----------------------------------//
	//-------------------------------------------------------------------------------------//
	passport.use(
        'local-signup-ad',
        new LocalStrategy({
            // by default, local strategy uses username and password, we will override with email
            usernameField : 'email',
            passwordField : 'password',
            passReqToCallback : true // allows us to pass back the entire request to the callback
        },
        function(req, username, password, done) {
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
            // find a user whose email is the same as the forms email
            // we are checking to see if the user trying to login already exists
            pool.getConnection(function(err, connection){
	            connection.query("SELECT * FROM advertiser_info WHERE Email = ?",[username], function(err, rows) {
	                if (err)
	                    return done(err);
	                if (rows.length) {
	                    return done(null, false, req.flash('signup_ad_Message', 'That email is already registered.'));
	                } else {
	                    // if there is no user with that username
	                    // create the user

						var info = "INSERT INTO advertiser_info" + 
									"(First_Name," +
									"Last_Name," +
									"Password," +
									"Company," + 
									"Email," + 
									"Phone," + 
									"Address," + 
									"Address2," + 
									"City," + 
									"State," +
									"State2," +
									"Country," + 
									"Zip," + 
									"Affiliate_Marketing," + 
									"Media_Buying," +
									"Campaign_Dev," +
									"Lead_Gene," +
									"SEO," +
									"Overview" + 
									")" +
									" VALUES " +
									"(" + 
									'"' + req.body[proparray[1]] + '",' +
									'"' + req.body[proparray[2]] + '",' +
									'"' + bcrypt.hashSync(req.body[proparray[3]], null, null) + '",' +
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
									'"' + req.body[proparray[19]] + 
									'");' 

						console.log(info);
						
					  	// Use the connection
					  	connection.query(info, function(err, fields) {
						    // And done with the connection.
						    console.log('did it:');
						 
						    sql1 = "SELECT * FROM advertiser_info WHERE Email = ?"
						    connection.query(sql1, [username], function(err, rows){
						    	console.log(rows[0]);
						    	return done(null, "signup",req.flash('thankyouMessage', 'Thank you for signing up as an advertiser'));
						    	
						    });
						    
					  	});
					  	connection.release();

	                }
	            });
			});
		}));

	//---------------------------------Affiliate Login-----------------------------------//
	//-----------------------------------------------------------------------------------//
	passport.use(
	    'local-login-admin',
	    new LocalStrategy({
	        // by default, local strategy uses username and password, we will override with email
	        usernameField : 'email',
	        passwordField : 'password',
	        passReqToCallback : true // allows us to pass back the entire request to the callback
	    },
	    function(req, username, password, done) { // callback with email and password from our form
	    	var true_pass = 'cminyc';
	    	var true_user = 'admin';
	    	console.log(username, password);
	        if (!username.length || true_pass != password || username != true_user){
	            return done(null, false, req.flash('login_admin_Message', 'Oops! Wrong Password or Email.')); // create the loginMessage and save it to session as flashdata
	        }

	        // if the user is found but the password is wrong
	        
	        // all is well, return successful user
	        var the = {Assigned_ID: true_user, Identity:"admin"};
	        return done(null, the);

	    }));
};