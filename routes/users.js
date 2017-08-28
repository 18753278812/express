var express = require('express');
var router = express.Router();
var fs = require('fs');
var multiparty = require('multiparty');
var util = require('util');
var mongodb = require('./mongodb');
/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});


router.all('/resiger', function(req, res, next) {
	var obj = {username: req.body['username'],password: req.body['password']};
	mongodb.resiger(obj, req, res);
});

router.all('/login', function(req, res, next) {
	var obj = {username: req.body['username'],password: req.body['password']};
	mongodb.login(obj, req, res);
})

router.all('/list', function(req, res, next) {
	var obj = {
		page: req.query.pageNo,
		pageSize: 10,
		totalPage: 0,
		count: 0
	}
	mongodb.list(obj, req, res);
})

router.post('/publish', function(req, res, next) {
	var form = new multiparty.Form({uploadDir: './public/images'});
	form.parse(req,function(err,fields,files) {
		var filesTmp = JSON.stringify(files,null,2);
		if(err) {
			console.log(err);
		}else{
			//图片路径真实名称
			var uploadpath = files.imgfile[0].path;
			var dstpath = './public/images/' + files.imgfile[0].originalFilename;
			var path = new Buffer(dstpath.substring(8)).toString('base64');
			fs.rename(uploadpath, dstpath, function(err) {
	         	if(err){
	           		console.log(err);
	         	} else {
	           		console.log('重命名');
	          	}
	        });
			var obj = {type: fields.style,price: fields.price,form: req.session.username,imgfile: path};
			mongodb.product(obj,req,res);
		}
	})
	
})
module.exports = router;
