var express = require('express');
var router = express.Router();
var url = require("url");
var path = require("path");
var fs = require("fs");
var tmdata = require('../node_modules/tm/tmdataexchange.js')
	var ddauth = require('../ddapi/auth.js')
	var ddsign = require('../util/sign');

router.get('/', function (req, res, next) {
	var params = {
		nonceStr : 'abcdefg',
		timeStamp : new Date().getTime(),
		url : 'http://192.168.30.52:3000'
	};
	console.log(params);
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
router.get('/leavebalance', function (req, res, next) {
	tmdata.getleavebalance(req.session.user, null, function (result) {
		console.log(JSON.parse(result).gridData);
		res.render('leavebalance', {
			data : JSON.parse(result).gridData
		});
	})
});
router.get('/add/:typeid', function (req, res, next) {
	console.log(req.params.typeid);
	if (req.params.typeid == 1)
		res.render('addvacation', {});
	else if (req.params.typeid == 2)
		res.render('addOT', {});

	/* tmdata.getleavebalance(req.session.user, null, function (result) {
	console.log(JSON.parse(result).gridData);
	}) */
});
router.get('/rlist', function (req, res, next) {
	res.render('rlist', {});
});
/**

router.get('/mysql', function(req, res, next) {
var t1=JSON.stringify(mysql1.q1());
res.render('index', { title: t1 });
});*/
module.exports = router;
