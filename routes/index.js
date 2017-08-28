var express = require('express');
var router = express.Router();
var mongodb = require('./mongodb');
/* GET home page. */
router.get('/', function(req, res, next) {
  	var val = req.query.pageNo ? req.query.pageNo : 1;
  	var obj = {
		page: val,
		pageSize: 10,
		totalPage: 0,
		count: 0
	}
  	mongodb.list(obj, req, res);
});
router.get('/login',function(req, res, next) {
	var arr = decodeURIComponent(new Buffer(req.query.arr,'base64').toString());
	res.render('index', {title: '登录',type: '/users/login',uname: req.session.username,pageNo: req.query.pageNo,totalPage: req.query.totalPage,count: req.query.count,arr: arr});
});
router.get('/resiger',function(req, res, next) {
	var arr = decodeURIComponent(new Buffer(req.query.arr,'base64').toString());
	res.render('index', {title: '注册',type: '/users/resiger',uname: req.session.username,pageNo: req.query.pageNo,totalPage: req.query.totalPage,count: req.query.count,arr: arr});
});
router.get('/logout',function(req, res, next) {
	req.session.username = null;
	res.redirect('/');
});
router.get('/detail',function(req, res, next) {
	var str = {"uid": parseInt(req.query.uid)};
	mongodb.detail(str, req, res);
});
router.post('/addtxt',function(req, res, next) {
	var str = {"uid": parseInt(req.body['uid']),username: req.session.username,txt:req.body['txt']};
	console.log(str);
	mongodb.addtxt(str, req, res);
})
module.exports = router;
