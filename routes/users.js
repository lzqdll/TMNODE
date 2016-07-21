var express = require('express');
//var esession = require('express-session');
var router = express.Router();
var login = require('../node_modules/tm/login.js')
	const util = require('util');
var httpUtil = require('../util/http');

/* GET users listing. */
router.get('/', function (req, res, next) {
	console.log(req.session);
	res.send('respond with a resource');
});

//用户提交的用户名密码信息
router.post('/login', function (req, res, next) {
	var tt = req.body;
	//console.log('first SID: '+req.sessionID);
	login.refresh(tt, function (result) {
		var jsonresult = JSON.parse(result);
		if (jsonresult.success) {
			//console.log(jsonresult.quser);
			req.session.user = jsonresult.quser;
			console.log(jsonresult.quser);
			//console.log(req.user);
			res.redirect('/tm/leavebalance?dd_nav_bgcolor=FF5E97F6');
		} else
			res.send(result);
	});
});
//DD提交的用户免登授权CODE
router.get('/getuser', function (req, res, next) {
	var path = '/user/getuserinfo?access_token='+accessToken+'&code=' + req.query.code;
	httpUtil.get(path, {
		success : function (data) {
			console.log('getuse :'+global.accessToken);
			//res.redirect('/leavebalance?dd_nav_bgcolor=FF5E97F6');
			req.session.userid=data.userid;
			console.log(req.session);
			res.send(data)
		},
		error : function (data) {res.send(data)}
	})
});

module.exports = router;
