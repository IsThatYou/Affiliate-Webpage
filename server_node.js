
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




var express = require('express');

var app = express();

var http = require('http').Server(app);
var io = require('socket.io')(http);
var bodyParser = require('body-parser');
var path = require("path");

console.log("express working fine");
app.use(bodyParser.urlencoded({extended: false}));
//app.set('view engine', 'html');
app.set('views', __dirname + '/views');
app.get('/',function(req,res){
  res.sendFile("views/Signup_Application.html", {root:__dirname});
});










function request_fr_mysql(){
	sql = "SELECT First_Name, Last_Name, SSN_TAX_ID, Site_URL1, Site_Category1," +
	"Address1, City, State, State2, Country, Zip, Phone FROM client_info " +
	"WHERE approved = 0;";
	pool.getConnection(function(err, connection) {
  	// Use the connection
  		connection.query(sql, function selectCb(err, results, fields) {
  		if (err){
  			console.log(err.message);
  		}
    // And done with the connection.
    	if (results.length > 0){

	    	console.log("sent");
	    	console.log(results[0].First_Name);
	    	connection.release();
	    	return results;
    	}
    // Don't use the connection here, it has been returned to the pool.
 	 });
  	});
}

io.on("connection", function(socket){
	console.log("socket connected...");
	
	socket.on("request_application_info", function(data){
		// Send client's info when requested.
		results = request_fr_mysql();
		console.log("message:" + results);
		socket.emit("application_info", {results:results});
	});
	

});


































app.get('/approve',function(req,res){
	//add sign up authention
	/*
	sql = "SELECT First_Name, Last_Name, SSN_TAX_ID, Site_URL1, Site_Category1," +
	"Address1, City, State, State2, Country, Zip, Phone FROM client_info " +
	"WHERE approved = 0;";
	pool.getConnection(function(err, connection) {
  		// Use the connection
  		connection.query(sql, function selectCb(err, results, fields) {
  		if (err){
  			console.log(err.message);
  		}
    	// And done with the connection.
    	if (results.length > 0){

	    	console.log("sent");
	    	console.log(results[0].First_Name);
	    	connection.release();
    	}
    	// Don't use the connection here, it has been returned to the pool.
 	 });
  	});
  	*/
  		

  res.sendFile("views/affiliateApproval.html", {root:__dirname});
});

//connection.connect();
app.post('/signup',function(req,res, err){
	
	if (err){
		res.sendFile("views/Signup_Application.html", {root:__dirname});
		
	}
	else{
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
	"'" + req.body[proparray[1]] + "'," +
	"'" + req.body[proparray[2]] + "'," +
	"'" + req.body[proparray[3]] + "',"+
	"'" + req.body[proparray[4]] + "'," +
	"'" + req.body[proparray[5]] + "'," + 
	"'" + req.body[proparray[6]] + "'," +
	"'" + req.body[proparray[7]] + "'," +
	"'" + req.body[proparray[8]] + "'," + 
	"'" + req.body[proparray[9]] + "'," + 
	"'" + req.body[proparray[10]] + "'," +
	"'" + req.body[proparray[11]] + "'," + 
	"'" + req.body[proparray[12]] + "'," + 
	"'" + req.body[proparray[13]] + "'," +
	"'" + req.body[proparray[14]] + "'," + 
	"'" + req.body[proparray[15]] + "'," +
	"'" + req.body[proparray[16]] + "'," + 
	"'" + req.body[proparray[17]] + "'," + 
	"'" + req.body[proparray[18]] + "'," + 
	"'" + req.body[proparray[19]] + "'," + 
	"'" + req.body[proparray[20]] + "'," +
	"'" + req.body[proparray[21]] + "'," +
	"'" + req.body[proparray[22]] + "'," +
	"'" + req.body[proparray[23]] + "'," +
	"'" + req.body[proparray[24]] + "'," +
	"'" + req.body[proparray[25]] + "'," +
	"'" + req.body[proparray[26]] + "'," +
	"'" + req.body[proparray[27]] + "'," + 
	"'" + req.body[proparray[28]] + "'," + 
	"'" + req.body[proparray[29]] + "'," + 
	"'" + req.body[proparray[30]] + "'," +
	"'" + req.body[proparray[31]] + "'," +
	"'" + req.body[proparray[32]] + "'," + 
	"'" + req.body[proparray[33]] + "'," + 
	"'" + req.body[proparray[34]] + "'," +
	"'" + req.body[proparray[35]] + "'," +
	"'" + req.body[proparray[36]] + "'," + 
	"'" + req.body[proparray[37]] + "'," +
	"'" + req.body[proparray[38]] + "'," +
	"'" + req.body[proparray[39]] + "'," + 
	"'" + req.body[proparray[40]] + "'," +
	"'" + req.body[proparray[41]] + "'," +
	"'" + req.body[proparray[42]] + "'," +
	"'" + req.body[proparray[43]] + 
	"')" 

	console.log(info);
	pool.getConnection(function(err, connection) {
  	// Use the connection
  		connection.query(info, function(err, rows) {
    // And done with the connection.
    	connection.release();
    // Don't use the connection here, it has been returned to the pool.
  });
});
	
	res.sendFile("views/affiliateLinks.html", {root: __dirname});

}
});

http.listen(3000,'127.0.0.1', function(){
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

