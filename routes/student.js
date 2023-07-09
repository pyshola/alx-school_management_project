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
var moment = require("moment")
var math = require("mathjs");
const sortBy = require("lodash").sortBy

var nodemailer = require('nodemailer')
var wellknown = require('nodemailer-wellknown')
var receipttemplates = path.resolve(__dirname, '..', 'templates/receipt.html')

var EmailTemplates = require('swig-email-templates');
var templates = new EmailTemplates();
var juice = require('juice');
var bcrypt = require('bcryptjs');
var emc = require('./emc')
var transport = nodemailer.createTransport({
  host: 'smtp.de.opalstack.com',
    port: 465,
    secure: true, // use SSL
  auth: {
    user: 'support_iconhall',
    pass: 'iconhall123A'
  },
  tls: {
        rejectUnauthorized: false
    }
  
})

const {
	Op
} = require("sequelize");
const { Connection } = require("pg");
function replacetextlogin(str)
{
	str = str.replace(/[^a-zA-Z0-9]/g,'');
	str = str.replace(/[^a-zA-Z0-9]/g,'').replace(/__/g,'');
	str = str.replace(/((http|https|ftp):\/\/[\w?=&.\/-;#~%-]+(?![\w\s?&.\/;#~%"=-]*>))/g,'').replace(/__/g,'');
	return str
}
function truncates( n, useWordBoundary ){
    var isTooLong = this.length > n,
        s_ = isTooLong ? this.substr(0,n-1) : this;
        s_ = (useWordBoundary && isTooLong) ? s_.substr(0,s_.lastIndexOf(' ')) : s_;
    return  isTooLong ? s_ + '&hellip;' : s_;
};
function replacetext(str)
{
	str = str.replace(/[^a-zA-Z0-9]/g,'_');
	str = str.replace(/[^a-zA-Z0-9]/g,'_').replace(/__/g,'_');
	str = str.replace(/((http|https|ftp):\/\/[\w?=&.\/-;#~%-]+(?![\w\s?&.\/;#~%"=-]*>))/g,'_').replace(/__/g,'_');
	return str
}

function insertNum(str) {
    return str.replace(/\w\b/g, function(match) {
        return match + ':*' ;
    });
}

function replacecomma(text){
	text = ''+text
	var dt = text.replace(/,/g, '');
	return dt
}

function insertLike(str) {
	var array = str.split(' ')
	array.forEach(function(element, index) {
		array[index] = '%' + element + '%';
	});
    return array.join(' ')
}


const studentsessioninfo = async(student_id, school_id) =>{
	const academic = {}
	
    var form = new multiparty.Form();
	var sch_session = await connect.SessionName.findAll({order:[['index', 'DESC']]});
	console.log(sch_session)
	for(let s = 0; s < sch_session.length; s++){
		//console.log(sch_session[s].name)
		var session = await connect.Session.findOne({where: {name:sch_session[s].name, school_id:school_id }});
		if(session){
			var academic_session = await connect.AcademicSession.findOne({where:{student_id:student_id, session_id:session.id}});
			if(academic_session){
				var first = moment(session.first_term_end).diff(moment(), 'days')
				var second = moment(session.second_term_end).diff(moment(), 'days')
				var third = moment(session.third_term_end).diff(moment(), 'days')
				if(first >= 0){
					if(!sch_session[s + 1]){
						var prev_session = false
					
					}
					else{
						var prev_session = await connect.Session.findOne({where: {name:sch_session[s + 1].name, school_id:school_id }});
						
					}
					if(prev_session){
						var pre_academic_session = await connect.AcademicSession.findOne({where:{student_id:student_id, session_id:prev_session.id}});
						if(!pre_academic_session){
							academic.previous_session = ''
							academic.previous_term = ''
							academic.session = session.name
							academic.term = 'First Term'
							academic.session_id = session.id
							academic.prev_session_id = 0
						}
						else{
							academic.previous_session = prev_session.name
							academic.previous_term = 'Third Term'
							academic.prev_session_id = prev_session.id
							academic.session = session.name
							academic.term = 'First Term'
							academic.session_id = session.id
							
						}
					}
					else{
						academic.previous_session = ''
						academic.previous_term = ''
						academic.session = session.name
						academic.term = 'First Term'
						academic.session_id = session.id
						academic.prev_session_id = 0
					}
					

				}
				else if(second >= 0){
					academic.previous_session = session.name
					academic.previous_term = 'First Term'
					academic.session = session.name
					academic.term = 'Second Term'
					academic.session_id = session.id
					academic.prev_session_id = session.id
				}
				else{
					academic.previous_session = session.name
					academic.previous_term = 'Second Term'
					academic.session = session.name
					academic.term = 'Third Term'
					academic.session_id = session.id
					academic.prev_session_id = session.id
				}
				break
			}
			
		}

	}

	return academic
}


var exports = module.exports = {};
exports.poststudents = async function (req, res) {
	var school_id = parseInt(emc.decrypt(req.payload.school))
	var _id = parseInt(emc.decrypt(req.payload._id))
    var form = new multiparty.Form();
	form.parse(req, async function(err, fields, files) {
        console.log(files)
		console.log(fields)
		var images = files.passport
		if(images == null){
			var idcard = ''
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
				var idcard = 'https://silvadelight.com.ng/images/'+timer +'.'+ ext1.toLowerCase(); 
			}catch(error){
				console.log(error)
				var idcard = ''
			}
		}
		var password = bcrypt.hashSync(fields.password[0], 8);
		var name = fields.surname[0]+'_'+fields.firstname[0]
		var username = name.toLowerCase()
		username = replacetext(username)
		var count = await connect.Login.count({ where: {username:{$iLike: username+'%'}}})
		if (count == 0) {
			username = username
				
		} else {
			username = username + '0' + count
				
		}
		var info = {username:username, surname:fields.surname[0], firstname:fields.firstname[0], middlename:fields.middlename[0], 
			admission_no:fields.admission_no[0], admission_year:emc.convertLocalDateToUTC(fields.admission_year[0]),
			gender:fields.gender[0], dob:emc.convertLocalDateToUTC(fields.dob[0]), religion:fields.religion[0], nationality:fields.nationality[0], address:fields.address[0], 
			city:fields.city[0], state:fields.state[0], country:fields.country[0], hobbies:fields.hobbies[0], ailment:fields.ailment[0], 
			disability:fields.disability[0], passport:idcard, guardian:fields.guardian[0], school_id:school_id, user_id:_id }
		console.log(info)
		var student = await connect.Student.create(info);

	})
}
exports.poststudent = async function (req, res) {
	var school_id = parseInt(emc.decrypt(req.payload.school))
	var _id = parseInt(emc.decrypt(req.payload._id))
    var form = new multiparty.Form();
	form.parse(req, async function(err, fields, files) {
        //console.log(files)
		//console.log(fields)
		var images = files.passport
		if(images == null){
			var idcard = ''
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
				var idcard = 'https://silvadelight.com.ng/images/'+timer +'.'+ ext1.toLowerCase(); 
			}catch(error){
				console.log(error)
				var idcard = ''
			}
		}
		var password = bcrypt.hashSync(fields.password[0], 8);
		var name = fields.surname[0]+'_'+fields.firstname[0]
		var username = name.toLowerCase()
		username = replacetext(username)
		var count = await connect.Login.count({ where: {username:{$iLike: username+'%'}}})
		if (count == 0) {
			username = username
				
		} else {
			username = username + '0' + count
				
		}
		var info = {username:username, surname:fields.surname[0], firstname:fields.firstname[0], middlename:fields.middlename[0], 
			admission_no:fields.admission_no[0], admission_year:emc.convertLocalDateToUTC(fields.admission_year[0]),
			gender:fields.gender[0], dob:emc.convertLocalDateToUTC(fields.dob[0]), religion:fields.religion[0], nationality:fields.nationality[0], address:fields.address[0], 
			city:fields.city[0], state:fields.state[0], country:fields.country[0], hobbies:fields.hobbies[0], ailment:fields.ailment[0], 
			disability:fields.disability[0], passport:idcard, guardian:fields.guardian[0], school_id:school_id, user_id:_id }
		console.log(info)
		var student = await connect.Student.create(info);
			var sess = {session_id:fields.academic_session[0], class_arm_id:fields.student_class[0], student_id:student.dataValues.id, term:fields.session_term[0], leave:0,
				school_id:school_id, user_id:_id}
		//console.log(sess)
		var a = await connect.AcademicSession.create(sess);
		var login = {student_id:student.dataValues.id, username:username, password:password, category:'Student', school_id:school_id, user_id:_id}
		console.log(login)
		var lo = await connect.Login.create(login);

		var name = ''
		var admission = fields.admission_no[0]
		if(admission.length == 0){}
		else{
			admission = admission.trim()
			admission = admission.split("/")
			var adds = []
			for(var s = 0; s < admission.length; s++){
				var d = replacetextlogin(admission[s])
				adds.push(d)					
			}
			adds = adds.join("")
			name = name+adds
			name = name.trim()
			//var password = emc.randomPassword()
			var enc_password = emc.encrypt(fields.password[0])
			var count = await connect.StudentLogin.count({where:{login_id:name}});
			if(count == 0){
				var log = await connect.StudentLogin.create({student_id:student.dataValues.id, 
				password:enc_password, login_id:name, school_id:school_id, user_id:_id});
			}
			else{
				name = name + count
				var log = await connect.StudentLogin.create({student_id:student.dataValues.id, 
				password:enc_password, login_id:name, school_id:school_id, user_id:_id});
			}		
		}
			
			
			
		res.send({status:'ok', msg:'Student register successful'})
	})
}


exports.updatestudent = async function (req, res) {
	var school_id = parseInt(emc.decrypt(req.payload.school))
	var _id = parseInt(emc.decrypt(req.payload._id))
    var form = new multiparty.Form();
	form.parse(req, async function(err, fields, files) {
		
			var file = {}
			var student = await connect.Student.findOne({where:{id:req.params.ref_id, school_id:school_id}});
			if(student){
				var info = {surname:fields.surname[0], firstname:fields.firstname[0], middlename:fields.middlename[0], 
					admission_no:fields.admission_no[0], admission_year:emc.convertLocalDateToUTC(fields.admission_year[0]),
					gender:fields.gender[0], dob:emc.convertLocalDateToUTC(fields.dob[0]), religion:fields.religion[0], nationality:fields.nationality[0], address:fields.address[0], 
					city:fields.city[0], state:fields.state[0], country:fields.country[0], hobbies:fields.hobbies[0], ailment:fields.ailment[0], 
					disability:fields.disability[0], user_id:_id }
				var images = files.passport
				if(images == null){}
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
						info.passport = 'https://silvadelight.com.ng/images/'+timer +'.'+ ext1.toLowerCase(); 
					}catch(error){
						console.log(error)
						
					}
				}
		
		
				console.log(info)
				var st = await connect.Student.update(info, {where:{id:student.id}});
					
				res.send({status:'ok', msg:'Student update successful'})
			}
			else{
				res.send({status:'error', msg:'Student not found!'})
			}
		
	})
}


exports.postguardian = async function (req, res) {
	var school_id = parseInt(emc.decrypt(req.payload.school))
	var _id = parseInt(emc.decrypt(req.payload._id))
    var form = new multiparty.Form();
	form.parse(req, async function(err, fields, files) {
        //console.log(files)
		//console.log(fields)
		var images = files.passport
		if(images == null){
			var idcard = ''
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
				var idcard = 'https://silvadelight.com.ng/images/'+timer +'.'+ ext1.toLowerCase(); 
			}catch(error){
				console.log(error)
				var idcard = ''
			}
		}
		var password = bcrypt.hashSync(fields.password[0], 8);
		var nm = fields.name[0]
		nm = nm.split(' ')
		var len = nm.length
		var name = nm[len - 1]
		var username = name.toLowerCase()
		username = replacetext(username)
		var count = await connect.Login.count({ where: {username:{$iLike: username+'%'}}})
		if (count == 0) {
			username = username
				
		} else {
			username = username + '0' + count
				
		}
		var info = {username:username, name:fields.name[0], phone:fields.phone[0], email:fields.email[0], occupation:fields.occupation[0],
			relationship:fields.relationship[0], address:fields.address[0], school_id:school_id, user_id:_id, passport:idcard }
		//console.log(info)
		var guard = await connect.Guardian.create(info);
			
		var login = {student_id:guard.dataValues.id, username:username, password:password, category:'Parent', school_id:school_id, user_id:_id}
		//console.log(login)
		var lo = await connect.Login.create(login);
		res.send({status:'ok', msg:'Guardian register successful', ref_id:guard.dataValues.id, guardian:guard.dataValues.name})
	})
}

exports.searchguardian = async function (req, res) {
	var school_id = parseInt(emc.decrypt(req.payload.school))
	var _id = parseInt(emc.decrypt(req.payload._id))
	//console.log(req.query)
	var re = req.query.info
	re = re.replace(/ +(?= )/g,'');
	var re_like = insertLike(re)
	//console.log(re_like)
	re = insertNum(re)
	re = re.split(' ').join(' | ');
	//console.log(re)
	var result = []
	connect.db.query('SELECT DISTINCT "Guardians".id FROM public."Guardians"\
		WHERE (to_tsvector("Guardians".name) @@ plainto_tsquery(\'english\',:q) OR to_tsvector("Guardians".phone)\
		 @@ plainto_tsquery(\'english\',:q) OR to_tsvector("Guardians".email) @@ plainto_tsquery(\'english\',:q) OR "Guardians".name ilike :q_like)' ,
	{ replacements: {q:re, q_like:re_like}, type: connect.db.QueryTypes.SELECT }).then(async function(d_count) {
			 //console.log(d_count)
		
		for(var i = 0; i < d_count.length; i++){
			var guard = await connect.Guardian.findOne({where:{id:d_count[i].id}});
			var file = {}
			file.name = guard.name
			file.phone = guard.phone
			file.email = guard.email
			file.occupation = guard.occupation
			file.relationship = guard.relationship
			file.ref_id = guard.id
			result.push(file)
			
		}
		//console.log(result)
		res.send(result)
	})
}


exports.getstudent = async function (req, res) {
	var school_id = parseInt(emc.decrypt(req.payload.school))
	var _id = parseInt(emc.decrypt(req.payload._id))
	var result = []
	if(req.query.student_type == 0)
	{
		//console.log('ok')
		var session = await connect.AcademicSession.findAll({where:{session_id:req.query.academic_session, class_arm_id:req.query.student_class, school_id:school_id}});
		//console.log(session)
		for(var i = 0; i < session.length; i++){
			var file = {}
			var cls_arm = await connect.ClassArm.findOne({where:{id:session[i].class_arm_id}});
			var cls = await connect.SchoolClass.findOne({where:{id:cls_arm.school_class_id}});
			var student = await connect.Student.findOne({where:{id:session[i].student_id}});
			var login = await connect.StudentLogin.findOne({where:{student_id:session[i].student_id, school_id:school_id}});
			file.name = student.surname+' '+student.middlename+' '+student.firstname
			file.admission_no = student.admission_no
			file.student_class = cls.name+' '+cls_arm.arm
			file.student_id = student.id
			file.student_academic = session[i].id
			file.admission_date = student.admission_year
			file.gender = student.gender
			if(!login){
				file.login_id = ''
				file.password = ''
			}
			else{
				file.login_id = login.login_id
				file.password = emc.decrypt(login.password)
			}
			result.push(file)
			
		}
		result.sort(emc.GetSortOrder('name'))
		//console.log(result)
		res.send(result)
	}
	else{
		res.send(result)
	}
}


exports.getacademicstudent = async function (req, res) {
	var school_id = parseInt(emc.decrypt(req.payload.school))
	var _id = parseInt(emc.decrypt(req.payload._id))
	var result = []
	
	var academic = await emc.getacademicsession(school_id)

	if(academic  == {}){}
	else{
		var sch_class = await connect.ClassArm.findAll({where: {school_id:school_id }, order:[['id', 'ASC']]});
		for(var s = 0; s < sch_class.length; s++){
			var session = await connect.AcademicSession.findAll({where:{session_id:academic.session_id, class_arm_id:sch_class[s].id, school_id:school_id}});
			var info = {}
			var cls = await connect.SchoolClass.findOne({where:{id:sch_class[s].school_class_id}});
			info.student_class = cls.name+' '+sch_class[s].arm
			info.student_class_id = sch_class[s].id
			var ress = []
			for(var i = 0; i < session.length; i++){
				var file = {}
				var student = await connect.Student.findOne({where:{id:session[i].student_id}});
				file.name = student.surname+' '+student.middlename+' '+student.firstname
				file.student_id = student.id
				ress.push(file)
				
			}
			ress.sort(emc.GetSortOrder('name'))
			info.student = ress
			result.push(info)
		}
		
		console.log(result)
		res.send(result)
	}
	
}


exports.postspecialoffer = async function (req, res) {
	var school_id = parseInt(emc.decrypt(req.payload.school))
	var _id = parseInt(emc.decrypt(req.payload._id))
	console.log(req.body)
	var academic = await emc.getacademicsession(school_id)
	if(academic  == {}){
		res.send({status:'error', msg:'Error academic session not found!'})
	}
	else{
		var ad = await connect.StudentBillTotal.findOne({where:{session_id:academic.session_id, term:academic.term, student_id:req.body.student, class_arm_id:req.body.student_class}});
		if(!ad){
		var info = await connect.StudentBillTotal.findOne({where:{session_id:academic.prev_session_id, term:academic.previous_term, student_id:req.body.student}});
		if(!info){}
		else{
			var file = {session_id:academic.session_id, term:academic.term, student_id:req.body.student, class_arm_id:req.body.student_class,
			fees_types_id:0, school_fees_id:0, fees_name:'Outstanding Bill',category:'outstanding',
					amount:info.balance, payment:0, weaver:0, fine:0, balance: info.balance, user_id:_id, school_id:school_id}
					console.log(file)
					
					var total = {session_id:academic.session_id, term:academic.term, student_id:req.body.student, class_arm_id:req.body.student_class,
						amount:info.balance, payment:0, weaver:0, fine:0,balance: info.balance, user_id:_id, school_id:school_id}
					console.log(total)
					var sch = await connect.StudentBill.create(file)
					var sch = await connect.StudentBillTotal.create(total)
			}
		}
			
		var file = {session_id:academic.session_id, term:academic.term, student_id:req.body.student, class_arm_id:req.body.student_class,
				fees_types_id:0, school_fees_id:0, fees_name:req.body.offer,category:'offer',
				amount:req.body.amount, payment:0, weaver:0, fine:0, balance: req.body.amount, user_id:_id, school_id:school_id}
		//console.log(file)
		var sch = await connect.StudentBill.create(file)
		var info = await connect.StudentBillTotal.findOne({where:{session_id:academic.session_id, term:academic.term, student_id:req.body.student, class_arm_id:req.body.student_class}});
		if(!info)
		{
			var total = {session_id:academic.session_id, term:academic.term, student_id:req.body.student, class_arm_id:req.body.student_class,
			amount:req.body.amount, payment:0, weaver:0, fine:0,balance: req.body.amount, user_id:_id, school_id:school_id}
			//console.log(total)
			var sch = await connect.StudentBillTotal.create(total)
		}
		else{
			var amt = math.chain(req.body.amount).add(info.amount).done()
			var bal = math.chain(req.body.amount).add(info.balance).done()
			var total = {amount:amt, balance: bal}
			//console.log(total)
			var sch = await connect.StudentBillTotal.update(total, {where:{id:info.id}})
		}
		res.send({status:'ok', msg:'Offer add successful!'})
		
	}
}


exports.getstudentfees = async function (req, res) {
	var school_id = parseInt(emc.decrypt(req.payload.school))
	var _id = parseInt(emc.decrypt(req.payload._id))
	var result = []
	if(req.query.category == 0){
		var info = await connect.StudentBillTotal.findAll({where:{session_id:req.query.academic_session, term:req.query.session_term, class_arm_id:req.query.student_class}});
	}
	if(req.query.category == 1){
		var info = await connect.StudentBillTotal.findAll({where:{session_id:req.query.academic_session, term:req.query.session_term, class_arm_id:req.query.student_class, balance:{$ne:'0'}}})
	}
	if(req.query.category == 2){
		var info = await connect.StudentBillTotal.findAll({where:{session_id:req.query.academic_session, term:req.query.session_term, class_arm_id:req.query.student_class,balance:'0'}});
	}
	var add_access = await emc.getuseraccess('Enter Student Payment', _id, school_id)
	var edit_access = await emc.getuseraccess('Edit Bill', _id, school_id)
	var view_access = await emc.getuseraccess('View Bill', _id, school_id)
	for(var i = 0; i < info.length; i++)
	{
		var file = {}
		file.amount = info[i].amount
		file.payment = info[i].payment
		file.balance = info[i].balance
		file.weaver = info[i].weaver
		file.fine = info[i].fine
		var cls_arm = await connect.ClassArm.findOne({where:{id:info[i].class_arm_id}});
		var cls = await connect.SchoolClass.findOne({where:{id:cls_arm.school_class_id}});
		var student = await connect.Student.findOne({where:{id:info[i].student_id}});
		var academic_session = await connect.AcademicSession.findOne({where:{student_id:student.id, session_id:info[i].session_id}});
		file.name = student.surname+' '+student.middlename+' '+student.firstname
		file.admission_no = student.admission_no
		file.student_class = cls.name+' '+cls_arm.arm
		file.student_id = info[i].student_id
		if(!academic_session){
		}
		else{
		file.student_academic = academic_session.id
		file.ref_id = info[i].id
		result.push(file)
		}
		
	}
	result.sort(emc.GetSortOrder('name'))
	//console.log(result)
	res.send({status:'ok', data:result, add:add_access, edit:edit_access, view:view_access})
}

exports.getstudentfeesbyid = async function (req, res) {
	var school_id = parseInt(emc.decrypt(req.payload.school))
	var _id = parseInt(emc.decrypt(req.payload._id))
	console.log(req.params.ref_id)
	var info = await connect.StudentBillTotal.findOne({where:{id:req.params.ref_id}});
	if(!info)
	{
		res.send({status:'error', msg:'Bill not found!'})
	}
	else{
		var file = {}
		file.amount = info.amount
		file.payment = info.payment
		file.balance = info.balance
		file.weaver = info.weaver
		file.fine = info.fine
		var bill = await connect.StudentBill.findAll({where:{session_id:info.session_id, term:info.term, student_id:info.student_id, class_arm_id:info.class_arm_id}});
		var cls_arm = await connect.ClassArm.findOne({where:{id:info.class_arm_id}});
		var cls = await connect.SchoolClass.findOne({where:{id:cls_arm.school_class_id}});
		var student = await connect.Student.findOne({where:{id:info.student_id}});
		var guardian = await connect.Guardian.findOne({where:{id:student.guardian}});
		file.name = student.surname+' '+student.middlename+' '+student.firstname
		var academic_session = await connect.AcademicSession.findOne({where:{student_id:student.id, session_id:info.session_id}});
		file.admission_no = student.admission_no
		file.student_class = cls.name+' '+cls_arm.arm
		file.student_id = info.student_id
		file.student_academic = academic_session.id
		file.passport = student.passport
		if(!guardian){
			file.guardian_name = ''
			file.guardian_phone = ''
		}
		else{
			file.guardian_name = guardian.name
			file.guardian_phone = guardian.phone
		}
		
		var result = []
		for(var i = 0; i < bill.length; i++){
			var op = {}
			op.amount = bill[i].amount
			op.payment = bill[i].payment
			op.balance = bill[i].balance
			op.weaver = bill[i].weaver
			op.fine = bill[i].fine
			op.ref_id = bill[i].id
			if(bill[i].fees_types_id == 0){
				op.fees = bill[i].fees_name
			}
			else{
				var fees = await connect.FeesType.findOne({where:{id:bill[i].fees_types_id}});
				op.fees = fees.name
			}
			result.push(op)
		}
		file.fees_info = result
		res.send({status:'ok', data:file})
	}
	//console.log(file)
	
}


exports.updatestudentfees = async function (req, res) {
	var school_id = parseInt(emc.decrypt(req.payload.school))
	var _id = parseInt(emc.decrypt(req.payload._id))
	console.log(req.params.ref_id)
	var info = await connect.StudentBillTotal.findOne({where:{id:req.params.ref_id}});
	if(!info)
	{
		res.send({status:'error', msg:'Bill not found!'})
	}
	else{
		var data = JSON.parse(req.body.info)
		//console.log(data)
		var amount = 0
		var weaver = 0
		var fine = 0
		var total = 0
		for(var i = 0; i < data.length; i++)
		{
			amount = math.chain(amount).add(data[i].amount).done()
			weaver = math.chain(weaver).add(data[i].weaver).done()
			fine = math.chain(fine).add(data[i].fine).done()
			var bill = await connect.StudentBill.findOne({where:{id:data[i].id}});
			if(!bill){}
			else{
				var bal = math.chain(data[i].amount).add(data[i].fine).subtract(data[i].weaver).subtract(data[i].payment).done()
				console.log(bal)
				var p = await connect.StudentBill.update({amount:data[i].amount, weaver:data[i].weaver, fine:data[i].fine, balance:bal},{where:{id:bill.id}});
			}
		}
		total = math.chain(amount).add(fine).subtract(weaver).done()
		var balance = math.chain(total).subtract(info.payment).done()
		var p = await connect.StudentBillTotal.update({amount:amount, weaver:weaver, fine:fine, balance:balance},{where:{id:info.id}});
		res.send({status:'ok', msg:'Student fees updated successful'})
	}
}


exports.poststudentfeess = async function (req, res) {
	var school_id = parseInt(emc.decrypt(req.payload.school))
	var _id = parseInt(emc.decrypt(req.payload._id))
	
	
				 


}
exports.poststudentfees = async function (req, res) {
	var school_id = parseInt(emc.decrypt(req.payload.school))
	var _id = parseInt(emc.decrypt(req.payload._id))
	console.log(req.params.ref_id)
	var info = await connect.StudentBillTotal.findOne({where:{id:req.params.ref_id}});
	if(!info)
	{
		res.send({status:'error', msg:'Bill not found!'})
	}
	else{
		var data = JSON.parse(req.body.info)
		console.log(data)
		var payment = 0
		var pay_hist = []
		for(var i = 0; i < data.length; i++)
		{
			
			var bill = await connect.StudentBill.findOne({where:{id:data[i].id}});
			if(!bill){}
			else{
				var pay = replacecomma(data[i].payment)
				payment = math.chain(payment).add(replacecomma(pay)).done()
				var bal = math.chain(bill.balance).subtract(pay).done()
				var t_pay = math.chain(bill.payment).add(pay).done()
				var f = {payment:t_pay, balance:bal}
				console.log(f)
				var b_h = {ref_id:bill.id, payment:pay, balance:bal, amount:replacecomma(data[i].amount), weaver:replacecomma(data[i].weaver), fine:replacecomma(data[i].fine),
					due:replacecomma(data[i].balance), fees:data[i].fees, prev_pay:bill.payment}
				//console.log(b_h)
				pay_hist.push(b_h)
				var p = await connect.StudentBill.update({payment:t_pay, balance:bal},{where:{id:bill.id}});
				
			}
			
		}
		var balance = math.chain(info.balance).subtract(payment).done()
		var t_pay = math.chain(info.payment).add(payment).done()
		var f = {payment:t_pay, balance:balance}
		//console.log(f)
		
		var b_h = {ref_id:info.id, payment:payment, prev_pay:info.payment, balance:balance, amount:info.amount, weaver:info.weaver, fine:info.fine, due:info.balance, bill:JSON.stringify(pay_hist), trans_date:new Date(), 
		session_id:info.session_id, student_id:info.student_id, class_arm_id:info.class_arm_id, term:info.term, school_id:school_id, user_id:_id, payment_type_id:req.body.category}
		//console.log(b_h)
		
		var p = await connect.StudentBillTotal.update({payment:t_pay, balance:balance},{where:{id:info.id}});
		var po = await connect.StudentBillPay.create(b_h);
		if(req.body.category == 1){
			var o = await connect.Cash.create({pay_id:po.dataValues.id, description:req.body.description, school_id:school_id, user_id:_id});
		}
		if(req.body.category == 2){
			var o = await connect.BankTeller.create({pay_id:po.dataValues.id, school_account_id:req.body.bank_account, description:req.body.description, school_id:school_id, user_id:_id,
				teller_no:req.body.teller_no, teller_date:req.body.teller_date});
		}
		if(req.body.category == 3){
			var o = await connect.BankTransfer.create({pay_id:po.dataValues.id, school_account_id:req.body.bank_account, description:req.body.description, school_id:school_id, user_id:_id,
				transfer_reference:req.body.transfer_reference, transfer_date:req.body.transfer_date});
		}
		if(req.body.category == 4){
			var o = await connect.BankCheck.create({pay_id:po.dataValues.id, check_account:req.body.check_account, description:req.body.description, school_id:school_id, user_id:_id,
				check_no:req.body.check_no, issuer_bank:req.body.issuer_bank, issuer_date:req.body.issuer_date});
		}
		if(req.body.category == 5){
			var o = await connect.PosPay.create({pay_id:po.dataValues.id, school_account_id:req.body.bank_account, description:req.body.description, school_id:school_id, user_id:_id,
				reference:req.body.reference, transaction_date:req.body.transaction_date,card_name:req.body.card_name, card_no:req.body.card_no});
		}
		var bill = await connect.StudentBillPay.findOne({where:{id:po.dataValues.id, school_id:school_id}});
		var pay = await connect.StudentBillTotal.findOne({where:{id:bill.ref_id, school_id:school_id}});
		var cls_arm = await connect.ClassArm.findOne({where:{id:pay.class_arm_id}});
		var cls = await connect.SchoolClass.findOne({where:{id:cls_arm.school_class_id}});
		var student = await connect.Student.findOne({where:{id:pay.student_id}});
		var session = await connect.Session.findOne({where:{id:pay.session_id}});
		var name = student.surname+' '+student.middlename+' '+student.firstname
		var student_class = cls.name+' '+cls_arm.arm
		var academic = pay.term +' '+session.name
		var receipt = math.chain(5933322).add(bill.id).done()
		var due = bill.balance
		var paid = bill.payment
		var trans_date = bill.trans_date

		var zone = await connect.School.findOne({where:{id:school_id}});

		var guardian = await connect.Guardian.findOne({where:{id:student.guardian}});
		if(!guardian){
			res.send({status:'ok', msg:'Student fees payment updated successful', ref_id:po.dataValues.id})
		}
		else{
			var check_email = emc.validateEmail(guardian.email)
			console.log(check_email)
			if(check_email){
				var context = {school_name:zone.name, date:moment(trans_date).format('DD/MM/YYYY'), receipt_id:receipt,
				student_name:name.toUpperCase(), student_class:student_class,session_info:academic,
				amount:paid, total:due, school_email:zone.email, school_address:'', school_phone:zone.phone, guardian_name:guardian.name}
				console.log(context)  
				templates.render(receipttemplates, context, async function(err, html, text) {
					//console.log(text)
					var sender = await transport.sendMail({
						from: context.school_name+' <no_reply@iconhallschools.com.ng>', // sender address
					to: guardian.email, // list of receivers
					subject: 'Your receipt from '+context.school_name+' #'+context.receipt_id, // Subject line
					html: html,
					text: text
					})
					if(sender.messageId){
						console.log(sender.messageId)
					}
					res.send({status:'ok', msg:'Student fees payment updated successful', ref_id:po.dataValues.id})

				})

			}
			else{
				res.send({status:'ok', msg:'Student fees payment updated successful', ref_id:po.dataValues.id})
			}
		}
		
	}
}

exports.getstudentfeespaymentbyid = async function (req, res) {
	var school_id = parseInt(emc.decrypt(req.payload.school))
	var _id = parseInt(emc.decrypt(req.payload._id))
	console.log(req.params.ref_id)
	var bill = await connect.StudentBillPay.findAll({where:{ref_id:req.params.ref_id, school_id:school_id}});
	var result = []
	for(var i = 0; i < bill.length; i++){
		var op = {}
		op.amount = math.chain(bill[i].amount).subtract(bill[i].weaver).add(bill[i].fine).done()
		op.prev_payment = bill[i].prev_pay
		op.balance = bill[i].balance
		op.due = bill[i].due
		op.paid = bill[i].payment
		op.ref_id = bill[i].id
		op.receipt = math.chain(5933322).add(bill[i].id).done()
		op.trans_date = bill[i].trans_date
		if(bill[i].payment_type_id == 1){
			op.payment_method  = 'Cash'
		}
		if(bill[i].payment_type_id == 2){
			op.payment_method  = 'Bank Teller'
		}
		if(bill[i].payment_type_id == 3){
			op.payment_method  = 'Bank Transfer'
		}
		if(bill[i].payment_type_id == 4){
			op.payment_method  = 'Bank Cheque'
		}
		if(bill[i].payment_type_id == 5){
			op.payment_method  = 'POS'
		}
		
		result.push(op)
	}
	//console.log(result)
	res.send(result)
}


exports.getstudentfeespaymentinvoice = async function (req, res) {
	var school_id = parseInt(emc.decrypt(req.payload.school))
	var _id = parseInt(emc.decrypt(req.payload._id))
	console.log(req.params.ref_id)
	var bill = await connect.StudentBillPay.findOne({where:{id:req.params.ref_id, school_id:school_id}});
	if(!bill){}
	else{
		var op = {}
		var pay = await connect.StudentBillTotal.findOne({where:{id:bill.ref_id, school_id:school_id}});
		var cls_arm = await connect.ClassArm.findOne({where:{id:pay.class_arm_id}});
		var cls = await connect.SchoolClass.findOne({where:{id:cls_arm.school_class_id}});
		var student = await connect.Student.findOne({where:{id:pay.student_id}});
		var session = await connect.Session.findOne({where:{id:pay.session_id}});
		op.name = student.surname+' '+student.middlename+' '+student.firstname
		var academic_session = await connect.AcademicSession.findOne({where:{student_id:student.id, session_id:bill.session_id}});
		op.admission_no = student.admission_no
		op.student_class = cls.name+' '+cls_arm.arm
		op.student_academic = academic_session.id
		op.student_id = student.id
		op.academic = pay.term +' '+session.name
		var user = await connect.User.findOne({where:{id:bill.user_id}});
		op.user = user.firstname +' '+user.lastname
		op.receipt = math.chain(5933322).add(bill.id).done()
		op.amount = bill.amount
		op.prev_payment = bill.prev_pay
		op.balance = bill.balance
		op.due = bill.due
		op.paid = bill.payment
		op.ref_id = bill.id
		op.trans_date = bill.trans_date
		op.bill_info = bill.bill
		if(bill.payment_type_id == 1){
			op.payment_method  = 'Cash'
			var o = await connect.Cash.findOne({where:{pay_id:bill.id,school_id:school_id}});
			if(!o){
				op.description = ''
			}
			else{
				op.description = o.description
			}
			
		}
		if(bill.payment_type_id == 2){
			op.payment_method  = 'Bank Teller'
			var o = await connect.BankTeller.findOne({where:{pay_id:bill.id,school_id:school_id}});
			if(!o){
				op.description = ''
				op.teller_no = ''
				op.teller_date = ''
				op.bank_account = ''
			}
			else{
				var acct = await connect.SchoolAccount.findOne({where:{id:o.school_account_id,school_id:school_id}});
				op.description = o.description
				op.teller_no = o.teller_no
				op.teller_date = o.teller_date
				op.bank_account = acct.bank +' - '+acct.account_no
			}
			
		
		}
		if(bill.payment_type_id == 3){
			op.payment_method  = 'Bank Transfer'
			var o = await connect.BankTransfer.findOne({where:{pay_id:bill.id,school_id:school_id}});
			if(!o){
				op.description = ''
				op.reference = ''
				op.trans_date = ''
				op.bank_account = ''
			}
			else{
				var acct = await connect.SchoolAccount.findOne({where:{id:o.school_account_id,school_id:school_id}});
				op.description = o.description
				op.reference = o.transfer_reference
				op.trans_date = o.transfer_date
				op.bank_account = acct.bank +' - '+acct.account_no
			}
		}
		if(bill.payment_type_id == 4){
			op.payment_method  = 'Bank Cheque'
			var o = await connect.BankCheck.findOne({where:{pay_id:bill.id,school_id:school_id}});
			if(!o){
				op.description = ''
				op.check_no = ''
				op.issuer_bank = ''
				op.issuer_date = ''
				op.check_account = ''
			}
			else{
				var acct = await connect.SchoolAccount.findOne({where:{id:o.school_account_id,school_id:school_id}});
				op.description = o.description
				op.check_account = o.check_account
				op.check_no = o.check_no
				op.issuer_bank = o.issuer_bank
				op.issuer_date = o.issuer_date
			}
		}
		if(bill.payment_type_id == 5){
			op.payment_method  = 'POS'
			var o = await connect.PosPay.findOne({where:{pay_id:bill.id,school_id:school_id}});
			if(!o){
				op.description = ''
				op.card_name = ''
				op.card_no = ''
				op.reference = ''
				op.bank_account = ''
				op.transaction_date = ''
			}
			else{
				var acct = await connect.SchoolAccount.findOne({where:{id:o.school_account_id,school_id:school_id}});
				op.description = o.description
				op.card_name = o.card_name
				op.card_no = o.card_no
				op.reference = o.reference
				op.transaction_date = o.transaction_date
				op.bank_account = acct.bank +' - '+acct.account_no
			}
		}
		
		res.send({status:'ok', data:op})
	}
	
}

exports.getpaymenthistory = async function (req, res) {
	var school_id = parseInt(emc.decrypt(req.payload.school))
	var _id = parseInt(emc.decrypt(req.payload._id))
	console.log(req.query)
	var query = {school_id:school_id}
	var go = false
	if(req.query.academic_session == '' || req.query.academic_session == 'Any')
	{}
	else{
		query.session_id = req.query.academic_session
		go = true
	}
	if(req.query.session_term == '' || req.query.session_term == 'Any')
	{}
	else{
		query.term = req.query.session_term
	}
	if(req.query.student_class == '' || req.query.student_class == 'Any')
	{}
	else{
		query.class_arm_id = req.query.student_class
	}
	console.log(query)
	if(go == false){
		var s_dt = moment(new Date(req.query.first_start).setHours(0,0,0,0)).format()
		var e_dt = moment(new Date(req.query.first_end).setHours(24,0,0,0)).format()
		query.created_at = { between: [s_dt, e_dt] }
		//console.log(query)
		var info = await connect.StudentBillPay.findAll({where: query});
		//console.log(sch_class.length)
	}
	else{
		var info = await connect.StudentBillPay.findAll({where: query, order:[['id', 'ASC']]});
		//console.log(sch_class.length)
		
	}
	var result = []
	for(var i = 0; i < info.length; i++)
	{
		var bill = info[i]
		var file = {}
		file.due = bill.due
		file.payment = bill.payment
		file.balance = bill.balance
		var pay = await connect.StudentBillTotal.findOne({where:{id:bill.ref_id, school_id:school_id}});
		var cls_arm = await connect.ClassArm.findOne({where:{id:pay.class_arm_id}});
		var cls = await connect.SchoolClass.findOne({where:{id:cls_arm.school_class_id}});
		var student = await connect.Student.findOne({where:{id:pay.student_id}});
		var session = await connect.Session.findOne({where:{id:pay.session_id}});
		var academic_session = await connect.AcademicSession.findOne({where:{student_id:student.id, session_id:bill.session_id}});
		file.name = student.surname+' '+student.middlename+' '+student.firstname
		file.admission_no = student.admission_no
		file.student_id = student.id
		file.student_class = cls.name+' '+cls_arm.arm
		file.academic = pay.term +' '+session.name
		var user = await connect.User.findOne({where:{id:bill.user_id}});
		file.user = user.firstname +' '+user.lastname
		file.receipt = math.chain(5933322).add(bill.id).done()
		file.ref_id = bill.id
		file.student_academic = academic_session.id
		file.amount = math.chain(bill.amount).subtract(bill.weaver).add(bill.fine).done()
		file.prev_payment = bill.prev_pay
		file.trans_date = bill.trans_date
		if(bill.payment_type_id == 1){
			file.payment_method  = 'Cash'
		}
		if(bill.payment_type_id == 2){
			file.payment_method  = 'Bank Teller'
		}
		if(bill.payment_type_id == 3){
			file.payment_method  = 'Bank Transfer'
		}
		if(bill.payment_type_id == 4){
			file.payment_method  = 'Bank Cheque'
		}
		if(bill.payment_type_id == 5){
			file.payment_method  = 'POS'
		}
		
		console.log(file)
		result.push(file)
	}
	res.send(result)
	
}


exports.getfeesreports = async function (req, res) {
	var school_id = parseInt(emc.decrypt(req.payload.school))
	var _id = parseInt(emc.decrypt(req.payload._id))
	console.log(req.query)
	var query = {school_id:school_id}
	var go = false
	if(req.query.fees_type == 'outstanding')
	{
		query.category = 'outstanding'
	}
	else if(req.query.fees_type == 'offer'){
		query.category = 'offer'
	}
	else{
		query.fees_types_id = req.query.fees_type
	}
	if(req.query.academic_session == '' || req.query.academic_session == 'Any')
	{}
	else{
		query.session_id = req.query.academic_session
		go = true
	}
	if(req.query.session_term == '' || req.query.session_term == 'Any')
	{}
	else{
		query.term = req.query.session_term
	}
	if(req.query.student_class == '' || req.query.student_class == 'Any')
	{}
	else{
		query.class_arm_id = req.query.student_class
	}
	console.log(query)
	var info = await connect.StudentBill.findAll({where: query, order:[['id', 'ASC']]});
	var result = []
	for(var i = 0; i < info.length; i++)
	{
		var bill = info[i]
		var file = {}
		file.payment = bill.payment
		file.balance = bill.balance
		file.amount =bill.amount
		file.fees = bill.fees_name
		file.weaver = bill.weaver
		file.fine = bill.fine
		var cls_arm = await connect.ClassArm.findOne({where:{id:bill.class_arm_id}});
		var cls = await connect.SchoolClass.findOne({where:{id:cls_arm.school_class_id}});
		var student = await connect.Student.findOne({where:{id:bill.student_id}});
		var session = await connect.Session.findOne({where:{id:bill.session_id}});
		file.name = student.surname+' '+student.middlename+' '+student.firstname
		file.student_id = student.id
		file.admission_no = student.admission_no
		file.student_class = cls.name+' '+cls_arm.arm
		file.academic = bill.term +' '+session.name
		var user = await connect.User.findOne({where:{id:bill.user_id}});
		
		
		console.log(file)
		result.push(file)
	}
	res.send(result)

	
	
}


exports.getstudentdetail = async function (req, res) {
	var school_id = parseInt(emc.decrypt(req.payload.school))
	var _id = parseInt(emc.decrypt(req.payload._id))
	var academic = await emc.getacademicsession(school_id)
	var student = await connect.Student.findOne({where:{id:req.params.ref_id, school_id:school_id}});		
	if(!student){
		res.send({status:'ok', msg:'Student not found'})
	}
	else{
		var file = {}
		var academic_session = await connect.AcademicSession.findOne({where:{student_id:req.params.ref_id}, order:[['session_id', 'DESC']]});
		var cls_arm = await connect.ClassArm.findOne({where:{id:academic_session.class_arm_id}});
		var cls = await connect.SchoolClass.findOne({where:{id:cls_arm.school_class_id}});
		var session = await connect.Session.findOne({where:{id:academic_session.session_id}});
		var guardian = await connect.Guardian.findOne({where:{id:student.guardian}});
		file.name = student.surname+' '+student.middlename+' '+student.firstname
		file.surname = student.surname
		file.middlename = student.middlename
		file.firstname = student.firstname
		file.student_id = student.id
		file.admission_no = student.admission_no
		file.student_class = cls.name+' '+cls_arm.arm
		file.session = session.name
		file.session_id = academic_session.id
		file.admission_date = student.admission_year
		file.gender = student.gender
		file.dob = student.dob
		file.religion = student.religion
		file.passport = student.passport
		file.address = student.address
		file.nationality = student.nationality
		file.city = student.city
		file.state = student.state
		file.country = student.country
		file.hobbies = student.hobbies
		file.ailment = student.ailment
		file.disability = student.disability
		var edit_student = await emc.getuseraccess('Edit Student', _id, school_id)
		var edit_student_class = await emc.getuseraccess('Edit Student Class', _id, school_id)
		var edit_student_session = await emc.getuseraccess('Edit Student Session', _id, school_id)
		var edit_student_subject = await emc.getuseraccess('Edit Student Subject', _id, school_id)

		var acad = await connect.AcademicSession.findAll({where:{student_id:req.params.ref_id}});
		var reps = []
		for(let p = 0; p < acad.length; p++){
			var reportcard_publish = await connect.ReportCard.findAll({where:{session_id:acad[p].session_id,
				class_arm_id:acad[p].class_arm_id}})
	
			for(let j = 0; j < reportcard_publish.length; j++){
				var ses = await connect.Session.findOne({where:{id:acad[p].session_id}});
				var cls_arms = await connect.ClassArm.findOne({where:{id:acad[p].class_arm_id}});
					var clss = await connect.SchoolClass.findOne({where:{id:cls_arms.school_class_id}});
				reps.push({ref_id:acad[p].id,
					 term:reportcard_publish[j].term, session:ses.name, class_arm:clss.name+' '+cls_arms.arm})
			
			}
		}
		
		//console.log(reps)
		file.reportcard = reps
		
		//var reportcard = {ref_id:academic_session.id, term:'Second Term', session:academic.session, class_arm:cls.name+' '+cls_arm.arm}
		//file.reportcard = reportcard

		
		file.due = 0
		var tm = ['Third Term', 'Second Term', 'First Term']
		for(let r = 0; r < tm.length; r++){
			var pay = await connect.StudentBillTotal.findOne({where:{student_id:student.id, school_id:school_id,
				session_id:academic.session_id, term:tm[r]}});
			if(!pay){}
			else{
				file.due = pay.balance
				break
			}
		
		}
		if(academic_session.leave == 0){
			file.status = 'Active'
		}
		else{
			file.status = 'Not Active'
		}
		if(!guardian){
			file.guardian_name = ''
			file.guardian_phone = ''
			file.guardian_email = ''
			file.guardian_occupation = ''
			file.guardian_relationship = ''
			file.guardian_address = ''
			file.guardian_passport = ''
		}
		else{
			file.guardian_name = guardian.name
			file.guardian_phone = guardian.phone
			file.guardian_email = guardian.email
			file.guardian_occupation = guardian.occupation
			file.guardian_relationship = guardian.relationship
			file.guardian_address = guardian.address
			file.guardian_passport = guardian.passport
		}
		//console.log(file)
		res.send({status:'ok', data:file, access:{edit_student:edit_student, edit_student_class:edit_student_class, 
			edit_student_session:edit_student_session, edit_student_subject:edit_student_subject}})
	}
}

exports.updatestudentclass = async function (req, res) {
	var school_id = parseInt(emc.decrypt(req.payload.school))
	var _id = parseInt(emc.decrypt(req.payload._id))
	console.log(req.body)
	var academic_session = await connect.AcademicSession.findOne({where:{id:req.params.ref_id}, order:[['session_id', 'DESC']]});
	if(!academic_session){
		res.send({status:'ok', msg:'Student not found'})
	}
	else{
		var sch = await connect.StudentBill.update({class_arm_id:req.body.sch_class}, {where:{session_id:academic_session.session_id, student_id:academic_session.student_id}})
		var sch = await connect.StudentBillTotal.update({class_arm_id:req.body.sch_class}, {where:{session_id:academic_session.session_id, student_id:academic_session.student_id}})
		var sch = await connect.StudentBillPay.update({class_arm_id:req.body.sch_class}, {where:{session_id:academic_session.session_id, student_id:academic_session.student_id}})
		var sch = await connect.AcademicSession.update({class_arm_id:req.body.sch_class}, {where:{id:academic_session.id}})
		res.send({status:'ok', msg:'Class update successful!'})
	}
}

exports.getfeesanalysis = async function (req, res) {
	var start_week = moment().startOf('week')
	var end_week = moment().startOf('week')
	var school_id = parseInt(emc.decrypt(req.payload.school))
	var _id = parseInt(emc.decrypt(req.payload._id))
	console.log(req.query)
	var result = []
	var query = {school_id:school_id}
	if(!req.query.session){
		console.log('not set')
		var academic_session = await emc.getacademicsession(school_id)
		if(!academic_session){
		}
		else{
			query.session_id = academic_session.session_id
			query.term = academic_session.term
		}
	}
	else{
		query.session_id = req.query.session
		query.term = req.query.term
	}
	console.log(query)
	var total_amt = 0
	var total_payment = 0
	var total_balance = 0
	var percentage = 0
	
	var total_amt_pre = 0
	var total_payment_pre = 0
	var total_balance_pre = 0
	var percentage_pre = 0
	
	var total_amt_primary = 0
	var total_payment_primary = 0
	var total_balance_primary = 0
	var percentage_primary = 0
	
	var total_amt_secondary = 0
	var total_payment_secondary = 0
	var total_balance_secondary = 0
	var percentage_secondary = 0
	var preprimary = []
	var sch_class = await connect.SchoolClass.findAll({where: {title:'Pre-Primary'}, order:[['id', 'ASC']]});
	for(var i = 0; i < sch_class.length; i++)
	{
		var class_arm = await connect.ClassArm.findAll({where: {school_class_id:sch_class[i].id}, order:[['id', 'ASC']]});
		var file  = {}
		file.sch_class = sch_class[i].name
		var total = 0
		var payment = 0
		var balance = 0
		for(var s = 0; s < class_arm.length; s++){
			query.class_arm_id = class_arm[s].id
			var bill = await connect.StudentBillTotal.findAll({where: query, order:[['id', 'ASC']]});
			for(var p = 0; p < bill.length; p++){
				var bills = bill[p]
				total = math.chain(total).add(bills.amount).subtract(bills.weaver).add(bills.fine).done()
				payment = math.chain(payment).add(bills.payment).done()
				balance = math.chain(balance).add(bills.balance).done()
				
			}
		}
		file.total = total
		file.payment = payment
		file.balance = balance
		if(parseInt(total) == 0)
		{}
		else{
			var per = math.chain(payment).divide(total).multiply(100).done()
			file.percentage = per.toFixed(2)+'%'
			preprimary.push(file)
		}
		
		
		total_amt = math.chain(total_amt).add(total).done()
		total_payment  = math.chain(total_payment).add(payment).done()
		total_balance = math.chain(total_balance).add(balance).done()
	}
	
	var primary = []
	var sch_class = await connect.SchoolClass.findAll({where: {title:'Primary'}, order:[['id', 'ASC']]});
	for(var i = 0; i < sch_class.length; i++)
	{
		var class_arm = await connect.ClassArm.findAll({where: {school_class_id:sch_class[i].id}, order:[['id', 'ASC']]});
		var file  = {}
		file.sch_class = sch_class[i].name
		var total = 0
		var payment = 0
		var balance = 0
		for(var s = 0; s < class_arm.length; s++){
			query.class_arm_id = class_arm[s].id
			var bill = await connect.StudentBillTotal.findAll({where: query, order:[['id', 'ASC']]});
			for(var p = 0; p < bill.length; p++){
				var bills = bill[p]
				total = math.chain(total).add(bills.amount).subtract(bills.weaver).add(bills.fine).done()
				payment = math.chain(payment).add(bills.payment).done()
				balance = math.chain(balance).add(bills.balance).done()
				
			}
		}
		file.total = total
		file.payment = payment
		file.balance = balance
		if(parseInt(total) == 0)
		{}
		else{
			var per = math.chain(payment).divide(total).multiply(100).done()
			file.percentage = per.toFixed(2)+'%'
			primary.push(file)
		}
		
		total_amt = math.chain(total_amt).add(total).done()
		total_payment  = math.chain(total_payment).add(payment).done()
		total_balance = math.chain(total_balance).add(balance).done()
	}
	
	var secondary = []
	var sch_class = await connect.SchoolClass.findAll({where: {title:'Secondary'}, order:[['id', 'ASC']]});
	for(var i = 0; i < sch_class.length; i++)
	{
		var class_arm = await connect.ClassArm.findAll({where: {school_class_id:sch_class[i].id}, order:[['id', 'ASC']]});
		var file  = {}
		file.sch_class = sch_class[i].name
		var total = 0
		var payment = 0
		var balance = 0
		for(var s = 0; s < class_arm.length; s++){
			query.class_arm_id = class_arm[s].id
			var bill = await connect.StudentBillTotal.findAll({where: query, order:[['id', 'ASC']]});
			for(var p = 0; p < bill.length; p++){
				var bills = bill[p]
				total = math.chain(total).add(bills.amount).subtract(bills.weaver).add(bills.fine).done()
				payment = math.chain(payment).add(bills.payment).done()
				balance = math.chain(balance).add(bills.balance).done()
				
			}
		}
		file.total = total
		file.payment = payment
		file.balance = balance
		if(parseInt(total) == 0)
		{}
		else{
			var per = math.chain(payment).divide(total).multiply(100).done()
			file.percentage = per.toFixed(2)+'%'
			secondary.push(file)
		}
		
		
		total_amt = math.chain(total_amt).add(total).done()
		total_payment  = math.chain(total_payment).add(payment).done()
		total_balance = math.chain(total_balance).add(balance).done()
	}
	var other = []
	var sch_class = await connect.SchoolClass.findAll({where: {title:'others'}, order:[['id', 'ASC']]});
	for(var i = 0; i < sch_class.length; i++)
	{
		var class_arm = await connect.ClassArm.findAll({where: {school_class_id:sch_class[i].id}, order:[['id', 'ASC']]});
		var file  = {}
		file.sch_class = sch_class[i].name
		var total = 0
		var payment = 0
		var balance = 0
		for(var s = 0; s < class_arm.length; s++){
			query.class_arm_id = class_arm[s].id
			var bill = await connect.StudentBillTotal.findAll({where: query, order:[['id', 'ASC']]});
			for(var p = 0; p < bill.length; p++){
				var bills = bill[p]
				total = math.chain(total).add(bills.amount).subtract(bills.weaver).add(bills.fine).done()
				payment = math.chain(payment).add(bills.payment).done()
				balance = math.chain(balance).add(bills.balance).done()
				
			}
		}
		file.total = total
		file.payment = payment
		file.balance = balance
		if(parseInt(total) == 0)
		{}
		else{
			var per = math.chain(payment).divide(total).multiply(100).done()
			file.percentage = per.toFixed(2)+'%'
			other.push(file)
		}
		
		
		total_amt = math.chain(total_amt).add(total).done()
		total_payment  = math.chain(total_payment).add(payment).done()
		total_balance = math.chain(total_balance).add(balance).done()
	}
	//console.log(preprimary)
	//console.log(primary)
	//console.log(secondary)
	//console.log(other)
	if(parseInt(total_amt) == 0)
	{
		var percentage = ''
	}
	else{
		var per = math.chain(total_payment).divide(total_amt).multiply(100).done()
		var percentage = per.toFixed(2)+'%'
	}
	//console.log(total_amt)
	//console.log(total_payment)
	//console.log(total_balance)
	//console.log(percentage)
	res.send({status:'ok', amount:total_amt, payment:total_payment, balance:total_balance, percentage:percentage, preprimary:JSON.stringify(preprimary),
		primary:JSON.stringify(primary), secondary:JSON.stringify(secondary), other:JSON.stringify(other)})
}



exports.getfeeshomeanalysis = async function (req, res) {
	var start_week = moment().startOf('week').format()
	var end_week = moment().startOf('week').format()
	var school_id = parseInt(emc.decrypt(req.payload.school))
	var _id = parseInt(emc.decrypt(req.payload._id))
	console.log(req.query)
	var result = []
	var query = {school_id:school_id}
	if(!req.query.session){
		console.log('not set')
		var academic_session = await emc.getacademicsession(school_id)
		if(!academic_session){
		}
		else{
			query.session_id = academic_session.session_id
			query.term = academic_session.term
		}
	}
	else{
		query.session_id = req.query.session
		query.term = req.query.term
	}
	console.log(query)
	var total_amt = 0
	var total_payment = 0
	var total_balance = 0
	var percentage = 0
	
	
	var preprimary = []
	var sch_class = await connect.SchoolClass.findAll({});
	for(let i = 0; i < sch_class.length; i++)
	{
		var class_arm = await connect.ClassArm.findAll({where: {school_class_id:sch_class[i].id}, order:[['id', 'ASC']]});
		var file  = {}
		file.sch_class = sch_class[i].name
		var total = 0
		var payment = 0
		var balance = 0
		for(var s = 0; s < class_arm.length; s++){
			query.class_arm_id = class_arm[s].id
			var bill = await connect.StudentBillTotal.findAll({where: query, order:[['id', 'ASC']]});
			for(var p = 0; p < bill.length; p++){
				var bills = bill[p]
				total = math.chain(total).add(bills.amount).subtract(bills.weaver).add(bills.fine).done()
				payment = math.chain(payment).add(bills.payment).done()
				balance = math.chain(balance).add(bills.balance).done()
				
			}
		}
		file.total = total
		file.payment = payment
		file.balance = balance
		if(parseInt(total) == 0)
		{}
		else{
			var per = math.chain(payment).divide(total).multiply(100).done()
			file.percentage = per.toFixed(2)+'%'
			preprimary.push(file)
		}
		
		
		total_amt = math.chain(total_amt).add(total).done()
		total_payment  = math.chain(total_payment).add(payment).done()
		total_balance = math.chain(total_balance).add(balance).done()
	}
	
	

	if(parseInt(total_amt) == 0)
	{
		var percentage = ''
	}
	else{
		var per = math.chain(total_payment).divide(total_amt).multiply(100).done()
		var percentage = per.toFixed(2)+'%'
	}
	
	var s_dt = moment(new Date(start_week).setHours(0,0,0,0)).format()
	var e_dt = moment(new Date(end_week).setHours(24,0,0,0)).format()
	
	var info = await connect.StudentBillPay.findAll({where: {created_at:{ between: [s_dt, e_dt] }}});
	var week_payment = 0
	
	for(let i = 0; i < info.length; i++){
		week_payment = math.chain(week_payment).add(info[i].payment).done()
	}
	res.send({status:'ok', amount:total_amt, payment:total_payment, balance:total_balance, percentage:percentage, week_payment:week_payment})
}

exports.getstudentsummary = async function (req, res) {
	var school_id = parseInt(emc.decrypt(req.payload.school))
	var _id = parseInt(emc.decrypt(req.payload._id))
	var result = []
	var query = {school_id:school_id}
	if(!req.query.session){
		console.log('not set')
		var academic_session = await emc.getacademicsession(school_id)
		if(!academic_session){}
		else{
			query.session_id = academic_session.session_id
		}
	}
	console.log(query)
	var withdraw = 0
	var male = 0
	var female = 0
	var total = 0
	var pre_primary = await connect.SchoolClass.findAll({where: {title:'Pre-Primary'}, order:[['id', 'ASC']]});
	var primary = await connect.SchoolClass.findAll({where: {title:'Primary'}, order:[['id', 'ASC']]});
	var secondary = await connect.SchoolClass.findAll({where: {title:'Secondary'}, order:[['id', 'ASC']]});
	var others = await connect.SchoolClass.findAll({where: {title:'others'}, order:[['id', 'ASC']]});
	
	for(let s = 0; s < pre_primary.length; s++){
		var class_arm = await connect.ClassArm.findAll({where: {school_class_id:pre_primary[s].id}, order:[['id', 'ASC']]});
		var file  = {}
		file.sch_class = pre_primary[s].name
		var class_female = 0
		var class_male = 0
		var class_total = 0
		var class_withdraw = 0
		for(let p = 0; p < class_arm.length; p++){
			var session = await connect.AcademicSession.findAll({where:{...query, class_arm_id:class_arm[p].id}});
			for(let i = 0; i < session.length; i++){
				if(session[i].leave == 0){
					total += 1
					class_total += 1
					var student = await connect.Student.findOne({where:{id:session[i].student_id}});
					if(student.gender == "Male"){
						male += 1
						class_male += 1
					}
					else{
						female += 1
						class_female += 1
					}
				}
				else{
					withdraw += 1
					class_withdraw += 1
				}
			}

		}
		file.female = class_female
		file.male = class_male
		file.withdraw = class_withdraw
		file.total = class_total
		if(class_total > 0){
			result.push(file)
		}
		

	}

	for(let s = 0; s < primary.length; s++){
		var class_arm = await connect.ClassArm.findAll({where: {school_class_id:primary[s].id}, order:[['id', 'ASC']]});
		var file  = {}
		file.sch_class = primary[s].name
		var class_female = 0
		var class_male = 0
		var class_total = 0
		var class_withdraw = 0
		for(let p = 0; p < class_arm.length; p++){
			var session = await connect.AcademicSession.findAll({where:{...query, class_arm_id:class_arm[p].id}});
			for(let i = 0; i < session.length; i++){
				if(session[i].leave == 0){
					total += 1
					class_total += 1
					var student = await connect.Student.findOne({where:{id:session[i].student_id}});
					if(student.gender == "Male"){
						male += 1
						class_male += 1
					}
					else{
						female += 1
						class_female += 1
					}
				}
				else{
					withdraw += 1
					class_withdraw += 1
				}
			}

		}
		file.female = class_female
		file.male = class_male
		file.withdraw = class_withdraw
		file.total = class_total
		if(class_total > 0){
			result.push(file)
		}
	}

	for(let s = 0; s < secondary.length; s++){
		var class_arm = await connect.ClassArm.findAll({where: {school_class_id:secondary[s].id}, order:[['id', 'ASC']]});
		var file  = {}
		file.sch_class = secondary[s].name
		var class_female = 0
		var class_male = 0
		var class_total = 0
		var class_withdraw = 0
		for(let p = 0; p < class_arm.length; p++){
			var session = await connect.AcademicSession.findAll({where:{...query, class_arm_id:class_arm[p].id}});
			for(let i = 0; i < session.length; i++){
				if(session[i].leave == 0){
					total += 1
					class_total += 1
					var student = await connect.Student.findOne({where:{id:session[i].student_id}});
					if(student.gender == "Male"){
						male += 1
						class_male += 1
					}
					else{
						female += 1
						class_female += 1
					}
				}
				else{
					withdraw += 1
					class_withdraw += 1
				}
			}

		}
		file.female = class_female
		file.male = class_male
		file.withdraw = class_withdraw
		file.total = class_total
		if(class_total > 0){
			result.push(file)
		}

	}

	for(let s = 0; s < others.length; s++){
		var class_arm = await connect.ClassArm.findAll({where: {school_class_id:others[s].id}, order:[['id', 'ASC']]});
		var file  = {}
		file.sch_class = others[s].name
		var class_female = 0
		var class_male = 0
		var class_total = 0
		var class_withdraw = 0
		for(let p = 0; p < class_arm.length; p++){
			var session = await connect.AcademicSession.findAll({where:{...query, class_arm_id:class_arm[p].id}});
			for(let i = 0; i < session.length; i++){
				if(session[i].leave == 0){
					total += 1
					class_total += 1
					var student = await connect.Student.findOne({where:{id:session[i].student_id}});
					if(student.gender == "Male"){
						male += 1
						class_male += 1
					}
					else{
						female += 1
						class_female += 1
					}
				}
				else{
					withdraw += 1
					class_withdraw += 1
				}
			}

		}
		file.female = class_female
		file.male = class_male
		file.withdraw = class_withdraw
		file.total = class_total
		if(class_total > 0){
			result.push(file)
		}

	}
	//console.log(result)
	
	res.send({male, female, withdraw, total, student:JSON.stringify(result)})

}
exports.generatelogin = async function (req, res) {
	var school_id = parseInt(emc.decrypt(req.payload.school))
	var _id = parseInt(emc.decrypt(req.payload._id))
	var result = []
	if(req.query.student_type == 0)
	{
		//console.log('ok')
		var session = await connect.AcademicSession.findAll({where:{session_id:req.query.academic_session, class_arm_id:req.query.student_class, school_id:school_id}});
		//console.log(session)
		for(var i = 0; i < session.length; i++){
			var file = {}
			var student = await connect.Student.findOne({where:{id:session[i].student_id}});
			var name = student.surname+'_'+student.firstname
			var username = name.toLowerCase()
			username = replacetext(username)
			var count = await connect.StudentLogin.count({ where: {login_id:{$iLike: username+'%'}}})
			if (count == 0) {
				username = username
					
			} else {
				username = username + '_0' + count
					
			}
			var login = await connect.StudentLogin.findOne({where:{student_id:session[i].student_id, school_id:school_id}});
			file.name = student.surname+' '+student.middlename+' '+student.firstname
			var password = emc.randomPassword()
			var enc_password = emc.encrypt(password)
			if(!login){
				//var name = ''
				
				
				var log = await connect.StudentLogin.create({student_id:session[i].student_id, 
						password:enc_password, login_id:username, school_id:school_id, user_id:_id});

			}
			else{
				//var log = await connect.StudentLogin.update({password:enc_password}, {where:{id:login.id}});				
			}
			
			
		}
		result.sort(emc.GetSortOrder('name'))
		//console.log(result)
		//res.send(result)
		res.send({status:'ok'})
	}
	else{
		res.send(result)
	}
}



exports.getstudentinfo = async function (req, res) {
	console.log('student info')
	var school_id = parseInt(emc.decrypt(req.payload.school))
	var _id = parseInt(emc.decrypt(req.payload._id))

	
	var academic = await studentsessioninfo(req.params.ref_id, school_id)
	//console.log('Academic: '+JSON.stringify(academic))
	var academic_session = await connect.AcademicSession.findOne({where:{student_id:req.params.ref_id, session_id:academic.session_id}});
	//console.log('Academc session '+JSON.stringify(academic))
	if(!academic_session){
		res.send({status:'ok', msg:'Student not found'})
	}
	else{
		var file = {}

		
		var student = await connect.Student.findOne({where:{id:academic_session.student_id, school_id:school_id}});
		var cls_arm = await connect.ClassArm.findOne({where:{id:academic_session.class_arm_id}});
		var cls = await connect.SchoolClass.findOne({where:{id:cls_arm.school_class_id}});
		var session = await connect.Session.findOne({where:{id:academic_session.session_id}});
		var guardian = await connect.Guardian.findOne({where:{id:student.guardian}});
		var reportcard_publish = await connect.ReportCard.findAll({where:{session_id:academic_session.session_id,
			 class_arm_id:academic_session.class_arm_id, release:true}})
		
		
		file.name = student.surname+' '+student.middlename+' '+student.firstname
		file.surname = student.surname
		file.middlename = student.middlename
		file.firstname = student.firstname
		file.student_id = student.id
		file.admission_no = student.admission_no
		file.student_class = cls.name+' '+cls_arm.arm
		file.session = session.name
		file.admission_date = student.admission_year
		file.gender = student.gender
		file.dob = student.dob
		file.religion = student.religion
		file.passport = student.passport
		file.address = student.address
		file.nationality = student.nationality
		file.city = student.city
		file.state = student.state
		file.country = student.country
		file.hobbies = student.hobbies
		file.ailment = student.ailment
		file.disability = student.disability
		var reps = []
		var acad = await connect.AcademicSession.findAll({where:{student_id:req.params.ref_id}});
		var reps = []
		for(let p = 0; p < acad.length; p++){
			var reportcard_publish = await connect.ReportCard.findAll({where:{session_id:acad[p].session_id,
				class_arm_id:acad[p].class_arm_id, release:true}})
	
			for(let j = 0; j < reportcard_publish.length; j++){
				var accessment = await connect.StudentAssessment.findOne({where:{term:reportcard_publish[j].term, academic_session_id:acad[p].id}});
				if(!accessment){}
				else{
					var student_release = await connect.StudentReportCard.findOne({where:{term:reportcard_publish[j].term,
						academic_session_id:acad[p].id}});
					if(student_release){
						if(student_release.release == true){
							var ses = await connect.Session.findOne({where:{id:acad[p].session_id}});
					var cls_arms = await connect.ClassArm.findOne({where:{id:acad[p].class_arm_id}});
					var clss = await connect.SchoolClass.findOne({where:{id:cls_arms.school_class_id}});
				reps.push({ref_id:acad[p].id,
					 term:reportcard_publish[j].term, session:ses.name, class_arm:clss.name+' '+cls_arms.arm})					
						}
					}
					else{

						var ses = await connect.Session.findOne({where:{id:acad[p].session_id}});
						var cls_arms = await connect.ClassArm.findOne({where:{id:acad[p].class_arm_id}});
						var clss = await connect.SchoolClass.findOne({where:{id:cls_arms.school_class_id}});
					reps.push({ref_id:acad[p].id,
						 term:reportcard_publish[j].term, session:ses.name, class_arm:clss.name+' '+cls_arms.arm})
					}
				
				}
				
			
			}
		}
		// //console.log(reportcard_publish)
		// for(let j = 0; j < reportcard_publish.length; j++){
		// 	var ses = await connect.Session.findOne({where:{id:academic_session.session_id}});
		// 	reps.push({ref_id:academic_session.id,
		// 		 term:reportcard_publish[j].term, session:ses.name, class_arm:cls.name+' '+cls_arm.arm})
		
		// }
		file.reportcard = reps
		//var reportcard = {ref_id:academic_session.id, term:'Second Term', session:academic.session, class_arm:cls.name+' '+cls_arm.arm}
		//file.reportcard = reportcard

		file.due = 0
		var tm = ['Third Term', 'Second Term', 'First Term']
		for(let r = 0; r < tm.length; r++){
			var pay = await connect.StudentBillTotal.findOne({where:{student_id:student.id, school_id:school_id,
				session_id:academic.session_id, term:tm[r]}});
			if(!pay){}
			else{
				file.due = pay.balance
				break
			}
		
		}
		
		if(academic_session.leave == 0){
			file.status = 'Active'
		}
		else{
			file.status = 'Not Active'
		}
		if(!guardian){
			file.guardian_name = ''
			file.guardian_phone = ''
			file.guardian_email = ''
			file.guardian_occupation = ''
			file.guardian_relationship = ''
			file.guardian_address = ''
			file.guardian_passport = ''
		}
		else{
			file.guardian_name = guardian.name
			file.guardian_phone = guardian.phone
			file.guardian_email = guardian.email
			file.guardian_occupation = guardian.occupation
			file.guardian_relationship = guardian.relationship
			file.guardian_address = guardian.address
			file.guardian_passport = guardian.passport
		}
		//console.log(file)
		res.send({status:'ok', data:file})
	}
}


exports.getstudentbillbyid = async function (req, res) {
	var school_id = parseInt(emc.decrypt(req.payload.school))
	var _id = parseInt(emc.decrypt(req.payload._id))
	console.log(req.params.ref_id)
	
	var info = await connect.StudentBillTotal.findOne({where:{student_id:req.params.ref_id, session_id:req.query.session, term:req.query.term}});
	if(!info)
	{
		res.send({status:'error', msg:'Bill not found!'})
	}
	else{
		var file = {}
		file.amount = info.amount
		file.payment = info.payment
		file.balance = info.balance
		file.weaver = info.weaver
		file.fine = info.fine
		var bill = await connect.StudentBill.findAll({where:{session_id:info.session_id, term:info.term, student_id:info.student_id, class_arm_id:info.class_arm_id}});
		var cls_arm = await connect.ClassArm.findOne({where:{id:info.class_arm_id}});
		var cls = await connect.SchoolClass.findOne({where:{id:cls_arm.school_class_id}});
		var student = await connect.Student.findOne({where:{id:info.student_id}});
		var guardian = await connect.Guardian.findOne({where:{id:student.guardian}});
		file.name = student.surname+' '+student.middlename+' '+student.firstname
		var academic_session = await connect.AcademicSession.findOne({where:{student_id:student.id, session_id:info.session_id}});
		file.admission_no = student.admission_no
		file.student_class = cls.name+' '+cls_arm.arm
		file.student_id = info.student_id
		file.student_academic = academic_session.id
		file.passport = student.passport
		if(!guardian){
			file.guardian_name = ''
			file.guardian_phone = ''
		}
		else{
			file.guardian_name = guardian.name
			file.guardian_phone = guardian.phone
		}
		
		var result = []
		for(var i = 0; i < bill.length; i++){
			var op = {}
			op.amount = bill[i].amount
			op.payment = bill[i].payment
			op.balance = bill[i].balance
			op.weaver = bill[i].weaver
			op.fine = bill[i].fine
			op.ref_id = bill[i].id
			if(bill[i].fees_types_id == 0){
				op.fees = bill[i].fees_name
			}
			else{
				var fees = await connect.FeesType.findOne({where:{id:bill[i].fees_types_id}});
				op.fees = fees.name
			}
			result.push(op)
		}
		file.fees_info = result
		res.send({status:'ok', data:file})
	}
	//console.log(file)
	
}


exports.getstudentbillbyidnew = async function (req, res) {
	var school_id = parseInt(emc.decrypt(req.payload.school))
	var _id = parseInt(emc.decrypt(req.payload._id))
	console.log(req.query)
	var result = []
	var sess = await studentsessioninfo(req.params.ref_id, school_id)
	var academic = await emc.getacademicsession(school_id)
	var academic_session = await connect.AcademicSession.findOne({where:{student_id:req.params.ref_id, session_id:sess.session_id}});
	if(!academic_session){
		res.send({status:'error', data:{fees_info:result}})
	}
	else{
		var pro = await connect.StudentPromotion.findOne({where:{academic_session_id:academic_session.id, school_id:school_id}})
		if(pro){
			console.log(pro.comment)
			if(pro.comment != 'Repeat Class'){
				promotion = pro.comment
				var cls_arm = await connect.ClassArm.findOne({where:{id:academic_session.class_arm_id}});
				var cls = await connect.SchoolClass.findOne({where:{id:cls_arm.school_class_id}});
				var clss = ''
				if(cls.name == 'KG 1'){
					var clss = await connect.SchoolClass.findOne({where:{name:'KG 2'}});
				}
				if(cls.name == 'KG 2'){
					var clss = await connect.SchoolClass.findOne({where:{name:'BASIC 1'}});
				}
				if(cls.name == 'NURSERY 1'){
					var clss = await connect.SchoolClass.findOne({where:{name:'NURSERY 2'}});
				}
				if(cls.name == 'NURSERY 2'){
					var clss = await connect.SchoolClass.findOne({where:{name:'KG 1'}});
				}
				if(cls.name == 'BASIC 1'){
					var clss = await connect.SchoolClass.findOne({where:{name:'BASIC 2'}});
				}
				if(cls.name == 'BASIC 2'){
					var clss = await connect.SchoolClass.findOne({where:{name:'BASIC 3'}});
				}
				if(cls.name == 'BASIC 3'){
					var clss = await connect.SchoolClass.findOne({where:{name:'BASIC 4'}});
				}
				if(cls.name == 'BASIC 4'){
					var clss = await connect.SchoolClass.findOne({where:{name:'BASIC 5'}});
				}
				if(cls.name == 'BASIC 5'){
					var clss = await connect.SchoolClass.findOne({where:{name:'JSS 1'}});
				}
				if(cls.name == 'JSS 1'){
					var clss = await connect.SchoolClass.findOne({where:{name:'JSS 2'}});
				}
				if(cls.name == 'JSS 2'){
					var clss = await connect.SchoolClass.findOne({where:{name:'JSS 3'}});
				}
				if(cls.name == 'JSS 3'){
					var clss = await connect.SchoolClass.findOne({where:{name:'SSS 1'}});
				}
				if(cls.name == 'SSS 1'){
					var clss = await connect.SchoolClass.findOne({where:{name:'SSS 2'}});
				}
				if(cls.name == 'SSS 2'){
					var clss = await connect.SchoolClass.findOne({where:{name:'SSS 3'}});
				}
				if(clss.length == 0){
					res.send({status:'ok', data:{fees_info:result}})
				}
				else{
					var bill = await connect.SchoolFees.findAll({where:{session_id:academic.session_id, term:'First Term',
					school_class_id:clss.id}});
					for(let i = 0; i < bill.length; i++){
						const file = {}
						var fees = await connect.FeesType.findOne({where:{id:bill[i].fees_types_id}});
						file.name = fees.name
						file.amount = bill[i].amount
						result.push(file)
					}
					res.send({status:'ok', student_class:clss.name, data:{fees_info:result}})
				}
				
				
			}
			else{
				console.log(cls)
				var clss = await connect.SchoolClass.findOne({where:{name:cls.name}});
				if(clss){
					var bill = await connect.SchoolFees.findAll({where:{session_id:academic.session_id, term:'First Term',
					school_class_id:clss.id}});
					for(let i = 0; i < bill.length; i++){
						const file = {}
						var fees = await connect.FeesType.findOne({where:{id:bill[i].fees_types_id}});
						file.name = fees.name
						file.amount = bill[i].amount
						result.push(file)
					}
				}
				res.send({status:'ok', student_class:clss.name, data:{fees_info:result}})
				
			}
		}
		else{
			res.send({status:'error', data:{fees_info:result}})
		}
	}
	            
	
	
}


exports.getstudentbillpaymentbyid = async function (req, res) {
	var school_id = parseInt(emc.decrypt(req.payload.school))
	var _id = parseInt(emc.decrypt(req.payload._id))
	console.log(req.params.ref_id)
	var bill = await connect.StudentBillPay.findAll({where:{student_id:req.params.ref_id,session_id:req.query.session, term:req.query.term, school_id:school_id}});
	var result = []
	for(var i = 0; i < bill.length; i++){
		var op = {}
		op.amount = math.chain(bill[i].amount).subtract(bill[i].weaver).add(bill[i].fine).done()
		op.prev_payment = bill[i].prev_pay
		op.balance = bill[i].balance
		op.due = bill[i].due
		op.paid = bill[i].payment
		op.ref_id = bill[i].id
		op.receipt = math.chain(5933322).add(bill[i].id).done()
		op.trans_date = bill[i].trans_date
		if(bill[i].payment_type_id == 1){
			op.payment_method  = 'Cash'
		}
		if(bill[i].payment_type_id == 2){
			op.payment_method  = 'Bank Teller'
		}
		if(bill[i].payment_type_id == 3){
			op.payment_method  = 'Bank Transfer'
		}
		if(bill[i].payment_type_id == 4){
			op.payment_method  = 'Bank Cheque'
		}
		if(bill[i].payment_type_id == 5){
			op.payment_method  = 'POS'
		}
		
		result.push(op)
	}
	//console.log(result)
	res.send(result)
}


exports.postnotice = async function (req, res) {
	var school_id = parseInt(emc.decrypt(req.payload.school))
	var _id = parseInt(emc.decrypt(req.payload._id))
	console.log(req.body)
	var title_url = new String(req.body.subject)
	title_url = title_url.replace(/[^a-zA-Z0-9]/g,'_');
	title_url = title_url.replace(/[^a-zA-Z0-9]/g,'_').replace(/__/g,'_');
	title_url = title_url.replace(/((http|https|ftp):\/\/[\w?=&.\/-;#~%-]+(?![\w\s?&.\/;#~%"=-]*>))/g,'_').replace(/__/g,'_');
	
	var cls = JSON.parse(req.body.student_class)
	var check = false
	var msg = ''
	var result = []
	for(var i = 0; i < cls.length; i++){
		if(cls[i] == 'pre-primary'){
			var sch = await connect.SchoolClass.findAll({where: {title:'Pre-Primary', [Op.or]: [
				{ school_id:0  },{ school_id:school_id } ] }, order:[['name', 'ASC']]});
			
		}
		else if(cls[i] == 'primary'){
			var sch = await connect.SchoolClass.findAll({where: {title:'Primary', [Op.or]: [
				{ school_id:0  },{ school_id:school_id } ] }, order:[['name', 'ASC']]});
		}
		else if(cls[i] == 'secondary'){
			var sch = await connect.SchoolClass.findAll({where: {title:'Secondary', [Op.or]: [
				{ school_id:0  },{ school_id:school_id } ] }, order:[['name', 'ASC']]});
			
		}
		else{
			var sch = await connect.SchoolClass.findAll({where: {id:sch[i], [Op.or]: [
				{ school_id:0  },{ school_id:school_id } ] }, order:[['name', 'ASC']]});
		}
		for(var s = 0; s < sch.length; s++){
			var file = {author:req.body.author, subject:req.body.subject, destination:req.body.destination,
			content:req.body.data, summary:req.body.summary,publish:true,publish_date:new Date(2022, 4, 22),
			school_class_id:sch[s].id, user_id:_id, school_id:school_id, msg_type:'Intenal', student:0}
			console.log(file)
			var o = await connect.Notice.create(file)

		}
	}
	res.send({status:'ok', message:'Save successful'})

}

exports.getstudentnotice = async function (req, res) {
	console.log(req.query)
	var school_id = parseInt(emc.decrypt(req.payload.school))
	var _id = parseInt(emc.decrypt(req.payload._id))
	//var academic = await emc.getacademicsession(school_id)
	var academic = await studentsessioninfo(req.params.ref_id, school_id)
	var result = []
	var academic_session = await connect.AcademicSession.findAll({where:{student_id:req.params.ref_id},order:[['created_at', 'DESC']]});
	for(let s = 0; s < academic_session.length; s++){
		var cls_arm = await connect.ClassArm.findOne({where:{id:academic_session[s].class_arm_id}});
		var cls = await connect.SchoolClass.findOne({where:{id:cls_arm.school_class_id}});
		
		var notice = await connect.Notice.findAll({where:{school_class_id:cls.id}, order:[['created_at', 'DESC']]});
		for(let i = 0; i < notice.length; i++){
			var data = notice[i]
			var file = {ref_id:data.id,author:data.author, subject:data.subject, destination:data.destination,
					content:data.content, summary:truncates.apply(data.summary, [250, true]) , publish_date:moment(data.created_at).format('DD/MM/YYYY')}
			result.push(file)

		}
	}
	//console.log(result)
	res.send({status:'ok', data:result})
}

exports.getnotice = async function (req, res) {
	var school_id = parseInt(emc.decrypt(req.payload.school))
	var _id = parseInt(emc.decrypt(req.payload._id))
	var data = await connect.Notice.findOne({where:{id:req.params.ref_id}});
	if(!data){
		res.send({status:'error', msg:'Student not found'})
	}
	else{
		var file = {ref_id:data.id,author:data.author, subject:data.subject, destination:data.destination,
					content:data.content, summary:truncates.apply(data.summary, [250, true]) , publish_date:moment(data.created_at).format('DD/MM/YYYY')}
		res.send({status:'ok', data:file})

	}
}

exports.studenttopromote = async function (req, res) {
	console.log(req.query)
	var promotion = await connect.Promotion.findOne({where:{class_arm_id:req.query.student_class, session_id:req.query.session}});
	var student_obj = {}
	if(promotion){
		student_obj = JSON.parse(promotion.student)
	}
	console.log(student_obj)
	
	var students = []
	var academic_session = await connect.AcademicSession.findAll({where:{class_arm_id:req.query.student_class, session_id:req.query.session}});
	for(let i = 0; i < academic_session.length; i++){
		let academic = academic_session[i]
		if(!student_obj[academic.student_id])
		{
			var student = await connect.Student.findOne({where:{id:academic.student_id}});
			let file = {}
			file.name = student.surname+' '+student.middlename+' '+student.firstname
			file.id = academic.id
			students.push(file)
		}
		
		
		
	
	}
	var cls_arm = await connect.ClassArm.findOne({where:{id:req.query.student_class}});
	var cls = await connect.SchoolClass.findOne({where:{id:cls_arm.school_class_id}});
	var arm = await connect.ClassArm.findOne({where:{school_class_id:cls.to}});
	var promote_class = req.query.student_class
	if(arm){
		promote_class = arm.id
	}
	res.send({status:'ok', promote_class:promote_class, student:students, current_class:cls.name+' '+cls_arm.arm })

}

exports.promotestudent = async function (req, res) {
	var school_id = parseInt(emc.decrypt(req.payload.school))
	var _id = parseInt(emc.decrypt(req.payload._id))
	console.log(req.body)
	var student = JSON.parse(req.body.detail)
	
	
	// var keys = Object.keys(student_objs)
	// for(let s = 0; s < keys.length; s++){

	// }
	var academic = await connect.AcademicSession.findOne({where:{id:student[0].student_id}});
	if(academic){
		var session = await connect.Session.findOne({where:{id:academic.session_id}});
		var session_name = await connect.SessionName.findOne({where:{name:session.name}});
		var index = session_name.index + 1
		var session_index = await connect.SessionName.findOne({where:{index:index}});
		var new_session = await connect.Session.findOne({where:{name:session_index.name}});
		console.log(new_session.id)

		var student_obj = {}
		for(let i = 0; i < student.length; i++){
			var academics = await connect.AcademicSession.findOne({where:{id:student[i].student_id}});
			if(parseInt(student[i].promoted_class) != 0){
				student_obj[student[i].student_id] = student[i].promoted_class
				var file = {session_id:new_session.id,class_arm_id:student[i].promoted_class, student_id:academics.student_id,
					term:'First Term', leave:0, user_id:_id, school_id:school_id}
				console.log(file)
				connect.AcademicSession.create(file)
			}
		}
		var promotion = await connect.Promotion.findOne({where:{class_arm_id:academic.class_arm_id, session_id:academic.session_id}});
		if(promotion){
			student_obj = {...student_obj, ...JSON.parse(promotion.student)}
			connect.Promotion.update({student:JSON.stringify(student_obj),user_id:_id}, {where:{id:promotion.id}})
		}
		else{
			connect.Promotion.create({class_arm_id:academic.class_arm_id, session_id:academic.session_id, student:JSON.stringify(student_obj),
				user_id:_id, school_id:school_id})
		}
		console.log(student_obj)
		res.send({status:'ok', message:'Promotion done successfully'})

	}
	else{
		res.send({status:'error', message:'Error in processing information, please contact system administration'})
	}
	
}