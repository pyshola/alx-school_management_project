var express = require('express');
var router = express.Router();
var jwts = require('express-jwt');
var Sequelize = require("sequelize");
var passport = require('passport');
var connect = require("../config/config");
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
var async = require("async");
var http = require('http');
var https = require('https')
var moment = require('moment')
var math = require('mathjs')
var emc = require('./emc')

router.param('username', async function(req, res, next, id) {
	//consfclassdetaiole.log(req)
	var users = await connect.User.findOne({where: {username: {$iLike:id}}})
	if(!users)
	{
		var std = id
		std = std.split("_")
		if(std[0] == 'student'){
			console.log(std)
			var rem = []
			for(var i = 1; i < std.length; i++){
				rem.push(std[i])
			}
			var student = rem.join("_")
			var pro = await connect.Student.findOne({where: {username: student}})
			if(!pro){
				req.info = {status:'error'};
				return next();
			}
			else{
				var acct = await connect.School.findOne({where: {id: pro.school_id}})
				req.info = {
					status: 'ok',
					name: pro.firstname,
					school_id: pro.school_id,
					school:acct.name,
					username:pro.username,
					picture:pro.passport,
                    school_picture:acct.logo,
					phone:acct.phone,
					website:acct.website,
					category:'student',
					position:'student',
					school_name:acct.name,
					ref_id:pro.id,
				};
				req.user_id = pro.id;
					//}
				return next();
			}
			console.log(student)
		}
		else{
			
			req.info = {status:'error'};
			return next();
		}
		
	}
	else
	{
		if (users.status == 'Block') {
			req.info = { status: 'error' };
		}
		else if (users.status == 'Deleted') {
			req.info = { status: 'error' };
		}
		else if (users.status == 'Disable') {
			req.info = { status: 'error' };
		}
		else {
			connect.School.findOne({where: {id: users.school_id}}).then(function (acct) {
				var timestamp = moment()
				dif = new Date(acct.expire)
				var dayw = moment(dif)
				var exps = dayw.diff(timestamp, 'days')
					//console.log(exps)
					/*if (exps < -30) {
						req.info = {
							status: 'expire'
						};
					} else {*/
				req.info = {
					status: 'ok',
					name: users.firstname,
					position: users.position,
					school_id: users.school_id,
					school:acct.name,
					username:users.username,
					picture:users.image,
                    school_picture:acct.logo,
					phone:acct.phone,
					website:acct.website,
					category:'admin',
					school_name:acct.name
				};
				req.user_id = users.id;
					//}
				return next();


			})
		}		
			
	}
	
});


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('home', { title: 'Express' });
});
router.get('/eportal', function(req, res, next) {
  res.render('home', { title: 'Express' });
});
router.get('/eportal/login', function(req, res, next) {
  res.render('login', { title: '' });
});
router.get('/eportal/signup', function(req, res, next) {
  res.render('signup', { title: '' });
});

router.get('/eportal/:username', async function(req, res, next) {
	console.log(req.info)
	if(req.info.status == 'error')
	{
		res.render('notfound', { title: '' });
	}
	else
	{
		
		if(req.info.position == 'Teacher')
		{
			var session = await emc.getpreviousacademicsession(req.info.school_id)
			if(session == {}){
				res.render('notfound', { title: '' });
			}
			else{
				var teacher = await connect.ClassTeacher.findOne({where: {school_id:req.info.school_id,session_id:session.session_id, 
					teacher_id:req.user_id}}); 
				if(!teacher){
					var subject_teacher = await connect.SubjectTeacher.findOne({where: {school_id:req.info.school_id,session_id:session.session_id, 
						teacher_id:req.user_id}});
					if(!subject_teacher){
						res.render('teacher/index', {
							title: req.info.school,
							name: req.info.name,
							position: req.info.position,
							picture: req.info.picture,
							school_picture: req.info.school_picture,
							username: req.info.username,
							school:req.info.school
						});
					}
					else{
						res.render('teacher/subjectindex', {
							title: req.info.school,
							name: req.info.name,
							position: req.info.position,
							picture: req.info.picture,
							school_picture: req.info.school_picture,
							username: req.info.username,
							school:req.info.school
						});

					}
				}
				else{
					res.render('teacher/teacherindex', {
						title: req.info.school,
						name: req.info.name,
						position: req.info.position,
						picture: req.info.picture,
						school_picture: req.info.school_picture,
						username: req.info.username,
						school:req.info.school
					});
				}
				
			
			}
		}
		else if(req.info.position == 'student'){
			res.render('studentpage', {
				title: req.info.school,
				name: req.info.name,
				position: req.info.position,
				picture: req.info.picture,
				school_picture: req.info.school_picture,
				username: req.info.username,
				school:req.info.school,
				ref_id:req.info.ref_id
			});
		}
		else if(req.info.position == 'Owner'){
			res.render('index', {
				title: req.info.school,
				name: req.info.name,
				position: req.info.position,
				picture: req.info.picture,
				school_picture: req.info.school_picture,
				username: req.info.username,
				school:req.info.school
			});
		}
		else{
			res.render('index_staff', {
				title: req.info.school,
				name: req.info.name,
				position: req.info.position,
				picture: req.info.picture,
				school_picture: req.info.school_picture,
				username: req.info.username,
				school:req.info.school
			});
		}
	}
});

router.get('/eportal/:username/admin', async function(req, res, next) {
	//console.log(req.info)
	if(req.info.status == 'error')
	{
		res.render('notfound', { title: '' });
	}
	else
	{
		
		if(req.info.position == 'Owner')
		{
			res.render('admin', {
				title: req.info.school,
				name: req.info.name,
				position: req.info.position,
				picture: req.info.picture,
				school_picture: req.info.school_picture,
				username: req.info.username,
				school:req.info.school
			});
		}
		else{
			res.render('unauthorized', { title: '' });
		}
	}
	
});

router.get('/eportal/:username/staffrole/:ref_id', async function (req, res, next) {
	if(req.info.status == 'error')
	{
		res.render('notfound', { title: '' });
	}
	
	else
	{
		if(req.info.position == 'Owner'){
		res.render('staffrole', {
			title: req.info.school,
			name: req.info.name,
			position: req.info.position,
			picture: req.info.picture,
            school_picture: req.info.school_picture,
			username: req.info.username,
			school:req.info.school,
			ref_id:req.params.ref_id
		});
				
		}
		else{
			res.render('unauthorized', { title: '' });
				
		}
			
	
	}

})

router.get('/eportal/:username/schoolclass', async function(req, res, next) {
	//console.log(req.info)
	if(req.info.status == 'error')
	{
		res.render('notfound', { title: '' });
	}
	
	else
	{
		var roles = await emc.getuseraccess('View School Class', req.user_id, req.info.school_id)
		if(!roles){
			res.render('unauthorized', { title: '' });
		}
		else{
			res.render('schoolclass', {
				title: req.info.school,
				name: req.info.name,
				position: req.info.position,
				picture: req.info.picture,
				school_picture: req.info.school_picture,
				username: req.info.username,
				school:req.info.school
			});
		}
	}
});


router.get('/eportal/:username/classarm', async function(req, res, next) {
	//console.log(req.info)
	if(req.info.status == 'error')
	{
		res.render('notfound', { title: '' });
	}
	
	else
	{
		var roles = await emc.getuseraccess('View Class Arms', req.user_id, req.info.school_id)
		if(!roles){
			res.render('unauthorized', { title: '' });
		}
		else{
			res.render('classarm', {
				title: req.info.school,
				name: req.info.name,
				position: req.info.position,
				picture: req.info.picture,
				school_picture: req.info.school_picture,
				username: req.info.username,
				school:req.info.school
			});
		}
	}
});


router.get('/eportal/:username/subject', async function(req, res, next) {
	//console.log(req.info)
	if(req.info.status == 'error')
	{
		res.render('notfound', { title: '' });
	}
	
	else
	{
		var roles = await emc.getuseraccess('View Subject', req.user_id, req.info.school_id)
		if(!roles){
			res.render('unauthorized', { title: '' });
		}
		else{
			res.render('subject', {
				title: req.info.school,
				name: req.info.name,
				position: req.info.position,
				picture: req.info.picture,
				school_picture: req.info.school_picture,
				username: req.info.username,
				school:req.info.school
			});
		}
	}
});

router.get('/eportal/:username/fees_type', async function(req, res, next) {
	//console.log(req.info)
	if(req.info.status == 'error')
	{
		res.render('notfound', { title: '' });
	}
	
	else
	{
		var roles = await emc.getuseraccess('View Fees Type', req.user_id, req.info.school_id)
		if(!roles){
			res.render('unauthorized', { title: '' });
		}
		else{
			res.render('fees_type', {
				title: req.info.school,
				name: req.info.name,
				position: req.info.position,
				picture: req.info.picture,
				school_picture: req.info.school_picture,
				username: req.info.username,
				school:req.info.school
			});
		}
	}
});

router.get('/eportal/:username/school_account', async function(req, res, next) {
	//console.log(req.info)
	if(req.info.status == 'error')
	{
		res.render('notfound', { title: '' });
	}
	
	else
	{
		var roles = await emc.getuseraccess('View School Account', req.user_id, req.info.school_id)
		if(!roles){
			res.render('unauthorized', { title: '' });
		}
		else{
			res.render('school_account', {
				title: req.info.school,
				name: req.info.name,
				position: req.info.position,
				picture: req.info.picture,
				school_picture: req.info.school_picture,
				username: req.info.username,
				school:req.info.school
			});
		}
	}
});

router.get('/eportal/:username/expenses_type', async function(req, res, next) {
	//console.log(req.info)
	if(req.info.status == 'error')
	{
		res.render('notfound', { title: '' });
	}
	
	else
	{
		var roles = await emc.getuseraccess('View Expenses Type', req.user_id, req.info.school_id)
		if(!roles){
			res.render('unauthorized', { title: '' });
		}
		else{
			res.render('expenses_type', {
				title: req.info.school,
				name: req.info.name,
				position: req.info.position,
				picture: req.info.picture,
				school_picture: req.info.school_picture,
				username: req.info.username,
				school:req.info.school
			});
		}
	}
});

router.get('/eportal/:username/session', async function(req, res, next) {
	//console.log(req.info)
	if(req.info.status == 'error')
	{
		res.render('notfound', { title: '' });
	}
	
	else
	{
		var roles = await emc.getuseraccess('View Academic Session', req.user_id, req.info.school_id)
		if(!roles){
			res.render('unauthorized', { title: '' });
		}
		else{
			res.render('session', {
				title: req.info.school,
				name: req.info.name,
				position: req.info.position,
				picture: req.info.picture,
				school_picture: req.info.school_picture,
				username: req.info.username,
				school:req.info.school
			});
		}
	}
});

router.get('/eportal/:username/editsession/:ref_id', async function(req, res, next) {
	//console.log(req.info)
	if(req.info.status == 'error')
	{
		res.render('notfound', { title: '' });
	}
	
	else
	{
		var roles = await emc.getuseraccess('Edit Academic Session', req.user_id, req.info.school_id)
		if(!roles){
			res.render('unauthorized', { title: '' });
		}
		else{
			res.render('editsession', {
				title: req.info.school,
				name: req.info.name,
				position: req.info.position,
				picture: req.info.picture,
				school_picture: req.info.school_picture,
				username: req.info.username,
				school:req.info.school,
				ref_id:req.params.ref_id
			});
		}
	}
});

router.get('/eportal/:username/fees_registrar', async function(req, res, next) {
	//console.log(req.info)
	if(req.info.status == 'error')
	{
		res.render('notfound', { title: '' });
	}
	
	else
	{
		var roles = await emc.getuseraccess('View Fees', req.user_id, req.info.school_id)
		if(!roles){
			res.render('unauthorized', { title: '' });
		}
		else{
			res.render('fees_registrar', {
				title: req.info.school,
				name: req.info.name,
				position: req.info.position,
				picture: req.info.picture,
				school_picture: req.info.school_picture,
				username: req.info.username,
				school:req.info.school
			});
		}
	}
});


router.get('/eportal/:username/students', async function(req, res, next) {
	//console.log(req.info)
	if(req.info.status == 'error')
	{
		res.render('notfound', { title: '' });
	}
	
	else
	{
		res.render('students', {
				title: req.info.school,
				name: req.info.name,
				position: req.info.position,
				picture: req.info.picture,
				school_picture: req.info.school_picture,
				username: req.info.username,
				school:req.info.school
			});
		
	}
});


router.get('/eportal/:username/addstudent', async function(req, res, next) {
	//console.log(req.info)
	if(req.info.status == 'error')
	{
		res.render('notfound', { title: '' });
	}
	
	else
	{
		var roles = await emc.getuseraccess('Add Student', req.user_id, req.info.school_id)
		if(!roles){
			res.render('unauthorized', { title: '' });
		}
		else{
			res.render('addstudent', {
				title: req.info.school,
				name: req.info.name,
				position: req.info.position,
				picture: req.info.picture,
				school_picture: req.info.school_picture,
				username: req.info.username,
				school:req.info.school
			});
		}
	}
});

router.get('/eportal/:username/studentdetail/:ref_id', async function(req, res, next) {
	//console.log(req.info)
	if(req.info.status == 'error')
	{
		res.render('notfound', { title: '' });
	}
	
	else
	{
		if(req.info.position == 'Teacher'){
			res.render('teacher/studentindex', {
				title: req.info.school,
				name: req.info.name,
				position: req.info.position,
				picture: req.info.picture,
				school_picture: req.info.school_picture,
				username: req.info.username,
				school:req.info.school,
				ref_id:req.params.ref_id
			});
		}
		else{
			res.render('studentdetail', {
				title: req.info.school,
				name: req.info.name,
				position: req.info.position,
				picture: req.info.picture,
				school_picture: req.info.school_picture,
				username: req.info.username,
				school:req.info.school,
				ref_id:req.params.ref_id
			});
		}
		
	}
});

router.get('/eportal/:username/editstudentdetail/:ref_id', async function(req, res, next) {
	//console.log(req.info)
	if(req.info.status == 'error')
	{
		res.render('notfound', { title: '' });
	}
	
	else
	{
		res.render('editstudentdetail', {
				title: req.info.school,
				name: req.info.name,
				position: req.info.position,
				picture: req.info.picture,
				school_picture: req.info.school_picture,
				username: req.info.username,
				school:req.info.school,
				ref_id:req.params.ref_id
			});
		
	}
});


router.get('/eportal/:username/apply_fees', async function(req, res, next) {
	//console.log(req.info)
	if(req.info.status == 'error')
	{
		res.render('notfound', { title: '' });
	}
	
	else
	{
		var roles = await emc.getuseraccess('Add Bill to Student', req.user_id, req.info.school_id)
		if(!roles){
			res.render('unauthorized', { title: '' });
		}
		else{
			res.render('apply_fees', {
				title: req.info.school,
				name: req.info.name,
				position: req.info.position,
				picture: req.info.picture,
				school_picture: req.info.school_picture,
				username: req.info.username,
				school:req.info.school,
				
			});
		}
	}
});

router.get('/eportal/:username/special_offer', async function(req, res, next) {
	//console.log(req.info)
	if(req.info.status == 'error')
	{
		res.render('notfound', { title: '' });
	}
	
	else
	{
		var roles = await emc.getuseraccess('Add Special Offer', req.user_id, req.info.school_id)
		if(!roles){
			res.render('unauthorized', { title: '' });
		}
		else{
			res.render('special_offer', {
				title: req.info.school,
				name: req.info.name,
				position: req.info.position,
				picture: req.info.picture,
				school_picture: req.info.school_picture,
				username: req.info.username,
				school:req.info.school,
				
			});
		}
	}
});

router.get('/eportal/:username/fees_management', async function(req, res, next) {
	console.log(req.info)
	if(req.info.status == 'error')
	{
		res.render('notfound', { title: '' });
	}
	
	else
	{
		var roles = await emc.getuseraccess('View Fees Management', req.user_id, req.info.school_id)
		var special = await emc.getuseraccess('Add Bill to Student', req.user_id, req.info.school_id)
		var bill = await emc.getuseraccess('Add Special Offer', req.user_id, req.info.school_id)
		if(special == true){
			var s = ''
		}
		else{
			var s = 'd-none'
		}
		if(bill == true){
			var b = ''
		}
		else{
			var b = 'd-none'
		}
		if(!roles){
			res.render('unauthorized', { title: '' });
		}
		else{
			res.render('fees_management', {
				title: req.info.school,
				name: req.info.name,
				position: req.info.position,
				picture: req.info.picture,
				school_picture: req.info.school_picture,
				username: req.info.username,
				school:req.info.school,
				special:s,
				bill:b
				
			});
		}
	}
});



router.get('/eportal/:username/studentbill/:ref_id', async function(req, res, next) {
	//console.log(req.info)
	if(req.info.status == 'error')
	{
		res.render('notfound', { title: '' });
	}
	
	else
	{
		var roles = await emc.getuseraccess('View Bill', req.user_id, req.info.school_id)
		var special = await emc.getuseraccess('Enter Student Payment', req.user_id, req.info.school_id)
		var bill = await emc.getuseraccess('Edit Bill', req.user_id, req.info.school_id)
		if(special == true){
			var s = ''
		}
		else{
			var s = 'd-none'
		}
		if(bill == true){
			var b = ''
		}
		else{
			var b = 'd-none'
		}
		if(!roles){
			res.render('unauthorized', { title: '' });
		}
		else{
			res.render('studentbill', {
				title: req.info.school,
				name: req.info.name,
				position: req.info.position,
				picture: req.info.picture,
				school_picture: req.info.school_picture,
				username: req.info.username,
				school:req.info.school,
				ref_id:req.params.ref_id,
				payment:s,
				edit:b
			});
		}
	}
});

router.get('/eportal/:username/editstudentbill/:ref_id', async function(req, res, next) {
	//console.log(req.info)
	if(req.info.status == 'error')
	{
		res.render('notfound', { title: '' });
	}
	
	else
	{
		var roles = await emc.getuseraccess('Edit Bill', req.user_id, req.info.school_id)
		if(!roles){
			res.render('unauthorized', { title: '' });
		}
		else{
			res.render('editstudentbill', {
				title: req.info.school,
				name: req.info.name,
				position: req.info.position,
				picture: req.info.picture,
				school_picture: req.info.school_picture,
				username: req.info.username,
				school:req.info.school,
				ref_id:req.params.ref_id
			});
		}
	}
});


router.get('/eportal/:username/studentbillpayment/:ref_id', async function(req, res, next) {
	//console.log(req.info)
	if(req.info.status == 'error')
	{
		res.render('notfound', { title: '' });
	}
	
	else
	{
		var roles = await emc.getuseraccess('Enter Student Payment', req.user_id, req.info.school_id)
		if(!roles){
			res.render('unauthorized', { title: '' });
		}
		else{
			res.render('studentbillpayment', {
				title: req.info.school,
				name: req.info.name,
				position: req.info.position,
				picture: req.info.picture,
				school_picture: req.info.school_picture,
				username: req.info.username,
				school:req.info.school,
				ref_id:req.params.ref_id
			});
		}
	}
});


router.get('/eportal/:username/studentbillinvoice/:ref_id', async function(req, res, next) {
	//console.log(req.info)
	if(req.info.status == 'error')
	{
		res.render('notfound', { title: '' });
	}
	
	else
	{
		if(req.info.position == 'student'){
			res.render('studentbillreceipt', {
				title: req.info.school,
				name: req.info.name,
				position: req.info.position,
				picture: req.info.picture,
				school_picture: req.info.school_picture,
				username: req.params.username,
				school:req.info.school,
				ref_id:req.params.ref_id,
				phone:req.info.phone
			});
		}
		else{
			res.render('studentbillinvoice', {
				title: req.info.school,
				name: req.info.name,
				position: req.info.position,
				picture: req.info.picture,
				school_picture: req.info.school_picture,
				username: req.info.username,
				school:req.info.school,
				ref_id:req.params.ref_id,
				phone:req.info.phone
			});
		}
	}
});


router.get('/eportal/:username/studentbillinvoicepos/:ref_id', async function(req, res, next) {
	//console.log(req.info)
	if(req.info.status == 'error')
	{
		res.render('notfound', { title: '' });
	}
	
	else
	{
		
		res.render('receipt', {
			title: req.info.school,
			name: req.info.name,
			position: req.info.position,
			picture: req.info.picture,
            school_picture: req.info.school_picture,
			username: req.params.username,
			school:req.info.school,
			ref_id:req.params.ref_id,
			phone:req.info.phone,
			school_name:req.info.school_name
		});
	}
});


router.get('/eportal/:username/payment_history', async function(req, res, next) {
	//console.log(req.info)
	if(req.info.status == 'error')
	{
		res.render('notfound', { title: '' });
	}
	
	else
	{
		var roles = await emc.getuseraccess('Payment History', req.user_id, req.info.school_id)
		if(!roles){
			res.render('unauthorized', { title: '' });
		}
		else{
			res.render('payment_history', {
				title: req.info.school,
				name: req.info.name,
				position: req.info.position,
				picture: req.info.picture,
				school_picture: req.info.school_picture,
				username: req.info.username,
				school:req.info.school
			});
		}
	}
});

router.get('/eportal/:username/fees_reports', async function(req, res, next) {
	//console.log(req.info)
	if(req.info.status == 'error')
	{
		res.render('notfound', { title: '' });
	}
	
	else
	{
		var roles = await emc.getuseraccess('Fees Reports', req.user_id, req.info.school_id)
		if(!roles){
			res.render('unauthorized', { title: '' });
		}
		else{
			res.render('fees_reports', {
				title: req.info.school,
				name: req.info.name,
				position: req.info.position,
				picture: req.info.picture,
				school_picture: req.info.school_picture,
				username: req.info.username,
				school:req.info.school
			});
		}
	}
});

router.get('/eportal/:username/expenses', async function(req, res, next) {
	//console.log(req.info)
	if(req.info.status == 'error')
	{
		res.render('notfound', { title: '' });
	}
	
	else
	{
		var roles = await emc.getuseraccess('View Expenses', req.user_id, req.info.school_id)
		if(!roles){
			res.render('unauthorized', { title: '' });
		}
		else{
			var bill = await emc.getuseraccess('Add Expenses', req.user_id, req.info.school_id)
			if(bill == true){
				var b = ''
			}
			else{
				var b = 'd-none'
			}
			res.render('expenses', {
				title: req.info.school,
				name: req.info.name,
				position: req.info.position,
				picture: req.info.picture,
				school_picture: req.info.school_picture,
				username: req.info.username,
				school:req.info.school,
				add:b
			});
		}
	}
});

router.get('/eportal/:username/other_income', async function(req, res, next) {
	//console.log(req.info)
	if(req.info.status == 'error')
	{
		res.render('notfound', { title: '' });
	}
	
	else
	{
		var roles = await emc.getuseraccess('View Other Income', req.user_id, req.info.school_id)
		if(!roles){
			res.render('unauthorized', { title: '' });
		}
		else{
			var bill = await emc.getuseraccess('Add Other Income', req.user_id, req.info.school_id)
			if(bill == true){
				var b = ''
			}
			else{
				var b = 'd-none'
			}
			res.render('other_income', {
				title: req.info.school,
				name: req.info.name,
				position: req.info.position,
				picture: req.info.picture,
				school_picture: req.info.school_picture,
				username: req.info.username,
				school:req.info.school,
				add:b
			});
		}
	}
});


router.get('/eportal/:username/finance_report', async function(req, res, next) {
	//console.log(req.info)
	if(req.info.status == 'error')
	{
		res.render('notfound', { title: '' });
	}
	
	else
	{
		var roles = await emc.getuseraccess('View Finance Report', req.user_id, req.info.school_id)
		if(!roles){
			res.render('unauthorized', { title: '' });
		}
		else{
			
			res.render('finance_report', {
				title: req.info.school,
				name: req.info.name,
				position: req.info.position,
				picture: req.info.picture,
				school_picture: req.info.school_picture,
				username: req.info.username,
				school:req.info.school,
			});
		}
	}
});


router.get('/eportal/:username/allocate_subject', async function(req, res, next) {
	//console.log(req.info)
	if(req.info.status == 'error')
	{
		res.render('notfound', { title: '' });
	}
	
	else
	{
		var roles = await emc.getuseraccess('Allocate Subject to Student', req.user_id, req.info.school_id)
		if(!roles){
			res.render('unauthorized', { title: '' });
		}
		else{
			
			res.render('allocate_subject', {
				title: req.info.school,
				name: req.info.name,
				position: req.info.position,
				picture: req.info.picture,
				school_picture: req.info.school_picture,
				username: req.info.username,
				school:req.info.school,

			});
		}
	}
});

router.get('/eportal/:username/mark_distribution', async function(req, res, next) {
	//console.log(req.info)
	if(req.info.status == 'error')
	{
		res.render('notfound', { title: '' });
	}
	
	else
	{
		res.render('mark_distribution', {
				title: req.info.school,
				name: req.info.name,
				position: req.info.position,
				picture: req.info.picture,
				school_picture: req.info.school_picture,
				username: req.info.username,
				school:req.info.school,

		});
		
	}
});


router.get('/eportal/:username/reportcard_setting', async function(req, res, next) {
	//console.log(req.info)
	if(req.info.status == 'error')
	{
		res.render('notfound', { title: '' });
	}
	
	else
	{
		res.render('reportcard_setting', {
				title: req.info.school,
				name: req.info.name,
				position: req.info.position,
				picture: req.info.picture,
				school_picture: req.info.school_picture,
				username: req.info.username,
				school:req.info.school,

		});
		
	}
});

router.get('/eportal/:username/manage_subject', async function(req, res, next) {
	//console.log(req.info)
	if(req.info.status == 'error')
	{
		res.render('notfound', { title: '' });
	}
	
	else
	{
		if(req.info.position == 'Teacher'){
			res.render('teacher/subjectindex', {
				title: req.info.school,
				name: req.info.name,
				position: req.info.position,
				picture: req.info.picture,
				school_picture: req.info.school_picture,
				username: req.info.username,
				school:req.info.school
			});
		}
		else{
			res.render('manage_subject', {
				title: req.info.school,
				name: req.info.name,
				position: req.info.position,
				picture: req.info.picture,
				school_picture: req.info.school_picture,
				username: req.info.username,
				school:req.info.school,

			});
		}
		
	}
});


router.get('/eportal/:username/result_subject', async function(req, res, next) {
	//console.log(req.info)
	if(req.info.status == 'error')
	{
		res.render('notfound', { title: '' });
	}
	
	else
	{
		res.render('result_subject', {
				title: req.info.school,
				name: req.info.name,
				position: req.info.position,
				picture: req.info.picture,
				school_picture: req.info.school_picture,
				username: req.info.username,
				school:req.info.school,

		});
		
	}
});

router.get('/eportal/:username/bulk_result', async function(req, res, next) {
	//console.log(req.info)
	if(req.info.status == 'error')
	{
		res.render('notfound', { title: '' });
	}
	
	else
	{
		res.render('bulk_result', {
				title: req.info.school,
				name: req.info.name,
				position: req.info.position,
				picture: req.info.picture,
				school_picture: req.info.school_picture,
				username: req.info.username,
				school:req.info.school,

		});
		
	}
});


router.get('/eportal/:username/report_card',  async function(req, res, next) {
	//console.log(req.info)
	if(req.info.status == 'error')
	{
		res.render('notfound', { title: '' });
	}
	
	else
	{
		res.render('reportcard', {
				title: req.info.school,
				name: req.info.name,
				position: req.info.position,
				picture: req.info.picture,
				school_picture: req.info.school_picture,
				username: req.info.username,
				school:req.info.school,

		});
		
	}
});

router.get('/eportal/:username/student_result_access',  async function(req, res, next) {
	//console.log(req.info)
	if(req.info.status == 'error')
	{
		res.render('notfound', { title: '' });
	}
	
	else
	{
		res.render('studentresultaccess', {
				title: req.info.school,
				name: req.info.name,
				position: req.info.position,
				picture: req.info.picture,
				school_picture: req.info.school_picture,
				username: req.info.username,
				school:req.info.school,

		});
		
	}
});


router.get('/eportal/:username/broad_sheet',  async function(req, res, next) {
	//console.log(req.info)
	if(req.info.status == 'error')
	{
		res.render('notfound', { title: '' });
	}
	
	else
	{
		res.render('broadsheet', {
				title: req.info.school,
				name: req.info.name,
				position: req.info.position,
				picture: req.info.picture,
				school_picture: req.info.school_picture,
				username: req.info.username,
				school:req.info.school,

		});
		
	}
});

router.get('/eportal/:username/promotion',  async function(req, res, next) {
	//console.log(req.info)
	if(req.info.status == 'error')
	{
		res.render('notfound', { title: '' });
	}
	
	else
	{
		res.render('promotion', {
				title: req.info.school,
				name: req.info.name,
				position: req.info.position,
				picture: req.info.picture,
				school_picture: req.info.school_picture,
				username: req.info.username,
				school:req.info.school,

		});
		
	}
});


router.get('/eportal/:username/reportcard',  async function(req, res, next) {
	//console.log(req.info)
	if(req.info.status == 'error')
	{
		res.render('notfound', { title: '' });
	}
	
	else
	{
		var a_mark = await connect.Result.findOne({where: {session_id:req.query.session,
			term:req.query.session_term,class_arm_id:req.query.sch_class}});
		if(!a_mark){
			res.render('studentreportcardnew', {
				title: req.info.school,
				name: req.info.name,
				position: req.info.position,
				picture: req.info.picture,
				school_picture: req.info.school_picture,
				username: req.info.username,
				school:req.info.school,

			});

		}
		else{
			res.render('notfound', { title: 'Not Found' });
		}
		
	}
});


router.get('/eportal/:username/teacher',  async function(req, res, next) {
	//console.log(req.info)
	if(req.info.status == 'error')
	{
		res.render('notfound', { title: '' });
	}
	
	else
	{
		
			res.render('teacher', {
				title: req.info.school,
				name: req.info.name,
				position: req.info.position,
				picture: req.info.picture,
				school_picture: req.info.school_picture,
				username: req.info.username,
				school:req.info.school,

			});

		
		
	}
});

router.get('/eportal/:username/manage_class',  async function(req, res, next) {
	//console.log(req.info)
	if(req.info.status == 'error')
	{
		res.render('notfound', { title: '' });
	}
	
	else
	{
		if(req.info.position == 'Teacher'){
			res.render('teacher/teacherindex', {
				title: req.info.school,
				name: req.info.name,
				position: req.info.position,
				picture: req.info.picture,
				school_picture: req.info.school_picture,
				username: req.info.username,
				school:req.info.school
			});
		}
		else{
			res.render('manage_class', {
				title: req.info.school,
				name: req.info.name,
				position: req.info.position,
				picture: req.info.picture,
				school_picture: req.info.school_picture,
				username: req.info.username,
				school:req.info.school,

			});
		}

		
		
	}
});


router.get('/eportal/:username/classdetail/:ref_id',  async function(req, res, next) {
	//console.log(req.info)
	if(req.info.status == 'error')
	{
		res.render('notfound', { title: '' });
	}
	
	else
	{
		if(req.info.position == 'Teacher'){
			res.render('teacher/classdetail', {
				title: req.info.school,
				name: req.info.name,
				position: req.info.position,
				picture: req.info.picture,
				school_picture: req.info.school_picture,
				username: req.info.username,
				school:req.info.school,
				ref_id:req.params.ref_id,
				cls:decodeURIComponent(req.query.cls)
			});
		}
		else{			
			res.render('classdetail', {
				title: req.info.school,
				name: req.info.name,
				position: req.info.position,
				picture: req.info.picture,
				school_picture: req.info.school_picture,
				username: req.info.username,
				school:req.info.school,
				ref_id:req.params.ref_id,
				cls:decodeURIComponent(req.query.cls)

			});
		}

		
		
	}
});

router.get('/eportal/:username/subjectdetail/:ref_id',  async function(req, res, next) {
	//console.log(req.info)
	if(req.info.status == 'error')
	{
		res.render('notfound', { title: '' });
	}
	
	else
	{
		if(req.info.position == 'Teacher'){
			res.render('teacher/subjectdetail', {
				title: req.info.school,
				name: req.info.name,
				position: req.info.position,
				picture: req.info.picture,
				school_picture: req.info.school_picture,
				username: req.info.username,
				school:req.info.school,
				ref_id:req.params.ref_id,
				subject:decodeURIComponent(req.query.subject)

			});
		}
		else{
			
			res.render('subjectdetail', {
				title: req.info.school,
				name: req.info.name,
				position: req.info.position,
				picture: req.info.picture,
				school_picture: req.info.school_picture,
				username: req.info.username,
				school:req.info.school,
				ref_id:req.params.ref_id,
				subject:decodeURIComponent(req.query.subject)

			});
		}

		
		
	}
});

router.get('/eportal/:username/manage_password',  async function(req, res, next) {
	//console.log(req.info)
	if(req.info.status == 'error')
	{
		res.render('notfound', { title: '' });
	}
	
	else
	{
		if(req.info.position == 'Teacher'){
			res.render('teacher/manage_password', {
				title: req.info.school,
				name: req.info.name,
				position: req.info.position,
				picture: req.info.picture,
				school_picture: req.info.school_picture,
				username: req.info.username,
				school:req.info.school
			});
		}
		else{
			res.render('manage_password', {
				title: req.info.school,
				name: req.info.name,
				position: req.info.position,
				picture: req.info.picture,
				school_picture: req.info.school_picture,
				username: req.info.username,
				school:req.info.school,

			});
		}

		
		
	}
});

router.get('/eportal/:username/addnotice',  async function(req, res, next) {
	//console.log(req.info)
	if(req.info.status == 'error')
	{
		res.render('notfound', { title: '' });
	}
	
	else
	{
		if(req.info.position == 'student' || req.info.position == 'parent'){
			res.render('notfound', { title: '' });
		}
		else{
		
			res.render('addnotice', {
				title: req.info.school,
				name: req.info.name,
				position: req.info.position,
				picture: req.info.picture,
				school_picture: req.info.school_picture,
				username: req.info.username,
				school:req.info.school,

			});
		}	
	}
});

router.get('/eportal/:username/newsfeed/:ref_id',  async function(req, res, next) {
	//console.log(req.info)
	if(req.info.status == 'error')
	{
		res.render('notfound', { title: '' });
	}
	
	else
	{
		if(req.info.position == 'student' || req.info.position == 'parent'){
			res.render('studentnewsfeed', {
				title: req.info.school,
				name: req.info.name,
				position: req.info.position,
				picture: req.info.picture,
				school_picture: req.info.school_picture,
				username: req.params.username,
				school:req.info.school,
				ref_id:req.params.ref_id,
			});
		}
		else{
		
			res.render('newsfeed', {
				title: req.info.school,
				name: req.info.name,
				position: req.info.position,
				picture: req.info.picture,
				school_picture: req.info.school_picture,
				username: req.info.username,
				school:req.info.school,
				ref_id:req.params.ref_id,

			});
		}	
	}
});

router.get('*', function(req, res, next) {
  res.render('notfound', { title: 'Not Found' });
});

router.post('*', function(req, res, next) {
	
  }
);

  router.put('*', function(req, res, next) {
	
  }
);

module.exports = router;
