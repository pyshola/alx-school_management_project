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
var emc = require('./emc');
const { use } = require("passport");

var math = require("mathjs");


function replacetext(str)
{
	str = str.replace(/[^a-zA-Z0-9]/g,'_');
	str = str.replace(/[^a-zA-Z0-9]/g,'_').replace(/__/g,'_');
	str = str.replace(/((http|https|ftp):\/\/[\w?=&.\/-;#~%-]+(?![\w\s?&.\/;#~%"=-]*>))/g,'_').replace(/__/g,'_');
	return str
}
var exports = module.exports = {};

exports.postteacher = async function(req, res){
	var _id = emc.decrypt(req.payload._id)
	var school = emc.decrypt(req.payload.school)
	var form = new multiparty.Form();
	var access = await emc.getuseraccess('Add Staff', _id, school)
	var access = true
	if(access == false){
	res.send({status: 'error', message: 'Unauthorised access!'})
	}
	else{
		form.parse(req, async function(err, fields, files) {
			//console.log(files)
			//console.log(fields)
			var name = fields.firstname[0]
			var lastname = fields.lastname[0]
			var position = 'Teacher'
			var username = fields.username[0]
			username = replacetext(username)
            username = username.toLowerCase()
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
            var images = files.passport
            if(images == null){
                var idcard = 'https://alxproject.virilesoftware.com/images/user.jpg'
            }
            else{
                var tempPath1 = images[0].path;
                var file_name1 = images[0].originalFilename;	
                var new_location = './public/images/';
                var timer = Date.now();
                var ext1 = file_name1.split(".").pop();
                var targetPath1 = path.resolve(new_location + timer +'.'+ ext1.toLowerCase());
                try{
                    fs.copyFileSync(tempPath1, targetPath1, fs.constants.COPYFILE_EXCL | fs.constants.COPYFILE_FICLONE)
                    //console.log('Image copy successful')
                    var idcard = 'https://alxproject.virilesoftware.com/images/'+timer +'.'+ ext1.toLowerCase(); 
                }catch(error){
                    console.log(error)
                    var idcard = 'https://alxproject.virilesoftware.com/images/user.jpg'
                }
            }
			var login_id = username
			var reqs = {
				username: username, token: password, position: position, status: 'Active',email:email,login_id:login_id,
				firstname: name, lastname:lastname, phone: phone, disable: 0, school_id: school,email: email, gender:gender, 
                address:address, image:idcard
			}
            console.log(reqs)
			
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
					var image = 'https://alxproject.virilesoftware.com/images/'+timer+'.'+ext;	
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






exports.getteacherinfo = async function(req, res){
	console.log(req.acct)
	var result = []
	var _id = emc.decrypt(req.payload._id)
    var school = emc.decrypt(req.payload.school)
    _id = parseInt(_id)
    school = parseInt(school)
	var school = emc.decrypt(req.payload.school)
	var _id = emc.decrypt(req.payload._id)
	var access = await emc.getuseraccess('View Teacher', _id, school)
	var access = true
	var add_access = await emc.getuseraccess('Add Teacher', _id, school)
	var edit_access = await emc.getuseraccess('Edit Teacher', _id, school)
	var delete_access = await emc.getuseraccess('Delete Teacher', _id, school)
	var password_access = await emc.getuseraccess('Reset Teacher Password', _id, school)
	var role_access = await emc.getuseraccess('Configure Teacher Role', _id, school)
	if(access == false){
		res.send({status: 'error', message: 'Unauthorised access!'})
	}
	else{
	
	var objs = await connect.User.findAll({where:{school_id:school, position:'Teacher'}, order:[['firstname', 'ASC']]})
        var result = []
        for(var i = 0; i < objs.length; i++){
            var obj = objs[i]
            if(obj.status == 'Deleted'){}
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
                if (obj.status === '' ||obj.status == null || obj.status == 'Active') {
                    file.status = 'Active'
                }else {
                    file.status = 'Not Active'
                }
                result.push(file)    
            }            
        }
        //res.send({status:'ok', data:result, add:add_access, edit:edit_access, delete:delete_access, password:password_access, role:role_access})
		res.send({status:'ok', data:result, add:true, edit:true, delete:true, password:true, role:true})
    }	
}


exports.getacademicteacher = async function (req, res) {
	var school_id = parseInt(emc.decrypt(req.payload.school))
	var _id = emc.decrypt(req.payload._id)
    _id = parseInt(_id)
    var result = []
	var sch_class = await connect.User.findAll({where: {school_id:school_id, position:'Teacher' }, order:[['firstname', 'ASC']]});
	for (var i = 0; i < sch_class.length; i++) {
		var obj = sch_class[i]
		var file = {}
		if(obj.status == 'Deleted'){}
		else{
			file.ref_id = obj.id
			file.name = obj.firstname +' '+obj.lastname
			file.image = obj.image
			result.push(file)
		}
		
	}
	//console.log(result)
	res.send(result)
}


exports.postclassteacher = async function(req, res){
	var _id = parseInt(emc.decrypt(req.payload._id))
	var school_id = parseInt(emc.decrypt(req.payload.school))
	console.log(req.body)
	var session = await emc.getpreviousacademicsession(school_id)
	console.log(session)
	var sch_class = await connect.ClassArm.findOne({where: {id:req.params.ref_id, school_id:school_id }});
	if(!sch_class){
		res.send({status:'erro', message:'Class not found'})
	}
	else{
		var file = {session_id:req.body.session, teacher_id:req.body.name, class_arm_id:sch_class.id, start_date:new Date(),
		end_date:new Date(), school_id:school_id, user_id:_id}
		console.log(file)
		var p = await connect.ClassTeacher.create(file)
		res.send({status:'ok', message:'Class Teacher asign successful'})
	}
}


exports.getclassteacher = async function(req, res){
	var _id = parseInt(emc.decrypt(req.payload._id))
	var school_id = parseInt(emc.decrypt(req.payload.school))
	console.log(req.query)
	var teacher = await connect.ClassTeacher.findAll({where: {school_id:school_id,session_id:req.query.session,class_arm_id:req.params.ref_id}});
	console.log(teacher.length)

	var result = []
	for(var i = 0; i < teacher.length; i++){
		var file = {}
		var user = await connect.User.findOne({where:{id:teacher[i].teacher_id}})
		file.name = user.firstname+' '+user.lastname
		file.ref_id = user.id
		file.image = user.image
		result.push(file)
		
	}
	res.send(result)

}

exports.deleteclassteacher = async function(req, res){
	var _id = parseInt(emc.decrypt(req.payload._id))
	var school_id = parseInt(emc.decrypt(req.payload.school))
	console.log(req.body)
	var teacher = await connect.ClassTeacher.findOne({where: {school_id:school_id,session_id:req.body.session, 
		class_arm_id:req.params.ref_id, teacher_id:req.body.teacher}});
	if(!teacher){
		res.send({status:'error', message:'Teacher not found'})
	}
	else{
		var p = await connect.ClassTeacher.destroy({where:{id:teacher.id}})
		res.send({status:'ok', message:'Class Teacher remove successful'})
	}


}



exports.postsubjectteacher = async function(req, res){
	var _id = parseInt(emc.decrypt(req.payload._id))
	var school_id = parseInt(emc.decrypt(req.payload.school))
	console.log(req.body)
	var session = await emc.getpreviousacademicsession(school_id)
	console.log(session)
	var sch_class = await connect.ClassArm.findOne({where: {id:req.body.class_id, school_id:school_id }});
	if(!sch_class){
		res.send({status:'erro', message:'Class not found'})
	}
	else{
		var file = {session_id:req.body.session, subject_id:req.params.ref_id, teacher_id:req.body.name, class_arm_id:sch_class.id, start_date:new Date(),
		end_date:new Date(), school_id:school_id, user_id:_id}
		console.log(file)
		var p = await connect.SubjectTeacher.create(file)
		res.send({status:'ok', message:'Subject Teacher asign successful'})
	}
}


exports.getsubjectteacher = async function(req, res){
	var _id = parseInt(emc.decrypt(req.payload._id))
	var school_id = parseInt(emc.decrypt(req.payload.school))
	console.log(req.query)
	var teacher = await connect.SubjectTeacher.findAll({where: {school_id:school_id,session_id:req.query.session,
		class_arm_id:req.query.class_id, subject_id:req.params.ref_id}});
	console.log(teacher.length)

	var result = []
	for(var i = 0; i < teacher.length; i++){
		var file = {}
		var user = await connect.User.findOne({where:{id:teacher[i].teacher_id}})
		file.name = user.firstname+' '+user.lastname
		file.ref_id = user.id
		file.image = user.image
		result.push(file)
		
	}
	res.send(result)

}

exports.deletesubjectteacher = async function(req, res){
	var _id = parseInt(emc.decrypt(req.payload._id))
	var school_id = parseInt(emc.decrypt(req.payload.school))
	console.log(req.body)
	var teacher = await connect.SubjectTeacher.findOne({where: {school_id:school_id,session_id:req.body.session, 
		class_arm_id:req.body.class_id, subject_id:req.params.ref_id, teacher_id:req.body.teacher}});
	if(!teacher){
		res.send({status:'error', message:'Teacher not found'})
	}
	else{
		var p = await connect.SubjectTeacher.destroy({where:{id:teacher.id}})
		res.send({status:'ok', message:'Subject Teacher remove successful'})
	}


}



exports.getstudentlistbysubject = async function(req, res){
	var school_id = parseInt(emc.decrypt(req.payload.school))
	var _id = emc.decrypt(req.payload._id)
    _id = parseInt(_id)
    var result = []
	console.log(req.query)
	//var delete_access = await emc.getuseraccess('Remove Student from Subject', _id, school_id)
	var sch_class = await connect.ClassArm.findOne({where: {id:req.query.class_id, school_id:school_id }});
	if(sch_class)
	{
		
		var sch = await connect.AcademicSession.findAll({where:{class_arm_id:req.query.class_id, school_id:school_id, session_id:req.query.academic_session, leave:0}})
		console.log(sch.length)
		for(var i = 0; i < sch.length; i++){
			
			var studentscore = await connect.StudentScore.findOne({where:{academic_session_id:sch[i].id, subject_id:req.query.subject_id}})
			if(studentscore){
				var file = {}
				var cls_arm = await connect.ClassArm.findOne({where:{id:sch[i].class_arm_id}});
				var cls = await connect.SchoolClass.findOne({where:{id:cls_arm.school_class_id}});
				var student = await connect.Student.findOne({where:{id:sch[i].student_id}});
				file.ref_id = studentscore.id
				file.name = student.surname+' '+student.middlename+' '+student.firstname
				file.admission_no = student.admission_no
				file.student_class = cls.name+' '+cls_arm.arm
				file.student_id = student.id
				file.student_academic = sch[i].id
				file.admission_date = student.admission_year
				file.gender = student.gender
				
				result.push(file)
			}
			
			
		
		}
		result.sort(emc.GetSortOrder('name'))
		//console.log(result)
		res.send(result)
	}
	else{
	}
}


exports.getteachersubjectlist = async function (req, res) {
	var school_id = parseInt(emc.decrypt(req.payload.school))
	var _id = emc.decrypt(req.payload._id)
    _id = parseInt(_id)
    var result = []
	var sch_session = await connect.SessionName.findAll({order:[['index', 'DESC']]});
	let session_id = 0
	for(let i = 0; i < sch_session.length; i++){
		var session = await connect.Session.findOne({where: {name:sch_session[i].name, school_id:school_id }});
		if(session){
			var teacher = await connect.SubjectTeacher.findOne({where: {school_id:school_id,session_id:session.id, teacher_id:_id}}); 
			if(teacher){
				session_id = session.id
				break
			}

		}
			
	}
	if(session_id == 0){}
	else{
		var sch_class = await connect.SubjectTeacher.findAll({where: {school_id:school_id,session_id:session_id, 
		teacher_id:_id}}); 
		for (var i = 0; i < sch_class.length; i++) {
			var subject = await connect.Subject.findOne({where: {id:sch_class[i].subject_id}});
			var file = {}
			file.name = subject.name
			file.ref_id = subject.id
			var sch = await connect.AcademicSession.findAll({where:{class_arm_id:sch_class[i].class_arm_id, school_id:school_id, 
				session_id:session_id, leave:0}})
			//console.log(sch.length)
			var total = 0
			for(var s = 0; s < sch.length; s++){
				var t = await connect.StudentScore.count({where:{academic_session_id:sch[s].id, subject_id:subject.id}})
				total += t
			}
			file.student = total
			var class_arm_id = await connect.ClassArm.findOne({where: {id:sch_class[i].class_arm_id}});
			var schclass = await connect.SchoolClass.findOne({where:{id:class_arm_id.school_class_id}})
			//console.log(sch.length)
			
			file.text_book = ''
			file.class_arm = schclass.name+' '+class_arm_id.arm
			file.student_class = class_arm_id.id
			file.academic_session = session_id
			result.push(file)
		}

	}
	console.log(result)
	res.send(result)
	
}


exports.getteacherclass = async function (req, res) {
	var school_id = parseInt(emc.decrypt(req.payload.school))
	var _id = emc.decrypt(req.payload._id)
    _id = parseInt(_id)
    var result = []
	var sch_session = await connect.SessionName.findAll({order:[['index', 'DESC']]});
	let session_id = 0
	for(let i = 0; i < sch_session.length; i++){
		var session = await connect.Session.findOne({where: {name:sch_session[i].name, school_id:school_id }});
		if(session){
			var teacher = await connect.ClassTeacher.findOne({where: {school_id:school_id,session_id:session.id, teacher_id:_id}}); 
			if(teacher){
				session_id = session.id
				break
			}

		}
			
	}
	console.log('session: '+session_id)
	if(session_id == 0){}
	else{
		
		var sch_class = await connect.ClassTeacher.findAll({where: {school_id:school_id,session_id:session_id, 
		teacher_id:_id}}); 
		for (var i = 0; i < sch_class.length; i++) {
			var file = {}
			
			var total = await connect.AcademicSession.count({where:{class_arm_id:sch_class[i].class_arm_id, school_id:school_id, session_id:session_id, leave:0}})
			
			file.student = total
			var class_arm_id = await connect.ClassArm.findOne({where: {id:sch_class[i].class_arm_id}});
			var schclass = await connect.SchoolClass.findOne({where:{id:class_arm_id.school_class_id}})
			//console.log(sch.length)
			file.ref_id = sch_class[i].class_arm_id
			file.name = schclass.name+' '+class_arm_id.arm
			file.student_class = class_arm_id.id
			file.academic_session = session_id
			result.push(file)
		}

	}
	console.log(result)
	res.send(result)

}

exports.deletestudentsubject = async function(req, res){
	var school_id = parseInt(emc.decrypt(req.payload.school))
	var _id = emc.decrypt(req.payload._id)
    _id = parseInt(_id)
    var result = []
	var studentscore = await connect.StudentScore.findOne({where:{id:req.params.ref_id, school_id:school_id}})
	if(studentscore){
		var se = await connect.StudentScore.destroy({where:{id:studentscore.id, school_id:school_id}})
		res.send({status:'ok', msg:'Student deleted successful'})
	}
	else{
		res.send({status:'error', msg:'Student record not found'})
	}

}



exports.poststudentschoolbill = async function (req, res) {
	var school_id = parseInt(emc.decrypt(req.payload.school))
	var _id = emc.decrypt(req.payload._id)
    _id = parseInt(_id)
    var result = []
	console.log(req.body)
	var academic = await emc.getacademicsession(school_id)
	if(academic  == {}){
		res.send({status:'error', msg:'Error academic session not found!'})
	}
	else{
		console.log(academic)
		var students = await connect.AcademicSession.findAll({where:{session_id:academic.session_id, leave:0}})
		console.log(students.length)
		var v = 0
		// for(let student of students){
		// 	console.log(student.id)
		// 	var sch_class = await connect.ClassArm.findOne({where: {id:student.class_arm_id }});
		// 	var schclass = await connect.SchoolClass.findOne({where:{id:sch_class.school_class_id}})
		// 	// await connect.StudentBill.destroy({where:{session_id:academic.session_id, term:academic.term, student_id:student.student_id,
		// 	// 	class_arm_id:student.class_arm_id}})
		// 	// await connect.StudentBillTotal.destroy({where:{session_id:academic.session_id, term:academic.term, student_id:student.student_id,
		// 	// 	class_arm_id:student.class_arm_id}})
		// 	var fees = await connect.SchoolFees.findAll({where: {school_class_id:sch_class.school_class_id, 
		// 		session_id:academic.session_id, term:academic.term}, order:[['id', 'ASC']]});
			//console.log(student.class_arm_id, fees.length)
			// var ad = await connect.StudentBillTotal.findOne({where:{session_id:academic.session_id, term:academic.term,
			// 	student_id:student.student_id, class_arm_id:student.class_arm_id}});
			// if(!ad){
			// 		console.log("new")
			// 	var info = await connect.StudentBillTotal.findOne({where:{session_id:academic.prev_session_id,
			// 			term:academic.previous_term, student_id:student.student_id}});
			// 	if(!info){}
			// 	else{
			// 			var file = {session_id:academic.session_id, term:academic.term, student_id:student.student_id, 
			// 				class_arm_id:student.class_arm_id,
			// 			fees_types_id:0, school_fees_id:0, fees_name:'Outstanding Bill',category:'outstanding',
			// 			amount:info.balance, payment:0, weaver:0, fine:0, balance: info.balance, user_id:_id, school_id:school_id}
			// 			console.log(file)
						
			// 			var total = {session_id:academic.session_id, term:academic.term, student_id:student.student_id,
			// 				class_arm_id:student.class_arm_id,
			// 				amount:info.balance, payment:0, weaver:0, fine:0,balance: info.balance, user_id:_id, school_id:school_id}
			// 			console.log(total)
			// 			var sch = await connect.StudentBill.create(file)
			// 			var sch = await connect.StudentBillTotal.create(total)
			// 	}
			// }

		// 	for(let fee of fees){
				
		// 		if(parseInt(fee.amount) != 140000){
		// 			console.log(fee.amount)

		// 			var fees_types = await connect.FeesType.findOne({where: {id:fee.fees_types_id}});
		// 			var file = {session_id:academic.session_id, term:academic.term, student_id:student.student_id, class_arm_id:student.class_arm_id,
		// 				fees_types_id:fees_types.id, school_fees_id:fee.fees_types_id, fees_name:fees_types.name,category:'bill',
		// 				amount:fee.amount, payment:0, weaver:0, fine:0, balance: fee.amount, user_id:_id, school_id:school_id}
		// 			console.log(file)
		// 				var sch = await connect.StudentBill.create(file)
		// 			var info = await connect.StudentBillTotal.findOne({where:{session_id:academic.session_id, term:academic.term,
		// 				 student_id:student.student_id, class_arm_id:student.class_arm_id}});
		// 			if(!info)
		// 			{
		// 				var total = {session_id:academic.session_id, term:academic.term, student_id:student.student_id,
		// 					class_arm_id:student.class_arm_id,
		// 				amount:fee.amount, payment:0,balance: fee.amount, weaver:0, fine:0, user_id:_id, school_id:school_id}
		// 				var sch = await connect.StudentBillTotal.create(total)
		// 			}
		// 			else{
		// 				var amt = math.chain(fee.amount).add(info.amount).done()
		// 				var bal = math.chain(fee.amount).add(info.balance).done()
		// 				var total = {amount:amt, balance: bal}
		// 				var sch = await connect.StudentBillTotal.update(total, {where:{id:info.id}})
		// 			}
		// 		}
				
				
			


		// 			v++
		// 		}
				

			
			
			

		// }
		console.log(v)


	}
		
}
