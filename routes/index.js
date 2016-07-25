var express = require('express');
var router = express.Router();
var url = require("url");
var path = require("path");
var fs = require("fs");
var tmdata = require('../node_modules/tm/tmdataexchange.js')
	var ddauth = require('../ddapi/auth.js')
	var ddsign = require('../util/sign');
//DD免登请求
router.get('/', function (req, res, next) {
	var params = {
		nonceStr : 'abcdefg',
		timeStamp : new Date().getTime(),
		url : req.protocol+'://'+req.headers.host+req.originalUrl
	};
	console.log(req.headers.referer);
	ddsign.getSign(params, {
		success : function (data) {
			obj={agentId:30600085,corpId:'ding28029cf6368a0723',timeStamp:params.timeStamp,nonceStr:params.nonceStr,signature:data};
			res.render('ddlogin',{message:JSON.stringify(obj)});
		},
		error : function (err) {
			res.send(err);
		}
	});

});
//返回增加记录页面
router.get('/add/:typeid', function (req, res, next) {
	if (req.session.user === undefined)
		res.redirect(req.protocol+'://'+req.headers.host);
	console.log(req.params.typeid);
	if (req.params.typeid == 1)
		res.render('addvacation', {});
	else if (req.params.typeid == 2)
		res.render('addOT', {});
});
router.get('/rlist', function (req, res, next) {
	res.render('rlist', {});
});

module.exports = router;
