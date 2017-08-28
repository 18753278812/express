var mongodb = require('mongodb');
var MongoClient = mongodb.MongoClient;
var async = require('async');
var session = require('express-session');
var DB_CONN_STR = 'mongodb://localhost:27017/work';
//注册
function addData(obj,req,res,db) {
	var conn = db.collection('user');
	var data = [{username: obj.username,password: obj.password}];
	conn.find({username: obj.username}).toArray(function(err,results) {
		if(results.length == 0){
			conn.insert(data, function(err, results){
				if (err) {
					console.log(err);
				} else {
					console.log('注册成功~');
				}
				db.close();
				res.redirect('/');
			})
		} else {
			console.log('注册失败~');
			db.close();
			res.send(false);
		}
	})
}
//登录
function findData(obj,req,res,db) {
	var conn = db.collection('user');
	var data = {username: obj.username,password: obj.password};
	conn.find(data).toArray(function(err, results){
		if(results.length == 1){
			req.session.username = obj.username;
			console.log('登陆成功');
			db.close();
			res.redirect('/');
		}else{
			console.log('登录失败');
			db.close();
		}
	})
}
//商品列表
function list(obj,req,res,db) {
	var conn = db.collection('list');
	async.series([
		function(callback) {
			conn.find({}).toArray(function(err, results){
				obj.count = results.length;
				obj.totalPage = Math.ceil(obj.count/obj.pageSize);
				obj.page = obj.page > obj.totalPage ? obj.totalPage : obj.page;
				obj.page = obj.page < 1 ? 1 : obj.page;

				callback(null,obj.page);
			})
		},
		function(callback){
			conn.find({}).sort({uid: -1}).skip((obj.page - 1) * obj.pageSize).limit(obj.pageSize).toArray(function(err,item){
				if (err) {
		            console.log(err);
		        } else {
		            callback(null,item)
		        }
			})
		}
	],function(err, results){
		db.close();
		res.render('index',{title:'',uname:req.session.username,arr: JSON.stringify(results[1]),count: obj.count,totalPage : obj.totalPage,pageNo:obj.page});
	})
}
//添加商品
function product(req,res,db,obj){
	var conn = db.collection('list');
	var ids = db.collection('ids');
	async.waterfall([
		function(callback) {
			ids.findAndModify(
				{name:'list'},
				[['_id','desc']],
				{$inc: {uid:1}},
				function(err, results) {
		            // console.log(results.value.uid);
		            callback(null,results.value.uid);
		        }
			)
		},
		function(uid, callback){
			var data = [{uid:uid, type:obj.type, price:obj.price, form: obj.form, imgfile: obj.imgfile}];
			conn.insert(data, function(err, results){
				callback(null,'');
			})
		}
	],function(err, results) {
		res.redirect('/');
		db.close();
	})
}
//商品详情页
function detail(req, res, db, str){
	var txt = db.collection('context');
	var conn = db.collection('list');
	async.waterfall([
		function(callback){
			conn.find(str).toArray(function(err, results) {
				var obj = {"uid" : results[0].uid,"type" : results[0].type,"form": results[0].form,"imgfile": results[0].imgfile,"price": results[0].price};
				callback(null,obj);
			})
		},
		function(obj, callback) {
			txt.find(str).toArray(function(err, results) {
				obj.context = results;
				obj.uname = req.session.username;
				callback(null,obj);
			})
		}
	],function(err, results) {
		res.render('detail',{obj: results});;
	})
	/*conn2.find(str).toArray(function(err, results){
		console.log(results);
		conn.find(str).toArray(function(err, results){
			console.log(results);
			res.render('detail',{});
		});
	})*/
}
function addtxt(req, res, db, str){
	var txt = db.collection('context');
	txt.insert([str],function(err,results){
		console.log(str);
		res.redirect('/detail?uid=' + parseInt(str.uid));
	})
}
module.exports = {
	resiger: function(obj,req,res){
		MongoClient.connect(DB_CONN_STR, function(err,db) {
			if (err) {
				console.log(err);
			} else {
				console.log('连接成功~');
			}	
			addData(obj,req,res,db);
		})
	},
	login: function(obj,req,res){
		MongoClient.connect(DB_CONN_STR, function(err,db) {
			if (err) {
				console.log(err);
			} else {
				console.log('连接成功~');
			}	
			findData(obj,req,res,db);
		});
	},
	list: function(obj,req,res){
		MongoClient.connect(DB_CONN_STR, function(err,db) {
			if (err) {
				console.log(err);
			} else {
				console.log('连接成功~');
			}	
			list(obj,req,res,db);
		});
	},
	product: function(obj,req,res){
		MongoClient.connect(DB_CONN_STR, function(err,db) {
			if (err) {
				console.log(err);
			} else {
				console.log('连接成功~');
			}	
			product(req,res,db,obj);
		});
	},
	detail: function(str, req, res){
		MongoClient.connect(DB_CONN_STR, function(err,db) {
			if (err) {
				console.log(err);
			} else {
				console.log('连接成功~');
			}	
			detail(req,res,db,str);
		});
	},
	addtxt: function(str, req, res){
		MongoClient.connect(DB_CONN_STR, function(err,db) {
			if (err) {
				console.log(err);
			} else {
				console.log('连接成功~');
			}	
			addtxt(req,res,db,str);
		});
	}
}