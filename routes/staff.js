var Sequelize = require("sequelize");
var bcrypt = require('bcryptjs');
var connect = require("../config/config");
var asyncs = require("async");
var util = require("util"); 
var fs = require("fs"); 
var multiparty = require('multiparty');
var path = require('path');
var mv = require("mv");
var bcrypt = require('bcryptjs');
var https = require('https');
var path = require('path')
var emc = require('./emc')
function replacetext(str)
{
	str = str.replace(/[^a-zA-Z0-9]/g,'_');
	str = str.replace(/[^a-zA-Z0-9]/g,'_').replace(/__/g,'_');
	str = str.replace(/((http|https|ftp):\/\/[\w?=&.\/-;#~%-]+(?![\w\s?&.\/;#~%"=-]*>))/g,'_').replace(/__/g,'_');
	return str
}
var exports = module.exports = {};

exports.poststaff = async function(req, res){
	var _id = emc.decrypt(req.payload._id)
	var school = emc.decrypt(req.payload.school)
	var form = new multiparty.Form();
	var access = await emc.getuseraccess('Add Staff', _id, school)
	if(access == false){
	res.send({status: 'error', message: 'Unauthorised access!'})
	}
	else{
		form.parse(req, async function(err, fields, files) {
			//console.log(files)
			//console.log(fields)
			var name = fields.firstname[0]
			var lastname = fields.lastname[0]
			var position = 'admin'
			var username = name.toLowerCase()
			username = replacetext(username)
			var phone = fields.phone[0]
			var address = fields.address[0]
			var email = fields.email[0]
			var gender = fields.gender[0]
			var password = bcrypt.hashSync(fields.password[0], 8);
			var count = await connect.User.count({ where: {username:{$iLike: username+'%'}}})
			if (count == 0) {
				username = username
				
			} else {
				username = username + '0' + count
				
			}
			var login_id = username
			var reqs = {
				username: username, token: password, position: position, status: 'Active',email:email,login_id:login_id,
				firstname: name, lastname:lastname, phone: phone, disable: 0, school_id: school,email: email, gender:gender, address:address, image:'https://alxproject.virilesoftware.com/images/user.jpg'
			}
			
			var user = await connect.User.create(reqs)
			res.send({status:'ok', msg:'Staff information created successfully'});
		})
	}
	
}

exports.updatestaff = async function(req, res){
	var _id = emc.decrypt(req.payload._id)
	var school = emc.decrypt(req.payload.school)
	var form = new multiparty.Form();
	var access = await emc.getuseraccess('Add Staff', _id, school)
	if(access == false){
	res.send({status: 'error', message: 'Unauthorised access!'})
	}
	else{
    form.parse(req, async function(err, fields, files) {
		console.log(req.params.ref_id)
		//console.log(fields)
		var branch = JSON.parse(fields.branch[0])
		//console.log(branch)
		var name = fields.name[0]
		var position = fields.position[0]
		var phone = fields.phone[0]
		var address = fields.address[0]
		var email = fields.email[0]
		var gender = fields.gender[0]
		
		var reqs = {
			position: position, email:email,name: name, phone: phone, gender:gender, address:address
		}
		var users = await connect.User.findOne({where: {id: req.params.ref_id,school_id: school}})
		if(!users){}
		else{
			if(files.image)
			{
				var text_img = files.image
				var tempPath1 = text_img[0].path;
				var file_name1 = text_img[0].originalFilename;	
				var new_location = './public/images/';
				var timer = Date.now();
				var ext = file_name1.split(".").pop();
				var targetPath1 = path.resolve(new_location + timer+'.'+ext);	
				mv(tempPath1, targetPath1, async function(err) {
				  if (err) {
					var image = ''
				  }
				  else{
					var image = 'https://localhost:3000/images/'+timer+'.'+ext;	
				  }
				  reqs.image = image
				  console.log(reqs)
				  var user = await connect.User.update(reqs,{where:{id:users.id}})
				  var user = await connect.UserBranch.update({branch:branch, payroll:parseInt(fields.payroll[0])},{where:{user_id:users.id}})
				  res.send({status:'ok', msg:'Staff information update successfully'});
				 
			  })	
				
			}
			else
			{
				console.log(reqs)
				var user = await connect.User.update(reqs,{where:{id:users.id}})
				var user = await connect.UserBranch.update({branch:branch, payroll:parseInt(fields.payroll[0])},{where:{user_id:users.id}})
				res.send({status:'ok', msg:'Staff information update successfully'});
			}
		}
	})
}
	
}


exports.updatestaffhand = async function(req, res){
	var _id = emc.decrypt(req.payload._id)
    var school = emc.decrypt(req.payload.school)
    _id = parseInt(_id)
    school = parseInt(school)
	var access = await emc.getuseraccess('Delete Staff', _id, school)
	if(access == false){
	res.send({status: 'error', message: 'Unauthorised access!'})
	}
	else{
	connect.User.findOne({where: {id: req.params.ref_id, school_id:school}}).then(function (users) {
		if(!users)
			{
				var result = {status:'error', message:'Unknown account, please contact customer service for help!'};
				res.send(result)
			}
			else
			{
				connect.User.update({status:req.body.status, disable:_id}, { where: {id:users.id}}).then(function(affectedRows) {
					var result = {status:'ok', message:'save successfully'};
					res.send(result)
				}).catch(function(){
					var result = {status:'error', message:'server error, try again!'};
					res.send(result)
				})
			}
		})
	}
	
}


exports.updatestaffhandpassword = async function(req, res){
	var _id = emc.decrypt(req.payload._id)
    var school = emc.decrypt(req.payload.school)
    _id = parseInt(_id)
    school = parseInt(school)
	var access = await emc.getuseraccess('Reset Password', _id, school)
	if(access == false){
	res.send({status: 'error', message: 'Unauthorised access!'})
	}
	else{
		connect.User.findOne({where: {id: req.params.ref_id, school_id:school}}).then(function (users) {
			if(!users)
			{
				var result = {status:'error', message:'Unknown account, please contact customer service for help!'};
				res.send(result)
			}
			else
			{
				console.log(req.body)
				var password = bcrypt.hashSync(req.body.password, 8);
				connect.User.update({token:password}, { where: {id:users.id}}).then(function(affectedRows) {
					var result = {status:'ok', message:'password update successfully'};
					res.send(result)
				}).catch(function(){
					var result = {status:'error', message:'server error, try again!'};
					res.send(result)
				})
			}
		})
	}
	
}


exports.getstaff = async function(req, res){
	console.log(req.acct)
	var result = []
	var _id = emc.decrypt(req.payload._id)
    var school = emc.decrypt(req.payload.school)
    _id = parseInt(_id)
    school = parseInt(school)
	var user = await connect.User.findOne({ where: { id: _id } })
	var objs = await connect.User.findAll({where:{school_id:school}, order:[['name', 'ASC']]}) 
	var userbranch = await connect.UserBranch.findOne({ where: { school_id:school, user_id: _id } })
	for(var i = 0; i < objs.length; i++){
		var obj = objs[i]
		if(obj.status == 'Deleted'){}
		else{
			if(user.position == 'Owner'){
				
				var file ={}
				file.ref_id = obj.id
				file.name = obj.name
				result.push(file)
				
			}
			else{
				if(obj.position == 'Owner'){
					var file ={}
					file.ref_id = obj.id
					file.name = obj.name
					result.push(file)
				}
				else{
					var staffbranch = await connect.UserBranch.findOne({where:{school_id:school, user_id:obj.id}})
					var br = staffbranch.branch
					var branch_arr = userbranch.branch
					for(var s = 0; s < br.length; s++)
					{
						var index = branch_arr.indexOf(br[s]);
						if (index > -1) {
							var file ={}
							file.ref_id = obj.id
							file.name = obj.name
							result.push(file)						
						}
						else{}
					}	
				}
				
				
			}
			
		}
	}
	res.send(result)

}



exports.getstaffbyid = async function(req, res){
	console.log(req.acct)
	var result = []
	var _id = emc.decrypt(req.payload._id)
    var school = emc.decrypt(req.payload.school)
    _id = parseInt(_id)
    school = parseInt(school)
	var obj = await connect.User.findOne({where:{school_id:school, id:req.params.ref_id}}) 
	if(obj.status == 'Deleted'){}
	else{
		var file ={}
		file.ref_id = obj.id
		file.name = obj.firstname +' '+obj.lastname
		file.username = obj.login_id
		file.email = obj.email
		file.position = obj.position
		file.phone = obj.phone
		file.address = obj.address
		file.gender = obj.gender
		var userinfo = await connect.UserBranch.findOne({where:{school_id:school, user_id:obj.id}}) 
		file.payroll = userinfo.payroll
		file.branch = userinfo.branch
		file.image = obj.image
	}
			
	console.log(file)
	res.send(file)
		
}

exports.getstaffinfo = async function(req, res){
	console.log(req.acct)
	var result = []
	var _id = emc.decrypt(req.payload._id)
    var school = emc.decrypt(req.payload.school)
    _id = parseInt(_id)
    school = parseInt(school)
	var school = emc.decrypt(req.payload.school)
	var _id = emc.decrypt(req.payload._id)
	var access = await emc.getuseraccess('View Staffs', _id, school)
	var add_access = await emc.getuseraccess('Add Staff', _id, school)
	var edit_access = await emc.getuseraccess('Edit Staff', _id, school)
	var delete_access = await emc.getuseraccess('Delete Staff', _id, school)
	var password_access = await emc.getuseraccess('Reset Password', _id, school)
	var role_access = await emc.getuseraccess('Configure Staff Role', _id, school)
	if(access == false){
		res.send({status: 'error', message: 'Unauthorised access!'})
	}
	else{
	
	var objs = await connect.User.findAll({where:{school_id:school}, order:[['firstname', 'ASC']]})
	var result = []
	for(var i = 0; i < objs.length; i++){
		var obj = objs[i]
		if(obj.status == 'Deleted'){}
		else if(obj.position == 'Teacher'){}
		else{
				var file ={}
				file.ref_id = obj.id
				file.name = obj.firstname +' '+obj.lastname
				file.firstname = obj.firstname
				file.lastname = obj.lastname
				file.username = obj.login_id
				file.email = obj.email
				file.position = obj.position
				file.phone = obj.phone
				file.address = obj.address
				file.gender = obj.gender
				file.image = obj.image
				if (obj.status === '') {
					file.status = 'Active'
				} else if (obj.status == null) {
					file.status = 'Active'
				} else if (obj.status == 'Active') {
					file.status = 'Active'
				} else {
					file.status = 'Not Active'
				}
				result.push(file)
			
				
			
		}
		//console.log(result)
		
	}
	res.send({status:'ok', data:result, add:add_access, edit:edit_access, delete:delete_access, password:password_access, role:role_access})
}	
}

exports.getstaffaccess = function(req, res){
	var _id = emc.decrypt(req.payload._id)
    var school = emc.decrypt(req.payload.school)
    _id = parseInt(_id)
    school = parseInt(school)
	connect.User.findOne({where: {id: _id, school_id:school}}).then(function (obj) {
		if(!obj)
		{
			var result = {status:'error', message:'user not found!'};
			res.send(result)
		}
		else if(obj.status == 'Deleted')
		{
			var result = {status:'error', message:'user not found!'};
			res.send(result)
		}
		else
		{
			var file = {}
			file.position = obj.position
			file.access = obj.access
			file.sale = obj.sale
			file.purchase = obj.purchase
			file.b_payment = obj.brokers_payment
			file.broker = obj.brokers
			file.vsm = obj.vsm
			file.vsm_payment = obj.vsm_payment
			file.discount = obj.discount
			file.promo = obj.promo
			file.evacuation =obj.evacuation
			file.remit = obj.remit
			file.store_info = obj.store
			file.product = obj.product
			file.price = obj.price
			var result = {status:'ok', data:file};
			res.send(result)
		}
	})
}



exports.updatestaffroles = async function(req, res){
	var _id = emc.decrypt(req.payload._id)
    var school = emc.decrypt(req.payload.school)
    _id = parseInt(_id)
    school = parseInt(school)
	var users = await connect.User.findOne({where: {id: req.params.ref_id, school_id:school}})
	if(!users)
	{
		var result = {status:'error', message:'Unknown account, please contact customer service for help!'};
		res.send(result)
	}
	else
	{
		console.log(req.body)
		var roles = await connect.StaffRole.findOne({where: {user_id: users.id, school_id:school}})
		if(!roles){
			var p = await connect.StaffRole.create({roles:req.body.roles, user_id:users.id, school_id:school})
		}
		else{
			var p = await connect.StaffRole.update({roles:req.body.roles, user_id:users.id, school_id:school}, { where: {id:roles.id}})
		}
		var result = {status:'ok', message:'Staff roles and permission updated successful!'};
		res.send(result)
	}	
}


exports.getstaffroles = async function(req, res){
	var _id = emc.decrypt(req.payload._id)
    var school = emc.decrypt(req.payload.school)
    _id = parseInt(_id)
    school = parseInt(school)
	var users = await connect.User.findOne({where: {id: req.params.ref_id, school_id:school}})
	if(!users)
	{
		var result = {status:'error', message:'Unknown account, please contact customer service for help!'};
		res.send(result)
	}
	else
	{
		console.log(req.body)
		var roles = await connect.StaffRole.findOne({where: {user_id: users.id, school_id:school}})
		if(!roles){
			var result = {status:'error', message:'Roles not created!'};
			res.send(result)
		}
		else{
			var result = {status:'ok', data:roles.roles};
			res.send(result)
			
		}
		
	}	
}

exports.getstaffmenu = async function(req, res){
	var _id = emc.decrypt(req.payload._id)
    var school = emc.decrypt(req.payload.school)
    _id = parseInt(_id)
    school = parseInt(school)
	var users = await connect.User.findOne({where: {id: _id, school_id:school}})
	if(!users)
	{
		var result = {status:'ok', data:JSON.stringify([])};
		res.send(result)
	}
	else
	{
		var roles = await connect.StaffRole.findOne({where: {user_id: users.id, school_id:school}})
		if(!roles){
			var result = {status:'ok', data:JSON.stringify([])};
			res.send(result)
		}
		else{
			var result = {status:'ok', data:roles.roles};
			res.send(result)
			
		}
		
	}	
}



exports.getteachermenu = async function(req, res){
	var school_id = parseInt(emc.decrypt(req.payload.school))
	var _id = parseInt(emc.decrypt(req.payload._id))
	var cls_teacher = 'No'
	var subject_teacher = 'No'
	var class_session_id = 0
	var subject_session_id = 0
	var users = await connect.User.findOne({where: {id: _id, school_id:school_id}})
	if(!users)
	{
		var result = {status:'ok', class_teacher:cls_teacher, subject_teacher:subject_teacher, class_session:class_session_id, subject_session:subject_session_id};
		res.send(result)
	}
	else
	{
		var sch_session = await connect.SessionName.findAll({order:[['index', 'DESC']]});
		let latest_class = []
		for(let i = 0; i < sch_session.length; i++){
			var session = await connect.Session.findOne({where: {name:sch_session[i].name, school_id:school_id }});
			if(session){
				console.log(session.id)
				var teacher = await connect.ClassTeacher.findOne({where: {school_id:school_id,session_id:session.id, teacher_id:_id}}); 
				if(teacher){
					cls_teacher = 'Yes'
					class_session_id = session.id
					break
				}

			}
			
		}
		for(let i = 0; i < sch_session.length; i++){
			var session = await connect.Session.findOne({where: {name:sch_session[i].name, school_id:school_id }});
			if(session){
				var subjectteacher = await connect.SubjectTeacher.findOne({where: {school_id:school_id,session_id:session.id, 
					teacher_id:_id}});
				if(subjectteacher){
					subject_teacher = 'Yes'
					subject_session_id = session.id
					break
				}

			}
			
		}
		var result = {status:'ok', class_teacher:cls_teacher, subject_teacher:subject_teacher, class_session:class_session_id, subject_session:subject_session_id};
		console.log(result)
		res.send(result)
		// var session = await emc.getpreviousacademicsession(school_id)
		// if(session == {}){}
		// else{
		// 	var teacher = await connect.ClassTeacher.findOne({where: {school_id:school_id,session_id:session.session_id, 
		// 		teacher_id:_id}}); 
		// 	var subjectteacher = await connect.SubjectTeacher.findOne({where: {school_id:school_id,session_id:session.session_id, 
		// 			teacher_id:_id}});
		// 	if(teacher){
		// 		cls_teacher = 'Yes'

		// 	}
		// 	if(subjectteacher){
		// 		subject_teacher = 'Yes'
		// 	}
			
		// }
	}	
}

exports.updatepassword = async function(req, res){
	var _id = emc.decrypt(req.payload._id)
    var school = emc.decrypt(req.payload.school)
    _id = parseInt(_id)
    school = parseInt(school)
	var user = await connect.User.findOne({where: {id: _id, school_id:school}})
	if (!user) {
		res.send({status: 'error',msg: 'User do not exit'});
	} else {
		var hash = user.token;
		if (bcrypt.compareSync(req.body.current_password, hash)) {
			console.log('good')
			var password = bcrypt.hashSync(req.body.password, 8);
			connect.User.update({token:password}, { where: {id:user.id}}).then(function(affectedRows) {
				var result = {status:'ok', msg:'password update successfully'};
				res.send(result)
			}).catch(function(){
				var result = {status:'error', msg:'server error, try again!'};
				res.send(result)
			})
		}
		else{
			res.send({status: 'error', msg: 'Invalid current password!.'});
		}
	}


}