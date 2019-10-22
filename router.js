/*
* @Author: Cheng QQ:446804118
* @Date:   2019-10-21 10:09:24
* @Last Modified by:   Cheng QQ:446804118
* @Last Modified time: 2019-10-21 18:24:53
*/
var express=require('express');
var User=require('./models/user');
var md5 = require('md5');

var router=express.Router();

router.get('/',function(req,res){
	console.log(req.session.user);
	res.render('index.html',{user:req.session.user});
})

router.get('/login',function(req,res){
	res.render('login.html');
})

router.get('/register',function(req,res){
	res.render('register.html');
})

router.get('/logout',function(req,res){
	req.session.user=null;
	res.redirect('/login');
})

router.post('/login',function(req,res){
	/*
	1.接受数据
	2.判断用户名和邮箱是否正确
	3.存储session
	*/
	var body=req.body;
	body.password = md5(body.password);
	console.log(body);
	User.findOne({email: body.email,password: body.password},function(err,user){
		if(err){
			return res.status(500).json({
				err_code:500,
				msg:'Sever 500'
			})
		}
		if(!user){
			return res.status(200).json({
				err_code:0,
				msg:'邮箱或昵称错误'
			})
		}
		req.session.user=user;
		return res.status(200).json({
			err_code:1,
			msg:'ok'					
		})
	})
})

router.post('/register',function(req,res){
	/*
	1.接受数据
	2.判断用户名和邮箱是否重复
	3.添加用户
	*/
	var body=req.body;
	body.password = md5(body.password);	
	User.findOne({
		$or:[{email: body.email},{nickname: body.nickname}]
	},function(err,data){
		if(err){
			return res.status(500).json({
				err_code:500,
				msg:'Sever 500'
			})
		}
		if(data){
			return res.status(200).json({
				err_code:0,
				msg:'邮箱或昵称已经存在'
			})
		}
		new User(body).save(function(err,user){
			if(err){
				return res.status(500).json({
					err_code:500,
					msg:'Sever 500'
				})
			}
			if(user){
				// 用户信息写入session;
				req.session.user=user;
				return res.status(200).json({
					err_code:1,
					msg:'ok'					
				})
			}
		})
	})
})

module.exports=router;