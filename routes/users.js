var express = require('express');
//var esession = require('express-session');
var router = express.Router();
var login = require('../node_modules/tm/login.js');
const util = require('util');
var httpUtil = require('../util/http');
var tm = require('../node_modules/tm/tmdataexchange.js');
var dduser = require('../ddapi/DDuser.js');

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
router.get('/ssoauth', function (req, res, next) {
	dduser.getuserdetails(accessToken, req.query.code, {
		success : function (userinfo) {
			tm.SSOlogin(userinfo.mobile, {
				success : function (data) {
					req.session.user = data.quser;
					res.send({'result':data.success});
				},
				error : function (data) {
					console.log('TM SSO 验证失败');
					res.send({
						'result' : false
					});
				}
			});
		},
		error(data) {'SSOAUTH failed!!!'}

	})

})

module.exports = router;
