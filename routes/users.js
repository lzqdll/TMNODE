var express = require('express');
//var esession = require('express-session');
var router = express.Router();
var login = require('../node_modules/tm/login.js')
	const util = require('util');

/* GET users listing. */
router.get('/', function (req, res, next) {
	res.send('respond with a resource');
});
router.post('/login', function (req, res, next) {
	var tt = req.body;
	//console.log('first SID: '+req.sessionID);
	login.refresh(tt, function (result) {
		var jsonresult=JSON.parse(result);
		if (jsonresult.success) {
			//console.log(jsonresult.quser);
			req.session.user=jsonresult.quser;
			console.log(jsonresult.quser);
			//console.log(req.user);
			res.redirect('/leavebalance?dd_nav_bgcolor=FF5E97F6');
		} else
			res.send(result);
	});
});

module.exports = router;
