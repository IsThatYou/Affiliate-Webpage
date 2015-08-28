// *Mysql
var mysql = require('mysql');

var HOST = '205.178.146.115';
var PORT = 3306;
var MYSQL_USER = 'c_036288d_7';
var MYSQL_PASS = 'NhYUT19%';
var DATABASE = 'affiliate_web_database';
var TABLE = 'requests_info';

var pool = mysql.createPool({
	connectionlimit:50,
	host: HOST,
	database: DATABASE,
	user: MYSQL_USER,
	password: MYSQL_PASS,
	acquireTimeout: 30000
});



///------------ *Socket.io & Emailjs - a approval process with automated email sending ----------///

var express = require('express');
var app = express();
var http = require('http').createServer(app);


var bodyParser = require('body-parser');
var path = require("path");

var morgan = require('morgan');
var cookieParser = require('cookie-parser');


// uploading
var multer  = require('multer');
var path = require('path');     //used for file path
var fs = require('fs-extra'); 

var open = require('open');

app.use(morgan('dev'));
app.use(bodyParser.urlencoded({extended: false}));
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/views'));
app.use(cookieParser('secret'));
app.set('view engine', 'ejs');

var upload = multer({ dest: './uploads/' });


//-----------------------Socket.io every page that needs socket.io:------------------------//
//adminOffersApproval.html, advertiserApproval.html, affiliateApproval.html,
//affiliateCampaignInformation.ejs, affiliateCampaignManagementList.ejs,
//affiliatePayouts.html, affiliateUserManagementList.ejs


//*Emailjs
var io = require('socket.io')(http);
var email = require('emailjs');
require("./config/socketio")(io, email, pool);


//------------------------------------------------------------------------------------------------//
///---------------------- *Passport -- two signup, login functions ---------------------------///

var passport = require('passport');
var flash    = require('connect-flash');
var bcrypt = require('bcrypt-nodejs');
var session  = require('express-session');


require('./config/passport')(passport, pool);


app.use(session({
	secret: 'vidyapathaisalwaysrunning',
	resave: true,
	saveUninitialized: true
 } )); // session secret


app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); 


///------------------------------------------ route.js------------------------------------------///
//--------------------------------for general pages, signup/login------------------------------//
require('./config/route')(app, passport);


//----------------------------------------------------------------------------------------------//
//--------------------------------------------Affiliates--------------------------------------//
//check if logged in
require('./config/route_affiliate')(app, pool, fs, flash);


//----------------------------------------------------------------------------------------------//
//--------------------------------------------Advertiser---------------------------------------------//
require('./config/route_advertiser')(app, pool, upload, fs);


//----------------------------------------------------------------------------------------------//
//--------------------------------------------Admin---------------------------------------------//
require('./config/route_admin')(app, pool, upload, fs);


//----------------------------------------------------------------------------------------------//
//-------------------------------pixel tracking/banner handling-------------------------------//
// it is recommended to do the pixel tracking and image in a different server, but due to having
// only one server, I will just use the same server for monitoring.
require('./config/tracking')(app, pool);


process.on('uncaughtException', function(err) {
    if(err.errno === 'EADDRINUSE')
         console.log(err);
    else
         console.log(err);
    process.exit(1);
});     
http.listen(3000, function(err){
	if (err) {
		console.log(err);
	}
  console.log("Started on PORT 3000");
})

///////////////////////////////////ends here/////////////////////////////////////










// Data Structure For Unique IP Count.
// (Not Implemented)
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




