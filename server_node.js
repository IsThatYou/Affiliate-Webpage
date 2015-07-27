// *Mysql
var mysql = require('mysql');

var HOST = '205.178.146.115';
var PORT = 3306;
var MYSQL_USER = 'c_036288d_7';
var MYSQL_PASS = 'NhYUT19%';
var DATABASE = 'affiliate_web_database';
var TABLE = 'requests_info';

var pool = mysql.createPool({
	connectionlimit:10,
	host: HOST,
	database: DATABASE,
	user: MYSQL_USER,
	password: MYSQL_PASS,
});



// *Socket.io
var express = require('express');
var app = express();
var http = require('http').createServer(app);
var io = require('socket.io')(http);

var bodyParser = require('body-parser');
var path = require("path");

var morgan = require('morgan');
var cookieParser = require('cookie-parser');

app.use(morgan('dev'));
//app.use(cookieParser());
app.use(bodyParser.urlencoded({extended: false}));
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/views'));
app.get('/',function(req,res){
  res.sendFile("views/Signup_Application.html", {root:__dirname});
});












//*Emailjs
var email = require('emailjs');
io.on("connection", function(socket){
	console.log("socket connected...");
	//// Send client's info when requested.
	socket.on("application info", function(){
		
		sql = "SELECT First_Name, Last_Name, SSN_TAX_ID, Site_URL1, Site_Category1," +
		"Address1, City, State, State2, Country, Zip, Phone, Assigned_ID FROM client_info " +
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
				socket.emit("application_info", {results:results});
		    	
	    	}
	    	connection.release();
	    // Don't use the connection here, it has been returned to the pool.
	 	 });
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


































app.get('/approve',function(req,res){

  res.sendFile("views/affiliateApproval.html", {root:__dirname});

});
app.get('/approve_ad',function(req,res){

  res.sendFile("views/advertiserApproval.html", {root:__dirname});

});
// *Passport
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
        done(null, user.Assigned_ID);
    });
passport.deserializeUser(function(id, done) {
	pool.getConnection(function(err, connection){
    	connection.query("SELECT * FROM client_info WHERE Assigned_ID = ? ",[id], function(err, rows){
        done(err, rows[0]);
    	});
    });
});
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); 




app.get('/login', function(req, res, err){
	res.sendFile("views/affiliateLogin.html", {root: __dirname});
});
app.post('/login', function(req, res, err){
	//
	console.log("hello");
	res.sendFile("views/affiliateLogin.html", {root: __dirname});

});

// Go to the affiliate signup page
app.get('/signup', function(req, res, err){
	var bottle = req.flash('signupMessage');
	console.log(bottle[0]);
	if (bottle[0] != undefined){
		io.on("connection", function(socket){
			socket.emit("afsignup", {message: bottle});
			
		});
	}
	io.on("connection", function(socket){
		socket.emit("afsignup_delete");

	});
	res.sendFile("views/Signup_Application.html", {root: __dirname});
});
// Submit affiliate sign up


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

						console.log('e');
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
					 	//connection.release();
					  	connection.query(info, function(err, fields) {
						    // And done with the connection.
						    console.log('did it:');
						 
						    sql1 = "SELECT * FROM client_info WHERE Email = ?"
						    connection.query(sql1, [username], function(err, rows){
						    	console.log(rows[0]);
						    	return done(null, rows[0]);
						    	connection.release();
						    });
						    
						    // Don't use the connection here, it has been returned to the pool.
					  	});

	                }
	            });
			});
		}));
   
app.post('/signup', passport.authenticate('local-signup', {
		successRedirect : '/login', // redirect to the secure profile section
		failureRedirect : '/signup', // redirect back to the signup page if there is an error
		failureFlash : true // allow flash messages
}));
//// advertiser sign up
app.get("/signup_ad", function(req, res, err){
	res.sendFile("views/advertiserSignup.html", {root:__dirname});
});
app.post("/signup_ad", function(req, res, err){
	var proparray = [];
	for (var prop in req.body){
		proparray.push(prop);
	}
	for (var i = 0; i < proparray.length; i++){
		if (req.body[proparray[i]] == '' || req.body[proparray[i]] == 'http://' || req.body[proparray[i] == undefined]){
			req.body[proparray[i]] = null;
		}

	}
	sql0 = "SELECT * FROM advertiser_info WHERE Email = '" + req.body[proparray[5]] + "';";
	pool.getConnection(function(err, connection){
		connection.query(sql0, function selectCb(err, results, fields){
			if (err){
            	console.log("ERR:" + err);
            }
            if (results.length) {
                req.flash('signupMessage', 'That email is already taken.');
            } else {
                // if there is no user with that username
                // create the user

				console.log('e');
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
			  	connection.query(info, function(err, rows) {
			    // And done with the connection.
			    console.log('did it');
			    console.log(err);
			    console.log(rows);
			    connection.release();
			    // Don't use the connection here, it has been returned to the pool.
			  });
		
				
				res.writeHead(301,
			  	{Location: 'affiliateLogin.html'});
			  	res.end();
		}
    });
});
	
});
passport.use(
    'local-login',
    new LocalStrategy({
        // by default, local strategy uses username and password, we will override with email
        usernameField : 'username',
        passwordField : 'password',
        passReqToCallback : true // allows us to pass back the entire request to the callback
    },
    function(req, username, password, done) { // callback with email and password from our form
        connection.query("SELECT * FROM users WHERE username = ?",[username], function(err, rows){
            if (err)
                return done(err);
            if (!rows.length) {
                return done(null, false, req.flash('loginMessage', 'No user found.')); // req.flash is the way to set flashdata using connect-flash
            }

            // if the user is found but the password is wrong
            if (!bcrypt.compareSync(password, rows[0].password))
                return done(null, false, req.flash('loginMessage', 'Oops! Wrong password.')); // create the loginMessage and save it to session as flashdata

            // all is well, return successful user
            return done(null, rows[0]);
        });
    })
);











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
	console.log(req.session.cookie);
	res.sendFile("views/pixel.html", {root: __dirname});
});


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

