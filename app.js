/*
* @Author: Cheng QQ:446804118
* @Date:   2019-10-21 09:03:06
* @Last Modified by:   Cheng QQ:446804118
* @Last Modified time: 2019-10-21 18:02:37
*/
var express=require('express');
var path=require('path');
var router=require('./router');
var bodyParser=require('body-parser');
var session = require('express-session');


var app=express();

// 开放静态文件目录
app.use('/public/',express.static(path.join(__dirname,'./public/')));
app.use('/node_modules/',express.static(path.join(__dirname,'./node_modules')));
app.set('views',path.join(__dirname,'./views/'));

//配置模板引擎
app.engine('html', require('express-art-template'));

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json())

// 配置session
app.use(session({
    secret: 'film',
    resave: true,
    saveUninitialized: true,
    cookie: {
        maxAge: 1000 * 60 * 30, // harlf of hour
    }
}))

// 使用路由
app.use(router);

app.listen(4000,function(){
	console.log('run....');
})