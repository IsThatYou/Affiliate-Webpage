module.exports = function(app, passport) {
	
	app.get('/login', function(req, res, err){
		res.render('affiliateLogin.ejs', { message: req.flash('loginMessage') });
	});

	// ABOUT Main Page
	app.get('/about', function(req, res, err){
		if (req.user == "signing up"){
			res.render('MainPageAbout.ejs', {message: null});
		} else {
			res.render('MainPageAbout.ejs', {message: req.user});
		}
	});
	// CONTACT Main Page
	app.get('/contact', function(req, res, err){
		if (req.user == "signing up"){
			res.render('MainPageContact.ejs', {message: null});
		} else {
			res.render('MainPageContact.ejs', {message: req.user});
		}
	});
	// ADVERTISER Main Page
	app.get('/advertiser', function(req, res, err){
		if (req.user == "signing up"){
			res.render('MainPageAdvertiser.ejs', {message: null});
		} else {
			res.render('MainPageAdvertiser.ejs', {message: req.user});
		}

	});
	// AFFILIATE Main Page
	app.get('/affiliate', function(req, res, err){
		if (req.user == "signing up"){
			res.render('MainPageAffiliate.ejs', {message: null});
		} else {
			res.render('MainPageAffiliate.ejs', {message: req.user});
		}

	});
	// MAIN PAGE
	app.get('/', function(req, res, err){
		console.log(req.user);
		console.log(req.session);
		if (req.user == "signing up"){
			res.render('MainPage.ejs', {message: null});
		} else {
			res.render('MainPage.ejs', {message: req.user});
		}
	});
	// THANK YOU PAGE
	app.get('/thankyou', function(req, res, err){
		res.render('thankYou.ejs', {message: req.flash('thankyouMessage')});
	});



	app.post('/login', passport.authenticate('local-login', {
		successRedirect: '/myoffers',
		failureRedirect: '/login',
		failureFlash: true
	}));



	////  Advertiser Login
	app.get('/login_ad', function(req, res, err){
		res.render('advertiserLogin.ejs', { message: req.flash('login_ad_Message') });
	});



	app.post('/login_ad', passport.authenticate('local-login-ad', {
		successRedirect: '/profile_ad',
		failureRedirect: '/login_ad',
		failureFlash: true
	}));





	////  Affiliate Signup
	app.get('/signup', function(req, res, err){
		res.render('Signup_Application2.ejs', { message: req.flash('signupMessage') });
	});


	   
	app.post('/signup', passport.authenticate('local-signup', {
			successRedirect : '/thankyou', // redirect to the secure profile section
			failureRedirect : '/signup', // redirect back to the signup page if there is an error
			failureFlash : true // allow flash messages
	}));



	//// Advertiser Signup
	app.get('/signup_ad', function(req, res, err){
		res.render('advertiserSignup.ejs', { message: req.flash('signup_ad_Message') });
	});



	app.post('/signup_ad', passport.authenticate('local-signup-ad', {
			successRedirect : '/thankyou', // redirect to the secure profile section
			failureRedirect : '/signup_ad', // redirect back to the signup page if there is an error
			failureFlash : true // allow flash messages
	}));
	
	app.post('/admin', passport.authenticate('local-login-admin', {
		successRedirect : '/admin/Create_Campaign', // redirect to the secure profile section
		failureRedirect : '/admin', // redirect back to the signup page if there is an error
		failureFlash : true // allow flash messages
	}));
	app.get('/logout', function(req, res) {
		req.logout();
		res.redirect('/');
	});
}