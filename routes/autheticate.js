var express = require('express');
var router = express.Router();
var Sequelize = require("sequelize");
passport = require('passport');
var connect = require("../config/config");
var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
var https = require('https');
var path = require('path')
var moment = require('moment')
var bcrypt = require('bcryptjs');
var emc = require('./emc')
var jwts = require('express-jwt');

var auth = jwts({secret: 'IYAELEWA', userProperty: 'payload'});

function replacetext(str)
{
	str = str.replace(/[^a-zA-Z0-9]/g,'_');
	str = str.replace(/[^a-zA-Z0-9]/g,'_').replace(/__/g,'_');
	str = str.replace(/((http|https|ftp):\/\/[\w?=&.\/-;#~%-]+(?![\w\s?&.\/;#~%"=-]*>))/g,'_').replace(/__/g,'_');
	return str
}

router.post('/signup', async function(req, res, next) {
	//console.log(req.body);
	var firstname = req.body.firstname
	var lastname = req.body.lastname
	var email = req.body.email
	email = email.toLowerCase()
	email = email.trim()
	var username = firstname.toLowerCase() +' '+lastname.toLowerCase()
	username = replacetext(username)
	var phone = req.body.phone
	var password = bcrypt.hashSync(req.body.password, 8);
	var timeStamp = moment().add(1, 'month')
	//console.log(username)
	var count = await connect.User.count({where: {login_id:email}})
	//console.log(count)
	if (count != 0) {
		res.send({ status: 'error', msg: 'Your Login id already exist!' })
	}
	else {
		var count = await connect.User.count({ where: { username: { $iLike: username + '%' } } })
		if (count == 0) {
			username = username
		}
		else {
			username = username + '0' + count
		}
		var codes = emc.encrypt(req.body.school);
		var acct = {email: req.body.school_email, name: req.body.school.toUpperCase(), phone: req.body.phone,	
		address: '', expire: timeStamp, status: 'ACTIVE', logo:' /images/user.jpg', city:'', state:'', country:'Nigeria', website:'', token:codes}
		console.log(acct)
		var account = await connect.School.create(acct)
		var req = {username: username, token: password, position: 'Owner', email:email,	firstname: firstname, lastname:lastname, phone: phone, login_id:email, 
		address:'', image:'https://alxproject.virilesoftware.com/images/user.jpg', disable:0, school_id:account.dataValues.id, status:'Active'}
		//console.log(req)
		var users = await connect.User.create(req)
		var today = new Date();
		var exp = new Date(today);
		exp.setDate(today.getDate() + 60);
		var tokens = jwt.sign({	_id: emc.encrypt('' + users.dataValues.id), username: users.dataValues.username, name: users.dataValues.firstname+' '+users.dataValues.lastname,
		exp: parseInt(exp.getTime() / 1000), position: users.dataValues.position, school: emc.encrypt('' +users.dataValues.school_id), school_name:account.dataValues.name}, 'IYAELEWA');
		res.send({ status: 'ok', token: tokens })
		
	}
	
})


router.post('/login', async function (req, res, next) {
	console.log(req.body)
	var email = req.body.username
	email = email.toLowerCase()
	email = email.trim()
	var user = await connect.User.findOne({where: {login_id: {$iLike: email}}})
	if (!user) {
		var student = await connect.StudentLogin.findOne({where: {login_id: {$iLike: email}}})
		if(!student){
			res.send({status: 'error',msg: 'Login ID do not exit'});
		}
		else{
			var hash = student.password;
			var pp = emc.decrypt(hash)
			console.log(pp)
			if (req.body.password == pp) {
				var sch = await connect.School.findOne({where: {id: student.school_id}})
				var pro = await connect.Student.findOne({where: {id: student.student_id}})
				var today = new Date();
				var exp = new Date(today);
				exp.setDate(today.getDate() + 60);
				var tokens = jwt.sign({
					_id: emc.encrypt('' + pro.id),
					username: 'student_'+pro.username,
					name: pro.surname+' '+pro.firstname,
					exp: parseInt(exp.getTime() / 1000),
					school: emc.encrypt('' +student.school_id), school_name:sch.name
				}, 'IYAELEWA');
				console.log(tokens);
				return res.json({status: 'ok',token: tokens});
			}
			else{
				res.send({status: 'error', msg: 'Invalid login or Wrong password!.'});
			}

		}
		
	} else {
		var hash = user.token;
		if (bcrypt.compareSync(req.body.password, hash)) {
			var sch = await connect.School.findOne({where: {id: user.school_id}})
			var today = new Date();
			var exp = new Date(today);
			exp.setDate(today.getDate() + 60);
			var tokens = jwt.sign({
				_id: emc.encrypt('' + user.id),
				username: user.username,
				name: user.dataValues.firstname+' '+user.dataValues.lastname,
				exp: parseInt(exp.getTime() / 1000),
				position: user.position,
				school: emc.encrypt('' +user.dataValues.school_id), school_name:sch.name
			}, 'IYAELEWA');
			//console.log(tokens);
			return res.json({status: 'ok',token: tokens});
		}
		else{
			res.send({status: 'error', msg: 'Invalid login or Wrong password!.'});
		}
	}
})

router.post('/logins', function (req, res, next) {
	console.log(req.body.username);
	var email = req.body.username
	email = email.toLowerCase()
	email = email.trim()
	console.log('shola')
	connect.User.findOne({
		where: {
			login_id: {
				$iLike: email
			}
		}
	}).then(function (user) {
		console.log(user)
		if (!user) {
			res.send({
				status: 'error',
				msg: 'Email address do not exit'
			});
		} else {

			var hash = user.token;
			if (bcrypt.compareSync(req.body.password, hash)) {
				if (user.status == 'Block') {
					res.send({
						status: 'error',
						msg: 'Your account is block, please contact management to enable it'
					});
				} else if (user.status == 'Deleted') {
					console.log('deleted')
					res.send({
						status: 'error',
						msg: 'User not found!'
					});
				} else {

					var today = new Date();
					var exp = new Date(today);
					exp.setDate(today.getDate() + 60);
					var tokens = jwt.sign({
						_id: emc.encrypt('' + user.id),
						username: user.username,
						name: user.name,
						exp: parseInt(exp.getTime() / 1000),
						position: user.position,
						zone: emc.encrypt('' + user.zone_id)
					}, 'IYAELEWA');
					console.log(tokens);
					
					return res.json({
						status: 'ok',
						token: tokens,
						
					});
				}

			} else {
				res.send({
					status: 'error',
					msg: 'Invalid username or Wrong password!.'
				});
			}

		}

	})

});


router.post('/logout', auth, function(req, res, next) {
	console.log(req)
	var author = req.payload._id;
	connect.Usertoken.findOne({ where:{user_id:author, browser:req.body.browsers}}).then(function(fcm){
		console.log(fcm)
		if(!fcm)
		{
			res.send({status:'ok'})
		}
		else
		{
			connect.Usertoken.destroy({ where:{user_id:author, browser:req.body.browers}}).then(function(fcm){
				res.send({status:'ok'})
			}).catch(function(){
			res.send({status:'ok', msg:'Error pleace try again'})
			})
		}
	})
	
})
router.post('/updatetoken/:username', auth, function(req, res, next) {
	console.log(req.payload)
	console.log(req.body)
	var author = req.payload.username;
	if(author == req.params.username)
	{
		var user = req.payload._id;
		connect.Usertoken.findOne({where:{user_id:req.payload._id}}).then(function(fcm){
			if(!fcm)
			{
				connect.Usertoken.create({token: req.body.token, browser:req.body.browsers,user_id:user}).then(function(fcm){
				res.send({status:'ok'})
			}).catch(function(){
				res.send({status:'error', msg:'Error pleace try again'})
			})
			}
			else
			{
		connect.Usertoken.update({token: req.body.token, browser:req.body.browsers,user_id:user}, {where:{user_id:req.payload._id}}).then(function(fcm){
			res.send({status:'ok'})
		}).catch(function(){
			res.send({status:'error', msg:'Error pleace try again'})
		})
			}
		})
			
		
	}
})


module.exports = router;
