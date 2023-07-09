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
const {
	Op
} = require("sequelize");


var rating_one = [{title:'0-39(VERY POOR)',min:0, max:39.4, description:'VERY POOR'},
{title: '40-44(POOR)', min:39.5, max:44.4, description:'POOR'},
{title: '45-49(FAIR)', min:44.5, max:49.5, description:'FAIR'},
{title:'50-59(GOOD)', min:49.5, max:59.4, description:'GOOD'},
{title:'60-69(VERY GOOD)', min:59.5, max:69.4, description:'VERY GOOD'},
{title:'70 & ABOVE(EXCELLENT)',min:69.5, max:100, description:'EXCELLENT'}]

var rating_two = [{title:'0-39(FAIL)',min:0, max:39.4, description:'FAIL'},
{title: '40-44(WEAK FAIL)', min:39.5, max:44.4, description:'WEAK FAIL'},
{title: '45-49(PASS)', min:44.5, max:49.5, description:'PASS'},
{title:'50-54(AVERAGE)', min:49.5, max:54.4, description:'AVERAGE'},
{title:'55-59(FAIRLY GOOD)', min:54.5, max:59.4, description:'FAIRLY GOOD'},
{title:'60-69(GOOD)',min:59.5, max:69.4, description:'GOOD'},
{title:'70-74(V. GOOD)',min:69.5, max:74.4, description:'V. GOOD'},
{title:'74 & ABOVE(DISTINCTION)',min:74.5, max:100, description:'DISTINCTION'}]

var exports = module.exports = {};

exports.getbasicsubjectadmin = async function (req, res) {
	var school_id = parseInt(emc.decrypt(req.payload.school))
	var _id = emc.decrypt(req.payload._id)
    _id = parseInt(_id)
    var result = []
	var sch_class = await connect.Subject.findAll({where: {category:'BASIC', [Op.or]: [
      { school_id:0  },{ school_id:school_id } ] }, order:[['name', 'ASC']]});
	var add_access = await emc.getuseraccess('Add Subject', _id, school_id)
	var edit_access = await emc.getuseraccess('Edit Subject', _id, school_id)
	var delete_access = await emc.getuseraccess('Remove Subject', _id, school_id)
	//console.log(sch_class.length)
	for (var i = 0; i < sch_class.length; i++) {
		var file = {}
		file.name = sch_class[i].name
		file.ref_id = sch_class[i].id
		if(sch_class[i].school_id == 0)
		{file.editable = false}
		else{file.editable = true}
		result.push(file)
		
	}
	//console.log(result)
	res.send({status:'ok', data:result, add:add_access, edit:edit_access, delete:delete_access})
}

exports.getbasicsubject = async function (req, res) {
	var school_id = parseInt(emc.decrypt(req.payload.school))
	var _id = emc.decrypt(req.payload._id)
    _id = parseInt(_id)
    var result = []
	var sch_class = await connect.Subject.findAll({where: {category:'BASIC', [Op.or]: [
      { school_id:0  },{ school_id:school_id } ] }, order:[['name', 'ASC']]});
	//console.log(sch_class.length)
	for (var i = 0; i < sch_class.length; i++) {
		var file = {}
		file.name = sch_class[i].name
		file.ref_id = sch_class[i].id
		if(sch_class[i].school_id == 0)
		{file.editable = false}
		else{file.editable = true}
		result.push(file)
		
	}
	//console.log(result)
	res.send(result)
}


exports.postbasicsubject = async function (req, res) {
	var school_id = parseInt(emc.decrypt(req.payload.school))
	var _id = parseInt(emc.decrypt(req.payload._id))
	//console.log(req.body)
	var sch = await connect.Subject.create({name:req.body.name, category:'BASIC', user_id:_id, school_id:school_id})
	res.send({status:'ok',msg:'Subject created successful', name:sch.dataValues.name, ref_id:sch.dataValues.id})

}

exports.getjsssubjectadmin = async function (req, res) {
	var school_id = parseInt(emc.decrypt(req.payload.school))
	var _id = emc.decrypt(req.payload._id)
    _id = parseInt(_id)
    var result = []
	var sch_class = await connect.Subject.findAll({where: {category:'JSS', [Op.or]: [
      { school_id:0  },{ school_id:school_id } ] }, order:[['name', 'ASC']]});
	var add_access = await emc.getuseraccess('Add Subject', _id, school_id)
	var edit_access = await emc.getuseraccess('Edit Subject', _id, school_id)
	var delete_access = await emc.getuseraccess('Remove Subject', _id, school_id)
	console.log(sch_class.length)
	for (var i = 0; i < sch_class.length; i++) {
		var file = {}
		file.name = sch_class[i].name
		file.ref_id = sch_class[i].id
		if(sch_class[i].school_id == 0)
		{file.editable = false}
		else{file.editable = true}
		result.push(file)
		
	}
	//console.log(result)
	res.send({status:'ok', data:result, add:add_access, edit:edit_access, delete:delete_access})
}

exports.getjsssubject = async function (req, res) {
	var school_id = parseInt(emc.decrypt(req.payload.school))
	var _id = emc.decrypt(req.payload._id)
    _id = parseInt(_id)
    var result = []
	var sch_class = await connect.Subject.findAll({where: {category:'JSS', [Op.or]: [
      { school_id:0  },{ school_id:school_id } ] }, order:[['name', 'ASC']]});
	for (var i = 0; i < sch_class.length; i++) {
		var file = {}
		file.name = sch_class[i].name
		file.ref_id = sch_class[i].id
		if(sch_class[i].school_id == 0)
		{file.editable = false}
		else{file.editable = true}
		result.push(file)
		
	}
	//console.log(result)
	res.send(result)
}


exports.postjsssubject = async function (req, res) {
	var school_id = parseInt(emc.decrypt(req.payload.school))
	var _id = parseInt(emc.decrypt(req.payload._id))
	//console.log(req.body)
	var sch = await connect.Subject.create({name:req.body.name, category:'JSS', user_id:_id, school_id:school_id})
	res.send({status:'ok',msg:'Subject created successful', name:sch.dataValues.name, ref_id:sch.dataValues.id})
	
}

exports.getssssubject = async function (req, res) {
	var school_id = parseInt(emc.decrypt(req.payload.school))
	var _id = emc.decrypt(req.payload._id)
    _id = parseInt(_id)
    var result = []
	var sch_class = await connect.Subject.findAll({where: {category:'SSS', [Op.or]: [
      { school_id:0  },{ school_id:school_id } ] }, order:[['name', 'ASC']]});
	var add_access = await emc.getuseraccess('Add Subject', _id, school_id)
	var edit_access = await emc.getuseraccess('Edit Subject', _id, school_id)
	var delete_access = await emc.getuseraccess('Remove Subject', _id, school_id)
	//console.log(sch_class.length)
	for (var i = 0; i < sch_class.length; i++) {
		var file = {}
		file.name = sch_class[i].name
		file.ref_id = sch_class[i].id
		if(sch_class[i].school_id == 0)
		{file.editable = false}
		else{file.editable = true}
		result.push(file)
		
	}
	//console.log(result)
	res.send({status:'ok', data:result, add:add_access, edit:edit_access, delete:delete_access})
}

exports.getssssubjectadmin = async function (req, res) {
	var school_id = parseInt(emc.decrypt(req.payload.school))
	var _id = emc.decrypt(req.payload._id)
    _id = parseInt(_id)
    var result = []
	var sch_class = await connect.Subject.findAll({where: {category:'SSS', [Op.or]: [
      { school_id:0  },{ school_id:school_id } ] }, order:[['name', 'ASC']]});
	var add_access = await emc.getuseraccess('Add Subject', _id, school_id)
	var edit_access = await emc.getuseraccess('Edit Subject', _id, school_id)
	var delete_access = await emc.getuseraccess('Remove Subject', _id, school_id)
	//console.log(sch_class.length)
	for (var i = 0; i < sch_class.length; i++) {
		var file = {}
		file.name = sch_class[i].name
		file.ref_id = sch_class[i].id
		if(sch_class[i].school_id == 0)
		{file.editable = false}
		else{file.editable = true}
		result.push(file)
		
	}
	//console.log(result)
	res.send({status:'ok', data:result, add:add_access, edit:edit_access, delete:delete_access})
}


exports.postssssubject = async function (req, res) {
	var school_id = parseInt(emc.decrypt(req.payload.school))
	var _id = parseInt(emc.decrypt(req.payload._id))
	//console.log(req.body)
	var sch = await connect.Subject.create({name:req.body.name, category:'SSS', user_id:_id, school_id:school_id})
	res.send({status:'ok',msg:'Subject created successful', name:sch.dataValues.name, ref_id:sch.dataValues.id})
	
}


exports.updatesubject = async function (req, res) {
	var school_id = parseInt(emc.decrypt(req.payload.school))
	var _id = parseInt(emc.decrypt(req.payload._id))
	//console.log(req.body)
	var sch = await connect.Subject.findOne({where:{id:req.params.ref_id, school_id:school_id}})
	if(sch){
		var schs = await connect.Subject.update({name:req.body.name, user_id:_id}, {where:{id:sch.id}})
		res.send({status:'ok',msg:'Subject updated successful', name:req.body.name, ref_id:req.params.ref_id})
	}
	else{
		res.send({status:'error',msg:'Subject not found'})
	}
	
}

exports.deletesubject = async function (req, res) {
	var school_id = parseInt(emc.decrypt(req.payload.school))
	var _id = parseInt(emc.decrypt(req.payload._id))
	//console.log(req.body)
	var sch = await connect.Subject.findOne({where:{id:req.params.ref_id, school_id:school_id}})
	if(sch){
		var schs = await connect.Subject.destroy({where:{id:sch.id}})
		res.send({status:'ok',msg:'Subject delete successful'})
	}
	else{
		res.send({status:'error',msg:'Subject not found'})
	}
	
}

exports.getallocatestudent = async function (req, res) {
	var school_id = parseInt(emc.decrypt(req.payload.school))
	var _id = parseInt(emc.decrypt(req.payload._id))
	console.log(req.query)
	
	var sch = await connect.ClassArm.findOne({where:{id:req.query.student_class, school_id:school_id}})
	if(!sch){
		
	}
	else{
		//console.log(sch.school_class_id)
		var cls = await connect.SchoolClass.findOne({where:{id:sch.school_class_id}})
		if(cls.title == 'Secondary'){
			if(cls.name[0] == 'J'){
				var sch_class = await connect.Subject.findAll({where: {category:'JSS', [Op.or]: [
				{ school_id:0  },{ school_id:school_id } ] }, order:[['name', 'ASC']]});
			}
			else{
				var sch_class = await connect.Subject.findAll({where: {category:'SSS', [Op.or]: [
				{ school_id:0  },{ school_id:school_id } ] }, order:[['name', 'ASC']]});
			}
		}
		else{
			var sch_class = await connect.Subject.findAll({where: {category:'BASIC', [Op.or]: [
			{ school_id:0  },{ school_id:school_id } ] }, order:[['name', 'ASC']]});
		}
		var subject = []
		for(var i = 0; i < sch_class.length; i++){
			var file = {ref_id:sch_class[i].id, name:sch_class[i].name}
			subject.push(file)
		}
		var sch = await connect.AcademicSession.findAll({where:{class_arm_id:req.query.student_class, school_id:school_id, session_id:req.query.session, leave:0}})
		console.log(sch)
		var student = []
		for(var i = 0; i < sch.length; i++){
			var info = {ref_id:sch[i].id}
			var academic = await connect.StudentScore.findOne({where:{academic_session_id:sch[i].id}})
			//if(!academic){
				var stud = await connect.Student.findOne({where:{id:sch[i].student_id}})
				info.name = stud.surname+' '+stud.middlename+' '+stud.firstname
				student.push(info)
			//}
		}
		//console.log(student)
		//console.log(subject)
		res.send({status:'ok', student:JSON.stringify(student), subject:JSON.stringify(subject)})
	}
	
	
}

exports.postallocatestudent = async function (req, res) {
	var school_id = parseInt(emc.decrypt(req.payload.school))
	var _id = parseInt(emc.decrypt(req.payload._id))
	console.log(req.body)
	if(req.body.student == 'All'){
		var sch = await connect.AcademicSession.findAll({where:{class_arm_id:req.body.student_cls, school_id:school_id, session_id:req.body.session, leave:0}})
	}
	else{
		var sch = await connect.AcademicSession.findAll({where:{id:req.body.student, school_id:school_id}})
	}
	console.log(sch.length)
	var subject = JSON.parse(req.body.subject)
	for(var i = 0; i < sch.length; i++){
		for(var s = 0; s < subject.length; s++){
			var academic = await connect.StudentScore.findOne({where:{academic_session_id:sch[i].id, subject_id:subject[s], school_id:school_id}})
			if(!academic){
				var record = {academic_session_id:sch[i].id, subject_id:subject[s], first_term_score:'', first_term_total:'', second_term_score:'',
					second_term_total:'', third_term_score:'', third_term_total:'', user_id:_id, school_id:school_id}
				var t = await connect.StudentScore.create(record)
			}
			else{
				console.log('register already')
			}
		}
	}
	res.send({status:'ok', msg:'Subject allocated successful'})
}

exports.postreportcardsetting = async function (req, res) {
	var school_id = parseInt(emc.decrypt(req.payload.school))
	var _id = parseInt(emc.decrypt(req.payload._id))
	console.log(req.body)
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
			var sch = await connect.SchoolClass.findAll({where: {id:cls[i], [Op.or]: [
				{ school_id:0  },{ school_id:school_id } ] }, order:[['name', 'ASC']]});
		}
		//console.log(sch.length)
		for(var s = 0; s < sch.length; s++){
			var cls_point = await connect.Mark.findAll({where:{school_class_id:sch[s].id, school_id:school_id}, order:[['id', 'ASC']]})
			var score = 0
			for(var z = 0; z < cls_point.length; z++)
			{
				score = math.chain(score).add(cls_point[z].point).done()
			}
			score = math.chain(score).add(req.body.point).done()
			//console.log(score)
			if(parseInt(score) > 100){
				check = true
				msg = sch[i].name
			}
			else{
				var file = {point:req.body.point, name:req.body.name, abbr:req.body.abbr, school_class_id:sch[s].id, user_id:_id, school_id:school_id}
				result.push(file)
			}
			//
		}
	}	
	console.log(check)
	if(check == true){
		res.send({status:'error', msg:'Total score cannot be more than 100 point, please check '+msg })
	}
	else{
		console.log(result)
		for(var i = 0; i < result.length; i++){
			var p = await connect.Mark.create(result[i])
		}
		res.send({status:'ok', msg:"Mark distribution enter successful"})
	}
	
	
}


exports.postremarksetting = async function (req, res) {
	var school_id = parseInt(emc.decrypt(req.payload.school))
	var _id = parseInt(emc.decrypt(req.payload._id))
	console.log(req.body)
	var cls = JSON.parse(req.body.student_class)
	
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
			var sch = await connect.SchoolClass.findAll({where: {id:cls[i], [Op.or]: [
				{ school_id:0  },{ school_id:school_id } ] }, order:[['name', 'ASC']]});
		}
		//console.log(sch.length)
		for(var s = 0; s < sch.length; s++){
			
			var file = {school_class_id:sch[s].id, user_id:_id, school_id:school_id}
			var p = await connect.Remark.create(file)
			
			//
		}
	}	
	
	res.send({status:'ok', msg:"Mark distribution enter successful"})
	
	
	
}

exports.getreportcardsetting = async function (req, res) {
	var school_id = parseInt(emc.decrypt(req.payload.school))
	var _id = emc.decrypt(req.payload._id)
    _id = parseInt(_id)
    var result = []
	var sch_class = await connect.Mark.findAll({where: { school_id:school_id }, order:[['id', 'ASC']]});
	var add_access = await emc.getuseraccess('Add Report Card Setting', _id, school_id)
	var edit_access = await emc.getuseraccess('Update Report Card Setting', _id, school_id)
	var delete_access = await emc.getuseraccess('Remove Report Card Setting', _id, school_id)
	//console.log(sch_class.length)
	for (var i = 0; i < sch_class.length; i++) {
		var file = {}
		var cls = await connect.SchoolClass.findOne({where:{id:sch_class[i].school_class_id}})
		console.log(cls)
		file.name = sch_class[i].name
		file.ref_id = sch_class[i].id
		file.point = sch_class[i].point
		file.abbr = sch_class[i].abbr
		file.school_class = cls.name
		result.push(file)
		
	}
	console.log(result)
	result.sort(emc.GetSortOrder('school_class'))
	res.send({status:'ok', data:result, add:add_access, edit:edit_access, delete:delete_access})
}



exports.getremarksetting = async function (req, res) {
	var school_id = parseInt(emc.decrypt(req.payload.school))
	var _id = emc.decrypt(req.payload._id)
    _id = parseInt(_id)
    var result = []
	var sch_class = await connect.Remark.findAll({where: { school_id:school_id }, order:[['id', 'ASC']]});
	var add_access = await emc.getuseraccess('Add Report Card Setting', _id, school_id)
	var edit_access = await emc.getuseraccess('Update Report Card Setting', _id, school_id)
	var delete_access = await emc.getuseraccess('Remove Report Card Setting', _id, school_id)
	//console.log(sch_class.length)
	for (var i = 0; i < sch_class.length; i++) {
		var file = {}
		var cls = await connect.SchoolClass.findOne({where:{id:sch_class[i].school_class_id}})
		file.ref_id = sch_class[i].id
		
		file.school_class = cls.name
		result.push(file)
		
	}
	console.log(result)
	result.sort(emc.GetSortOrder('school_class'))
	res.send({status:'ok', data:result, add:add_access, edit:edit_access, delete:delete_access})
}


exports.getschoolsubject = async function (req, res) {
	var school_id = parseInt(emc.decrypt(req.payload.school))
	var _id = emc.decrypt(req.payload._id)
    _id = parseInt(_id)
    var result = []
	console.log(req.query)
	//var cls = req.query.student_class
	console.log(cls)
	var arm = await connect.ClassArm.findOne({where: {school_id:school_id, id:req.query.student_class }});
	if(arm){
		var cls = await connect.SchoolClass.findOne({where:{id:arm.school_class_id}})
		if(cls.title == 'Secondary'){
			if(cls.name[0] == 'J'){
				var sch_class = await connect.Subject.findAll({where: {category:'JSS', [Op.or]: [
				{ school_id:0  },{ school_id:school_id } ] }, order:[['name', 'ASC']]});
			}
			else{
				var sch_class = await connect.Subject.findAll({where: {category:'SSS', [Op.or]: [
				{ school_id:0  },{ school_id:school_id } ] }, order:[['name', 'ASC']]});
			}
		}
		else{
			var sch_class = await connect.Subject.findAll({where: {category:'BASIC', [Op.or]: [
			{ school_id:0  },{ school_id:school_id } ] }, order:[['name', 'ASC']]});
		}
		
		for (var i = 0; i < sch_class.length; i++) {
			var file = {}
			file.name = sch_class[i].name
			file.ref_id = sch_class[i].id
			var sch = await connect.AcademicSession.findAll({where:{class_arm_id:req.query.student_class, school_id:school_id, session_id:req.query.session, leave:0}})
			//console.log(sch.length)
			var total = 0
			for(var s = 0; s < sch.length; s++){
				var t = await connect.StudentScore.count({where:{academic_session_id:sch[s].id, subject_id:sch_class[i].id}})
				//console.log(t)
				total += t
			}
			file.student = total
			var teacher = await connect.SubjectTeacher.findAll({where: {session_id:req.query.session,class_arm_id:req.query.student_class, subject_id:sch_class[i].id}});
			//console.log(sch.length)
			if(teacher.length == 0){
				file.teacher = ''
			}
			else{
				var nn = ''
				for(var s = 0; s < teacher.length; s++){
					var user = await connect.User.findOne({where:{id:teacher[s].teacher_id}})
					if(s == 0){
						nn += user.firstname+' '+user.lastname
					}
					else{
						nn += ', '+user.firstname+' '+user.lastname
					}
				}
				file.teacher = nn
			}
			file.text_book = ''
			file.student_class = req.query.student_class
			file.academic_session = req.query.session
			//var academic = await emc.getacademicsession(school_id)
			result.push(file)
		}
		//console.log(result)
		res.send(result)
	}
	
}

exports.getsubjectbyclass = async function (req, res) {
	var school_id = parseInt(emc.decrypt(req.payload.school))
	var _id = emc.decrypt(req.payload._id)
    _id = parseInt(_id)
    var result = []
	console.log(req.query)
	var cls = req.query.student_class
	if(cls[0] == 'J' ){
		var sch_class = await connect.Subject.findAll({where: {category:'JSS', [Op.or]: [
				{ school_id:0  },{ school_id:school_id } ] }, order:[['name', 'ASC']]});
	}
	else if(cls[0] == 'S'){
		var sch_class = await connect.Subject.findAll({where: {category:'SSS', [Op.or]: [
				{ school_id:0  },{ school_id:school_id } ] }, order:[['name', 'ASC']]});
	}
	else{
		var sch_class = await connect.Subject.findAll({where: {category:'BASIC', [Op.or]: [
		{ school_id:0  },{ school_id:school_id } ] }, order:[['name', 'ASC']]});
	}
	
	for (var i = 0; i < sch_class.length; i++) {
		var file = {}
		file.name = sch_class[i].name
		file.ref_id = sch_class[i].id
		result.push(file)
	}
	res.send(result)
	
}

exports.getscorebysubject = async function(req, res){
	var school_id = parseInt(emc.decrypt(req.payload.school))
	var _id = emc.decrypt(req.payload._id)
    _id = parseInt(_id)
    var result = []
	console.log(req.query)
	
	var sch_class = await connect.ClassArm.findOne({where: {id:req.query.student_class, school_id:school_id }});
	if(sch_class)
	{
		var sch = await connect.SchoolClass.findOne({where:{id:sch_class.school_class_id}})
		var a_mark = await connect.MarkAcademic.findOne({where: {session_id:req.query.academic_session, term:req.query.session_term,school_class_id:sch.id}});
		if(!a_mark){
			var mark = await connect.Mark.findAll({where: {school_class_id:sch.id}, order:[['id', 'ASC']]});
			var r_mark = []
			for(var s = 0; s < mark.length; s++){
				var file = {name:mark[s].name, abbr:mark[s].abbr, point:mark[s].point}
				r_mark.push(file)
			}
			console.log('new')
			console.log(r_mark)
			
		}
		else{
			console.log(a_mark.mark)
			var r_mark = JSON.parse(a_mark.mark)
		}
		//console.log(r_mark)
		if(req.query.session_term == 'First Term'){
			var leave = 1
		}
		else if(req.query.session_term == 'Second Term'){
			var leave = 2
		}
		else if(req.query.session_term == 'Third Term'){
			var leave = 3
		}
		else{
			var leave = 1
		}
		var sch = await connect.AcademicSession.findAll({where:{class_arm_id:req.query.student_class, school_id:school_id, session_id:req.query.academic_session, leave:{$lte:leave}}})
		console.log(sch.length)
		for(var i = 0; i < sch.length; i++){
			
			var studentscore = await connect.StudentScore.findOne({where:{academic_session_id:sch[i].id, subject_id:req.query.student_subject}})
			if(studentscore){
				var info = {}
				info.ref_id  = studentscore.id
				var student = await connect.Student.findOne({where:{id:sch[i].student_id}})
				info.student_name = student.surname+' '+student.middlename+' '+student.firstname
				info.admission_no = student.admission_no
				info.picture = student.passport
				if(req.query.session_term == 'First Term'){
					var score = studentscore.first_term_score
				}
				else if(req.query.session_term == 'Second Term'){
					var score = studentscore.second_term_score
				}
				else if(req.query.session_term == 'Third Term'){
					var score = studentscore.third_term_score
				}
				//console.log(score)
				
				if(score == '' || score == null){
					console.log('empty')
					var st_score = []
					for(var z = 0; z < r_mark.length; z++){
						var val = {...r_mark[z], value:''}
						st_score.push(val)
					}
				}
				else{
					var st_score = JSON.parse(score)
				}
				info.score = JSON.stringify(st_score)
				result.push(info)
				
			}
			
			
		
		}
		//console.log(result)
		res.send({status:200, mark:r_mark, data:result})
	}
	else{
	}
}



exports.postscorebysubject = async function(req, res){
	var school_id = parseInt(emc.decrypt(req.payload.school))
	var _id = emc.decrypt(req.payload._id)
    _id = parseInt(_id)
	console.log(req.body)
	var result_publish = false
	var report_infos = await connect.ReportCard.findOne({where: {session_id:req.body.academic_session, term:req.body.session_term,
		class_arm_id:req.body.student_class}});
	console.log(report_infos)
	if(!report_infos){}
	else{
		if(report_infos.release == true){
			result_publish = true
		}
	}
	console.log(result_publish)
	if(result_publish == false){
		var sch_class = await connect.ClassArm.findOne({where: {id:req.body.student_class, school_id:school_id }});
		if(sch_class)
		{
			var sch = await connect.SchoolClass.findOne({where:{id:sch_class.school_class_id}})
			var a_mark = await connect.MarkAcademic.findOne({where: {session_id:req.body.academic_session, term:req.body.session_term,school_class_id:sch.id}});
			if(!a_mark){
				var mark = await connect.Mark.findAll({where: {school_class_id:sch.id}, order:[['id', 'ASC']]});
				var r_mark = []
				for(var s = 0; s < mark.length; s++){
					var file = {name:mark[s].name, abbr:mark[s].abbr, point:mark[s].point}
					r_mark.push(file)
				}
			}
			else{
				var r_mark = JSON.parse(a_mark.mark)
			}
			var info = JSON.parse(req.body.info)
			//console.log(info)
			for(var i = 0; i < info.length; i++){
				var studentscore = await connect.StudentScore.findOne({where:{id:info[i].id}})
				if(studentscore){
					var st_score = []
					var total = 0
					for(var z = 0; z < r_mark.length; z++){
						var val = info[i][r_mark[z].abbr]
						if(val == '' || val == null){}
						else{
							total = math.chain(total).add(val).done()
						}
						//console.log(r_mark[z].abbr, val)
						var point = {...r_mark[z], value:val}
						st_score.push(point)
					}
					//console.log(st_score)
					if(req.body.session_term == 'First Term'){
						var sscore = await connect.StudentScore.update({first_term_score:JSON.stringify(st_score),first_term_total:total},{where:{id:info[i].id}})
					}
					else if(req.body.session_term == 'Second Term'){
						var sscore = await connect.StudentScore.update({second_term_score:JSON.stringify(st_score),second_term_total:total},{where:{id:info[i].id}})
					}
					else if(req.body.session_term == 'Third Term'){
						var sscore = await connect.StudentScore.update({third_term_score:JSON.stringify(st_score),third_term_total:total},{where:{id:info[i].id}})
					}
					
					
				}
				else{
					console.log('not found')
				}
			}
			if(!a_mark){
				var amark = await connect.MarkAcademic.create({session_id:req.body.academic_session, term:req.body.session_term,school_class_id:sch.id, mark:JSON.stringify(r_mark)});
			}
			res.send({status:200, message:'Save successful'})
			
		}
		else{
			res.send({status:'401', message:'Class not found'})
		}

	}
	else{
		res.send({status:'401', message:'Cannot update score, result already publish'})

	}
	
}

exports.postscorebyexcel = async function(req, res){
	var school_id = parseInt(emc.decrypt(req.payload.school))
	var _id = emc.decrypt(req.payload._id)
    _id = parseInt(_id)
	console.log(req.body)
	var report_infos = await connect.ReportCard.findOne({where: {session_id:req.body.academic_session, term:req.body.session_term,
		class_arm_id:req.body.student_class}});
	if(!report_infos){}
	else{
		if(report_infos.release == true){
			result_publish = true
		}
	}
	console.log(result_publish)
	if(result_publish == false){
		var sch_class = await connect.ClassArm.findOne({where: {id:req.body.student_class, school_id:school_id }});
		if(sch_class)
		{
			var sch = await connect.SchoolClass.findOne({where:{id:sch_class.school_class_id}})
			var a_mark = await connect.MarkAcademic.findOne({where: {session_id:req.body.academic_session, term:req.body.session_term,school_class_id:sch.id}});
			if(!a_mark){
				var mark = await connect.Mark.findAll({where: {school_class_id:sch.id}, order:[['id', 'ASC']]});
				var r_mark = []
				for(var s = 0; s < mark.length; s++){
					var file = {name:mark[s].name, abbr:mark[s].abbr, point:mark[s].point}
					r_mark.push(file)
				}
			}
			else{
				var r_mark = JSON.parse(a_mark.mark)
			}
			if(req.body.session_term == 'First Term'){
				var leave = 1
			}
			else if(req.body.session_term == 'Second Term'){
				var leave = 2
			}
			else if(req.body.session_term == 'Third Term'){
				var leave = 3
			}
			else{
				var leave = 1
			}
			
			var infos = JSON.parse(req.body.info)
			var sch = await connect.AcademicSession.findAll({where:{class_arm_id:req.body.student_class, school_id:school_id, session_id:req.body.academic_session, leave:{$lte:leave}}})
			console.log(sch.length)
			var all_result = []
			var check_total = false
			var name = ""
			for(var i = 0; i < sch.length; i++){
				
				var studentscore = await connect.StudentScore.findOne({where:{academic_session_id:sch[i].id, subject_id:req.body.student_subject}})
				if(studentscore){
					var info = {}
					info.ref_id  = studentscore.id
					var student = await connect.Student.findOne({where:{id:sch[i].student_id}})
					info.student_name = student.surname+' '+student.middlename+' '+student.firstname
					info.admission_no = student.admission_no
					var check = false
					for(var s = 0; s < infos.length; s++){
						//console.log(infos[s]["Name"])
						if(infos[s]["Name"] == info.student_name && infos[s]["Admission No"] == info.admission_no)
						{
							console.log(info.student_name)
							var st_score = []
							var total = 0
							for(var z = 0; z < r_mark.length; z++){
								
								var val = infos[s][r_mark[z].abbr]
								if(val == '' || val == null){}
								else{
									total = math.chain(total).add(val).done()
								}
								//console.log(r_mark[z].abbr, val)
								var point = {...r_mark[z], value:val}
								st_score.push(point)
							}
							//console.log(st_score)
							if(parseInt(total) > 100){
								name = info.student_name
								check_total = true
							}
							else{
								var ss = {score:st_score,total:total, id:studentscore.id}
								all_result.push(ss)
							}
							
							
							break
						}
					}
					
				}
			}
			if(check_total == false){
				console.log(all_result)
				for(var i = 0; i < all_result.length; i++){
					var data = all_result[i]
					if(req.body.session_term == 'First Term'){
						var sscore = await connect.StudentScore.update({first_term_score:JSON.stringify(data.score),first_term_total:data.total},{where:{id:data.id}})
					}
					else if(req.body.session_term == 'Second Term'){
						var sscore = await connect.StudentScore.update({second_term_score:JSON.stringify(data.score),second_term_total:data.total},{where:{id:data.id}})
					}
					else if(req.body.session_term == 'Third Term'){
						var sscore = await connect.StudentScore.update({third_term_score:JSON.stringify(data.score),third_term_total:data.total},{where:{id:data.id}})
					}
				}
				if(!a_mark){
					var amark = await connect.MarkAcademic.create({session_id:req.body.academic_session, term:req.body.session_term,school_class_id:sch.id, mark:JSON.stringify(r_mark)});
				}
				res.send({status:200, message:'Save successful'})
			}
			else{
				res.send({status:'error', message:'Error, '+name+' total score is more than 100'})
			}
			
		}
	}
	else{
		res.send({status:'401', message:'Cannot update score, result already publish'})

	}
	
	
}

exports.getreportcardclass = async function (req, res) {
	console.log(req.query)
	var school_id = parseInt(emc.decrypt(req.payload.school))
	var _id = parseInt(emc.decrypt(req.payload._id))
    var result = []
	var sch_class = await connect.ClassArm.findAll({where: {school_id:school_id }, order:[['id', 'ASC']]});
	for (var i = 0; i < sch_class.length; i++) {
		var schclass = await connect.SchoolClass.findOne({where:{id:sch_class[i].school_class_id}})
		var file = {}
		file.name = schclass.name+' '+sch_class[i].arm
		file.ref_id = sch_class[i].id
		file.arm = sch_class[i].arm
		file.sch_class = sch_class[i].school_class_id
		var a_mark = await connect.ReportCard.findOne({where: {session_id:req.query.session,
			 term:req.query.term,class_arm_id:sch_class[i].id}});
		var session = await connect.Session.findOne({where: {school_id:school_id, 
			id:req.query.session }, order:[['id', 'ASC']]});
	
		if(!a_mark){
			file.academic_session = session.name
			file.term = req.query.term
			file.publish = false
			file.publish_date = ''
		}
		else{
			file.academic_session = session.name
			file.term = req.query.term
			file.publish = a_mark.release
			file.publish_date = moment(a_mark.release_date).format('DD/MMM/YYYY')
		}
		result.push(file)
		
	}
	//console.log(result)
	res.send(result)
	
}


exports.postreportcardsetup = async function (req, res) {
	var school_id = parseInt(emc.decrypt(req.payload.school))
	var _id = parseInt(emc.decrypt(req.payload._id))
	console.log(req.body)
	var session = await emc.getpreviousacademicsession(school_id)
	console.log(session)
	if(parseInt(req.body.rating) == 1){
		var rating = JSON.stringify(rating_one)
	}
	if(parseInt(req.body.rating) == 2){
		var rating = JSON.stringify(rating_two)
	}
	

	var so = await connect.ResultSetup.findOne({where:{session_id:session.session_id, school_id:school_id, school_class_id:req.body.student_class}})
	if(!so){
		var file = {rating:rating, school_class_id:req.body.student_class, session_id:session.session_id, second_term:req.body.second_term,
			third_term:req.body.third_term, position:req.body.position, school_id:school_id, user_id:_id, rating_index:req.body.rating}
			console.log(file)
			var s= await connect.ResultSetup.create(file)
			res.send({status:'ok', msg:'Setup successful'})
	}
	else{
		var file = {rating:rating, school_class_id:req.body.student_class, session_id:session.session_id, second_term:req.body.second_term,
			third_term:req.body.third_term, position:req.body.position, school_id:school_id, user_id:_id, rating_index:req.body.rating}
			console.log(file)
			var s= await connect.ResultSetup.update(file, {where:{id:so.id}})
			res.send({status:'ok', msg:'Setup successful'})

	}
	
}

exports.postpublishresult = async function (req, res) {
	console.log(req.body)
	var school_id = parseInt(emc.decrypt(req.payload.school))
	var _id = parseInt(emc.decrypt(req.payload._id))
	var a_mark = await connect.ReportCard.findOne({where: {session_id:req.body.session,
		term:req.body.term,class_arm_id:req.body.class_arm_id}});
	if(req.body.publish == 'publish'){
		if(!a_mark){
			var file = {session_id:req.body.session, term:req.body.term,class_arm_id:req.body.class_arm_id, release:true,
			release_date:new Date(), school_id:school_id, user_id:_id}
			console.log(file)
			var p = await connect.ReportCard.create(file)
			res.send({status:'ok'})
		}
		else{
			var p = await connect.ReportCard.update({release:true}, {where:{id:a_mark.id}})
			res.send({status:'ok'})

		}

	}
	else{
		if(!a_mark){}
		else{
			var p = await connect.ReportCard.update({release:false}, {where:{id:a_mark.id}})
			res.send({status:'ok'})

		}
	}

}

exports.getreportcardsetup = async function (req, res) {
	var school_id = parseInt(emc.decrypt(req.payload.school))
	var _id = parseInt(emc.decrypt(req.payload._id))
	var session = await emc.getpreviousacademicsession(school_id)
	var so = await connect.ResultSetup.findOne({where:{session_id:session.session_id, school_id:school_id, school_class_id:req.query.student_class}})
	if(!so){
		res.send({status:'ok', second_term:false, third_term:true, rating:1, position:false})
	}
	else{
		res.send({status:'ok', second_term:so.second_term, third_term:so.third_term, rating:so.rating_index, position:so.position})
	}


}



exports.getstudentreportcardaccess = async function (req, res) {
	console.log(req.query)
	var school_id = parseInt(emc.decrypt(req.payload.school))
	var _id = parseInt(emc.decrypt(req.payload._id))
    var result = []
	if(req.query.session_term == 'First Term'){
		var leave = 1
	}
	else if(req.query.session_term == 'Second Term'){
		var leave = 2
	}
	else if(req.query.session_term == 'Third Term'){
		var leave = 3
	}
	else{
		var leave = 1
	}
	
	var sess = await connect.Session.findOne({where:{name:req.query.session}})
	var schs = await connect.AcademicSession.findAll({where:{class_arm_id:req.query.class, school_id:school_id, 
		session_id:sess.id, leave:{$lte:leave}}})
	
	for (let sch of schs) {
		let file = {}
		console.log(sch.student_id)
		var student = await connect.Student.findOne({where:{id:sch.student_id}});
		file.ref_id = sch.id
		file.name = student.surname+' '+student.middlename+' '+student.firstname
		var a_mark = await connect.StudentReportCard.findOne({where: {academic_session_id:sch.id,
			term:req.query.term}});
		if(!a_mark){
			file.academic_session = sess.name
			file.term = req.query.term
			file.publish = true
		}
		else{
			file.academic_session = sess.name
			file.term = req.query.term
			file.publish = a_mark.release	
		}
		var sch_class = await connect.ClassArm.findOne({where: {id:sch.class_arm_id }});
		var schclass = await connect.SchoolClass.findOne({where:{id:sch_class.school_class_id}})
		
		file.class_name = schclass.name+' '+sch_class.arm
		result.push(file)
		
	}
	console.log(result)
	res.send(result)
	
}


exports.postpublishstudentresult = async function (req, res) {
	console.log(req.body)
	var school_id = parseInt(emc.decrypt(req.payload.school))
	var _id = parseInt(emc.decrypt(req.payload._id))
	var a_mark = await connect.StudentReportCard.findOne({where: {academic_session_id:req.body.ref_id,
		term:req.body.term}});
	if(req.body.publish == 'publish'){
		if(!a_mark){
			var file = {academic_session_id:req.body.ref_id, term:req.body.term, release:true,school_id:school_id, user_id:_id}
			console.log(file)
			var p = await connect.StudentReportCard.create(file)
			res.send({status:'ok'})
		}
		else{
			var p = await connect.StudentReportCard.update({release:true}, {where:{id:a_mark.id}})
			res.send({status:'ok'})

		}

	}
	else{
		if(!a_mark){
			var file = {academic_session_id:req.body.ref_id, term:req.body.term, release:false,school_id:school_id, user_id:_id}
			console.log(file)
			var p = await connect.StudentReportCard.create(file)
			res.send({status:'ok'})
		}
		else{
			var p = await connect.StudentReportCard.update({release:false}, {where:{id:a_mark.id}})
			res.send({status:'ok'})

		}
	}

}