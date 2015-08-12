// *Mysql
var mysql = require('mysql');

var HOST = '205.178.146.115';
var PORT = 3306;
var MYSQL_USER = 'c_036288d_7';
var MYSQL_PASS = 'NhYUT19%';
var DATABASE = 'affiliate_web_database';
var TABLE = 'requests_info';

var pool = mysql.createPool({
	connectionlimit:2,
	host: HOST,
	database: DATABASE,
	user: MYSQL_USER,
	password: MYSQL_PASS,
});



///------------ *Socket.io & Emailjs - a approval process with automated email sending ----------///

var express = require('express');
var app = express();
var http = require('http').createServer(app);
var io = require('socket.io')(http);

var bodyParser = require('body-parser');
var path = require("path");

var morgan = require('morgan');
var cookieParser = require('cookie-parser');

// uploading
var multer  = require('multer');
var path = require('path');     //used for file path
var fs = require('fs-extra'); 


app.use(morgan('dev'));
//app.use(cookieParser());
app.use(bodyParser.urlencoded({extended: false}));
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/views'));
app.get('/',function(req,res){
  res.render('Signup_Application.ejs', { message: '' });
});

var upload = multer({ dest: './uploads/' });






//*Emailjs
var email = require('emailjs');
io.on("connection", function(socket){
	console.log("socket connected...");
	//// Send client's info when requested.
	socket.on("application info", function(data){
		var sql = '';
		if (data.message == '1'){
			sql = "SELECT First_Name, Last_Name, Company, SSN_TAX_ID, Site_URL1, Site_Category1," +
			"Address1, City, State, State2, Country, Zip, Phone, Assigned_ID FROM client_info " +
			"WHERE approved = 0;";
		} else {
			sql = "SELECT First_Name, Last_Name, Email, Company, SSN_TAX_ID, Site_URL1, Site_Category1," +
			"Address1, City, State, State2, Country, Zip, Phone, Assigned_ID FROM client_info " +
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
	socket.on("remove affiliate", function(data){
		var id = data.ID;
		sql = "DELETE FROM client_info WHERE Assigned_ID=" + id + ";";
		pool.getConnection(function(err, connection){
			connection.query(sql, function(err, rows){
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
		sql = "UPDATE client_info SET approved = 1 WHERE Assigned_ID = " + id.ID + ";";
		sql2 = "SELECT Email FROM client_info WHERE Assigned_ID = " + id.ID + ";";
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
					   to:      "me <jwang@cminyc.com>",
					   cc:      "",
					   subject: "testing emailjs"
					}, function(err, message) { console.log(err || message); });

				}
				connection.release();
			});
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
					   to:      "me <jwang@cminyc.com>",
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
					   to:      "me <jwang@cminyc.com>",
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

//------------------------------------------------------------------------------------------------//












///---------------------- *Passport -- two signup, login functions ---------------------------///



var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var flash    = require('connect-flash');
var session  = require('express-session');
var bcrypt = require('bcrypt-nodejs');


app.use(session({
	secret: 'vidyapathaisalwaysrunning',
	resave: true,
	saveUninitialized: true
 } )); // session secret


passport.serializeUser(function(user, done) {
	// if the user is an advertiser, add 'ad' before the ID to differentiate it from affiliates

	console.log('identity: ' + user.Identity);
	var id = {num:user.Assigned_ID, Identity:user.Identity};
    done(null, id);
    });

//TEST
passport.deserializeUser(function(id, done) {
	console.log('test: ' + id.Identity);
	console.log(!id.Identity);
	if (id.Identity == 'ad'){
		pool.getConnection(function(err, connection){
	    	connection.query("SELECT * FROM advertiser_info WHERE Assigned_ID = ? ",[id.num], function(err, rows){
	        done(err, rows[0]);
	        connection.release();
	    	});
    	});
	} 
	if (id.Identity == 'admin'){
		done(null, id);
	}
	else{
		pool.getConnection(function(err, connection){
    		connection.query("SELECT * FROM client_info WHERE Assigned_ID = ? ",[id.num], function(err, rows){
	        done(err, rows[0]);
	        connection.release();
    		});
    	});
	}
});

app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); 



//// Affiliate Login
app.set('view engine', 'ejs');
app.get('/login', function(req, res, err){
	res.render('affiliateLogin.ejs', { message: req.flash('loginMessage') });
});

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

app.post('/login', passport.authenticate('local-login', {
	successRedirect: '/offers',
	failureRedirect: '/login',
	failureFlash: true
}));



////  Advertiser Login
app.get('/login_ad', function(req, res, err){
	res.render('advertiserLogin.ejs', { message: req.flash('login_ad_Message') });
});

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

app.post('/login_ad', passport.authenticate('local-login-ad', {
	successRedirect: '/profile_ad',
	failureRedirect: '/login_ad',
	failureFlash: true
}));



////  Affiliate Signup
app.get('/signup', function(req, res, err){
	res.render('Signup_Application.ejs', { message: req.flash('signupMessage') });
});

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
			console.log(proparray.length + 2);
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
						"Password," +
						"Company," + 
						"Checks_To," + 
						"SSN_TAX_ID," +
						"Payment_Threshhold," + 
						"Email," + 
						"Phone," + 
						"Address1," + 
						"Address2," + 
						"City," + 
						"State," +
						"State2," +
						"Country," + 
						"Zip," + 
						"AIM," + 
						"Site_URL1," + 
						"Alexa_Ranking1," + 
						"Site_URL2," + 
						"Alexa_Ranking2," + 
						"Site_URL3," + 
						"Alexa_Ranking3," + 
						"Site_URL4," + 
						"Alexa_Ranking4," + 
						"CPA_Affiliate_Marketing," + 
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
						'"' + bcrypt.hashSync(req.body[proparray[3]], null, null) + '",'+
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
						'"' + req.body[proparray[43]] + 
						'");';

						console.log(info);
						
					  	// Use the connection

					  	connection.query(info, function(err, fields) {
						    console.log('did it:');
						 
						    sql1 = "SELECT * FROM client_info WHERE Email = ?"
						    connection.query(sql1, [username], function(err, rows){
						    	console.log(rows[0]);
						    	return done(null, rows[0]);
						    	
						    });
						    
						    // Don't use the connection here, it has been returned to the pool.
					  	});
					  	connection.release();

	                }
	            });
			});
		}));
   
app.post('/signup', passport.authenticate('local-signup', {
		successRedirect : '/login', // redirect to the secure profile section
		failureRedirect : '/signup', // redirect back to the signup page if there is an error
		failureFlash : true // allow flash messages
}));



//// Advertiser Signup
app.get('/signup_ad', function(req, res, err){
	res.render('advertiserSignup.ejs', { message: req.flash('signup_ad_Message') });
});

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
						    	return done(null, rows[0]);
						    	
						    });
						    
					  	});
					  	connection.release();

	                }
	            });
			});
		}));

app.post('/signup_ad', passport.authenticate('local-signup-ad', {
		successRedirect : '/login', // redirect to the secure profile section
		failureRedirect : '/signup_ad', // redirect back to the signup page if there is an error
		failureFlash : true // allow flash messages
}));

//----------------------------------------------------------------------------------------------//
//-------------------------------------Affiliates-----------------------------------------------//
//check if logged in

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

	if (req.session.passport.Identity != 'ad'){

		var sql = "SELECT * FROM campaigns WHERE approved = 1;";
		pool.getConnection(function(err, connection){
			connection.query(sql, function(err, rows){
				res.render('affiliateCampaignsDescription.ejs', { message: rows });
				connection.release();
			});
		});

		

	} else{
		res.render('affiliateLogin.ejs', { message: null });
	}
	
});




//----------------------------------------------------------------------------------------------//
//--------------------------------------------Admin---------------------------------------------//
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
	"State2='" + req.body[proparray[12]] + "', " +
	"Country='" + req.body[proparray[13]] + "', " +
	"Zip='" + req.body[proparray[14]] + "', " +
	"Site_URL1='" + req.body[proparray[15]] + "', " +
	"Alexa_Ranking1='" + req.body[proparray[16]] + "', " +
	"Site_URL2='" + req.body[proparray[17]] + "', " +
	"Alexa_Ranking2='" + req.body[proparray[18]] + "', " +
	"Site_URL3='" + req.body[proparray[19]] + "', " +
	"Alexa_Ranking3='" + req.body[proparray[20]] + "', " +
	"Site_URL4='" + req.body[proparray[21]] + "', " +
	"Alexa_Ranking4='" + req.body[proparray[22]] + "', " +
	"CPA_Affiliate_Marketing='" + req.body[proparray[23]] + "', " +
	"Site_Category1='" + req.body[proparray[24]] + "', " +
	"Site_Category2='" + req.body[proparray[25]] + "', " +
	"Site_Category3='" + req.body[proparray[26]] + "', " +
	"Unique_Visitors_PM='" +req.body[proparray[27]] + "', " +
	"News_Letter='" + req.body[proparray[28]] + "', " +
	"Solo_Email='" + req.body[proparray[29]] + "', " +
	"Sin_Dou_Optin='" + req.body[proparray[30]] + "', " +
	"Mailing_Freq='" + req.body[proparray[31]] + "', " +
	"Time_Record='" + req.body[proparray[32]] +
	"' WHERE Assigned_ID = " + req.body[proparray[i-1]] + ";"; 
	pool.getConnection(function(err, connection){
		connection.query(sql, function(err, fields){
			if (err){
				console.log("Genuis strikes again: " + err.message);
			}
		});
		connection.release();
	});
});

app.post('/admin', passport.authenticate('local-login-admin', {
		successRedirect : '/admin/Create_Campaign', // redirect to the secure profile section
		failureRedirect : '/admin', // redirect back to the signup page if there is an error
		failureFlash : true // allow flash messages
}));
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
	       

    })
);

app.get("/admin/Create_Campaign", adminloggedin, function(req, res, err){
	res.render('affiliateCreateCampaign.ejs', { message: null });
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
	// special case for no.46 entry
	var country = req.body[proparray[46]];
	if (req.body[proparray[46]] != null && req.body[proparray[46]][0] == ','){
		country = req.body[proparray[46]].substring(1, req.body[proparray[46]][0].length);
		country = country[1];
	}
	console.log( req.body[proparray[47]]);

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
						'"' + country + '",' +
						'"' + req.body[proparray[47]] + 
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
			sql1 = "SELECT Advertiser_ID FROM campaigns WHERE Assigned_ID = ?"
		    connection.query(sql1, fields.insertId, function(err, rows){
		    	
		    	console.log(rows[0]);
		    	camp_id = fields.insertId;
		    	advertiser_id = rows[0].Advertiser_ID;
		    	// create a folder with camp_id and advertiser_id to store banners.
		    	path = "./uploads/banner-" + camp_id + "-" + advertiser_id;

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
		    	
		    	
		    });
						    
		    connection.release();
		    
		    // Don't use the connection here, it has been returned to the pool.
	  	});
	});

});



//----------------------------------------------------------------------------------------------//
//---------------------------------pixel tracking handling--------------------------------------//

app.get('/pixel.gif', function(req, res, err){
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

	console.log(req.session);
	console.log(req.headers['x-forwarded-for'] || req.connection.remoteAddress);
	console.log(req.startTime);


///////////////////////////////////////////////////////////////////////////////////////////////
	// put this as one of the first middleware so it acts 
	// before other middleware spends time processing the request
	var countip = false;
	console.log(accesses.check(req.connection.remoteAddress));
	if (accesses.check(req.connection.remoteAddress)){
		countip = true;
	}
//////////////////////////////////////////////////////////////////////////////////////////////
	// count the clicks in mysql
	// make sure one ip address only counts once
	offer_id = req.query.offer_id;
	aff_id = req.query.aff_id;

	//var sql2 = "SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS WHERE Table_Name = 'campaigns' AND COLUMN_NAME LIKE 'af%';"
	if (countip){
	var sql = "UPDATE campaigns SET Unique_Click = Unique_Counts + 1 WHERE Offer_ID = " + offer_id + ";";
	pool.getConnection(function(err, connection){
		connection.query(sql, function(err, rows){
			console.log("sucess:", rows);
			connection.release();
		});
	});
	}
	
	res.sendFile("views/pixel.html", {root: __dirname});
});

// Data Structure For Unique IP Count.
function AccessLogger(blockTime) {
	    this.blockTime = blockTime;
	    this.requests = {};
	    // schedule cleanup on a regular interval (every 2 hours)
	    this.interval = setInterval(this.age.bind(this), 1 * 60 * 60 * 1000);
}

AccessLogger.prototype = {
	check: function(ip) {
	     	var info, accessTimes, now, cnt;

	        // add this access
	        this.add(ip);

	        // should always be an info here because we just added it
	        info = this.requests[ip];
	        accessTimes = info.accessTimes;

	        // calc time limits
	        now = Date.now();
	        //limit = now - this.time;
	        console.log("request: " + this.requests[ip].accessTimes);
	        console.log("blockuntil: " + this.requests[ip].blockUntil);
	        // short circuit if already blocking this ip
	        if (info.blockUntil >= now) {
	            return false;
	        }

	        info.blockUntil = now + this.blockTime;
	        return true;

	    },
	    add: function(ip) {
	        var info = this.requests[ip];
	        if (!info) {
	            info = {accessTimes: [], blockUntil: 0};
	            this.requests[ip] = info;
	        }
	        // push this access time into the access array for this IP
	        info.accessTimes.push(Date.now());
	    },
	    age: function() {
	        // clean up any accesses that have not been here within this.time and are not currently blocked
	        var ip, info, accessTimes, now = Date.now(), index;
	        for (ip in this.requests) {

	            if (this.requests.hasOwnProperty(ip)) {
	                info = this.requests[ip];
	                accessTimes = info.accessTimes;
	                // if not currently blocking this one
	                if (info.blockUntil < now) {
	                            info.accessTimes = [];
	                        //}
	                    }
	                }
	            }
	        }
	    }

//block for 6 hours 
var accesses = new AccessLogger(6 * 60 * 60 * 1000);



http.listen(3000, function(){
  console.log("Started on PORT 3000");
})
/* Table Created, this section of code may not be further used.
// Can be optimized with CHAR
var sql = "CREATE TABLE client_info( " +
	"First_Name VARCHAR(50) NOT NULL," +
	"Last_Name VARCHAR(50) NOT NULL," +
	"Password VARCHAR(20) NOT NULL," +
	"Company VARCHAR(50)," + 
	"Checks_To VARCHAR(50) NOT NULL," + 
	"SSN_TAX_ID VARCHAR(20) NOT NULL," +
	"Payment_Threshhold ENUM('100', '500', '1000') NOT NULL," + 
	"Email VARCHAR(50) NOT NULL," + 
	"Phone VARCHAR(21) NOT NULL," + 
	"Address1 VARCHAR(50) NOT NULL," + 
	"Address2 VARCHAR(50)," + 
	"City VARCHAR(50) NOT NULL," + 
	"State VARCHAR(20) NOT NULL," +
	"Country VARCHAR(45) NOT NULL," + 
	"Zip VARCHAR(20) NOT NULL," + 
	"AIM VARCHAR(50)," + 
	"Site_URL1 VARCHAR(100)," + 
	"Alexa_Ranking1 VARCHAR(100)," + 
	"Site_URL2 VARCHAR(100)," + 
	"Alexa_Ranking2 VARCHAR(100)," + 
	"Site_URL3 VARCHAR(100)," + 
	"Alexa_Ranking3 VARCHAR(100)," + 
	"Site_URL4 VARCHAR(100)," + 
	"Alexa_Ranking4 VARCHAR(100)," + 
	"CPA_Affiliate_Marketing ENUM('Highly experienced', 'Some experience', 'Traditional Affiliate Marketing experience only', 'New to Affiliate Marketing')," + 
	"Site_Category1 VARCHAR(45)," + 
	"Site_Category2 VARCHAR(45)," + 
	"Site_Category3 VARCHAR(45)," + 
	"Unique_Visitors_PM INT(10)," +
	"Source_of_Site_Analytics VARCHAR(20)," + 
	"CP_PPC CHAR(3) NOT NULL," +
	"CP_Monthly_Speed CHAR(10) NOT NULL," +
	"CP_SEO CHAR(3) NOT NULL," +
	"CP_Incentives CHAR(3) NOT NULL," +
	"CP_Email CHAR(3) NOT NULL," +
	"CP_Other TEXT," + 
	"News_Letter CHAR(3)," + 
	"Num_Subs CHAR(20)," + 
	"Solo_Email CHAR(3)," + 
	"Sin_Dou_Optin CHAR(6)," + 
	"Mailing_Freq CHAR(20)," + 
	"Time_Record CHAR(3)" +
	")";
	Assigned ID
connection.query(sql);
*//////


	
// If there is an error (internet disconnects etc.) 
//add an exception or error message

