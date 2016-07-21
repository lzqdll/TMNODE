var express = require('express');
var router = express.Router();
var url = require("url");
var tm = require('../node_modules/tm/tmdataexchange.js')
	//var mysql1=require('../mysql.js')
	/* GET home page. */
	
//直接登陆TM返回登陆页面
	router.get('/', function (req, res, next) {
		res.render('login', {
			title : url.parse(req.url).pathname
		});
	});
	//返回首页数据
router.get('/leavebalance', function (req, res, next) {
	tm.getleavebalance(req.session.user, null, function (result) {
		console.log(JSON.parse(result).gridData);
		res.render('leavebalance', {
			data : JSON.parse(result).gridData
		});
	})
});
//处理增加记录请求
router.post('/vacationadding', function (req, res, next) {
	console.log(req.body);
	tm.vacationAdding(req.session.user, null, function (result) {
		console.log(JSON.parse(result).gridData);
		res.send("JSON.parse(result).gridData");
	})
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
