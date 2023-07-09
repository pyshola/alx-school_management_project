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

var exports = module.exports = {};

exports.getclass = async function (req, res) {
	var school_id = parseInt(emc.decrypt(req.payload.school))
	var _id = emc.decrypt(req.payload._id)
    _id = parseInt(_id)
    var result = []
	var sch_class = await connect.SchoolClass.findAll({where: {[Op.or]: [
      { school_id:0  },{ school_id:school_id } ] }, order:[['id', 'ASC']]});
	
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
exports.getclassadmin = async function (req, res) {
	var school_id = parseInt(emc.decrypt(req.payload.school))
	var _id = emc.decrypt(req.payload._id)
    _id = parseInt(_id)
    var result = []
	var sch_class = await connect.SchoolClass.findAll({where: {[Op.or]: [
      { school_id:0  },{ school_id:school_id } ] }, order:[['id', 'ASC']]});
	var add_access = await emc.getuseraccess('Add School Class', _id, school_id)
	var edit_access = await emc.getuseraccess('Edit School Class', _id, school_id)
	var delete_access = await emc.getuseraccess('Delete School Class', _id, school_id)
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
	//res.send(result)
	res.send({status:'ok', data:result, add:add_access, edit:edit_access, delete:delete_access})
	
}


exports.getstudentallclass = async function (req, res) {
	var school_id = parseInt(emc.decrypt(req.payload.school))
	var _id = emc.decrypt(req.payload._id)
    _id = parseInt(_id)
    var result = []
	var sch_class = await connect.SchoolClass.findAll({where: {[Op.or]: [
      { school_id:0  },{ school_id:school_id } ] }, order:[['id', 'ASC']]});
	
	//console.log(sch_class.length)
	var session = await connect.Session.findOne({where: {school_id:school_id, 
		id:req.query.session }, order:[['id', 'ASC']]});

	for (var i = 0; i < sch_class.length; i++) {
		var arms = await connect.ClassArm.findOne({where: {school_id:school_id, school_class_id:sch_class[i].id }});
		if(!arms || !session){}
		else{
			var file = {}
			file.name = sch_class[i].name
			file.ref_id = sch_class[i].id
			file.term = req.query.term
			file.academic_session = session.name
			result.push(file)
		}
	}
	//console.log(result)
	res.send(result)
}


exports.getstudentclass = async function (req, res) {
	var school_id = parseInt(emc.decrypt(req.payload.school))
	var _id = emc.decrypt(req.payload._id)
    _id = parseInt(_id)
    var result = []
	var sch_class = await connect.SchoolClass.findAll({where: {[Op.or]: [
      { school_id:0  },{ school_id:school_id } ] }, order:[['id', 'ASC']]});
	
	//console.log(sch_class.length)
	for (var i = 0; i < sch_class.length; i++) {
		var arms = await connect.ClassArm.findOne({where: {school_id:school_id, school_class_id:sch_class[i].id }});
		if(!arms){}
		else{
			var file = {}
			file.name = sch_class[i].name
			file.ref_id = sch_class[i].id
			result.push(file)
		}
	}
	//console.log(result)
	res.send(result)
}


exports.postclass = async function (req, res) {
	var school_id = parseInt(emc.decrypt(req.payload.school))
	var _id = parseInt(emc.decrypt(req.payload._id))
	console.log(school_id)
	console.log(_id)
	//console.log(req.body)
	var sch = await connect.SchoolClass.create({name:req.body.name, user_id:_id, school_id:school_id, title:'others', to:0})
	res.send({status:'ok',msg:'School Class created successful', name:sch.dataValues.name, ref_id:sch.dataValues.id})
	
}
exports.updateclass = async function (req, res) {
	var school_id = parseInt(emc.decrypt(req.payload.school))
	var _id = parseInt(emc.decrypt(req.payload._id))
	//console.log(req.body)
	var sch = await connect.SchoolClass.findOne({where:{id:req.params.ref_id, school_id:school_id}})
	if(sch){
		var schs = await connect.SchoolClass.update({name:req.body.name, user_id:_id}, {where:{id:sch.id}})
		res.send({status:'ok',msg:'School Class updated successful', name:req.body.name, ref_id:req.params.ref_id})
	}
	else{
		res.send({status:'error',msg:'School Class not found'})
	}
	
}

exports.deleteclass = async function (req, res) {
	var school_id = parseInt(emc.decrypt(req.payload.school))
	var _id = parseInt(emc.decrypt(req.payload._id))
	//console.log(req.body)
	var sch = await connect.SchoolClass.findOne({where:{id:req.params.ref_id, school_id:school_id}})
	if(sch){
		var schs = await connect.SchoolClass.destroy({where:{id:sch.id}})
		res.send({status:'ok',msg:'School Class delete successful'})
	}
	else{
		res.send({status:'error',msg:'School Class not found'})
	}
	
}


exports.postclassarm = async function (req, res) {
	var school_id = parseInt(emc.decrypt(req.payload.school))
	var _id = parseInt(emc.decrypt(req.payload._id))
	//console.log(req.body)
	var add_access = await emc.getuseraccess('Add School Class', _id, school_id)
	if(add_access){
		var sch = await connect.ClassArm.create({arm:req.body.name, school_class_id:req.body.sch_class, user_id:_id, school_id:school_id})
		var schclass = await connect.SchoolClass.findOne({where:{id:sch.dataValues.school_class_id}})
		res.send({status:'ok',msg:'Class Arm created successful', name:schclass.name+' '+sch.dataValues.arm, ref_id:sch.dataValues.id, 
			arm:sch.dataValues.arm, sch_class:sch.dataValues.school_class_id})
	}
	else{
	}
	
}


exports.getclassarmadmin = async function (req, res) {
	var school_id = parseInt(emc.decrypt(req.payload.school))
	var _id = parseInt(emc.decrypt(req.payload._id))
    var result = []
	var sch_class = await connect.ClassArm.findAll({where: {school_id:school_id }, order:[['id', 'ASC']]});
	var add_access = await emc.getuseraccess('Add Class Arms', _id, school_id)
	var edit_access = await emc.getuseraccess('Edit Class Arms', _id, school_id)
	var delete_access = await emc.getuseraccess('Remove Class Arms', _id, school_id)
	for (var i = 0; i < sch_class.length; i++) {
		var schclass = await connect.SchoolClass.findOne({where:{id:sch_class[i].school_class_id}})
		var file = {}
		file.name = schclass.name+' '+sch_class[i].arm
		file.ref_id = sch_class[i].id
		file.arm = sch_class[i].arm
		file.sch_class = sch_class[i].school_class_id
		result.push(file)
		
	}
	//console.log(result)
	//res.send(result)
	res.send({status:'ok', data:result, add:add_access, edit:edit_access, delete:delete_access})
}

exports.getclassarm = async function (req, res) {
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
		result.push(file)
		
	}
	//console.log(result)
	res.send(result)
	
}


exports.getacademicclass = async function (req, res) {
	var school_id = parseInt(emc.decrypt(req.payload.school))
	var _id = emc.decrypt(req.payload._id)
    _id = parseInt(_id)
    var result = []
	//console.log(req.query)
	var sch_class = await connect.ClassArm.findAll({where: {school_id:school_id }, order:[['id', 'ASC']]});
	if(!req.query.session){
		var sessions = await emc.getpreviousacademicsession(school_id)
		sessions = sessions.session_id
	}
	else{
		var sessions = req.query.session
	}
	
	for (var i = 0; i < sch_class.length; i++) {
		var file = {}
		var schclass = await connect.SchoolClass.findOne({where:{id:sch_class[i].school_class_id}})
		file.name = schclass.name+' '+sch_class[i].arm
		file.ref_id = sch_class[i].id
		var sch = await connect.AcademicSession.count({where:{class_arm_id:sch_class[i].id, school_id:school_id,
		session_id:sessions, leave:0}})
		var teacher = await connect.ClassTeacher.findAll({where: {session_id:req.query.session,class_arm_id:sch_class[i].id}});
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
		file.student = sch
		file.academic_session = req.query.session
		result.push(file)
	}
	console.log(result)
	res.send(result)
	
}

exports.updateclassarm = async function (req, res) {
	var school_id = parseInt(emc.decrypt(req.payload.school))
	var _id = parseInt(emc.decrypt(req.payload._id))
	//console.log(req.body)
	var sch = await connect.ClassArm.findOne({where:{id:req.params.ref_id, school_id:school_id}})
	if(sch){
		var sch = await connect.ClassArm.update({arm:req.body.name, school_class_id:req.body.sch_class, user_id:_id, school_id:school_id}, {where:{id:sch.id}})
	var schclass = await connect.SchoolClass.findOne({where:{id:req.body.sch_class}})
	res.send({status:'ok',msg:'Class Arm updated successful', name:schclass.name+' '+req.body.name, ref_id:req.params.ref_id, 
		arm:req.body.name, sch_class:req.body.sch_class})
	
	}
	else{
		res.send({status:'error',msg:'Class Arm not found'})
	}
	
}

exports.deleteclassarm = async function (req, res) {
	var school_id = parseInt(emc.decrypt(req.payload.school))
	var _id = parseInt(emc.decrypt(req.payload._id))
	//console.log(req.body)
	var sch = await connect.ClassArm.findOne({where:{id:req.params.ref_id, school_id:school_id}})
	if(sch){
		var schs = await connect.ClassArm.destroy({where:{id:sch.id}})
		res.send({status:'ok',msg:'Class Arm delete successful'})
	}
	else{
		res.send({status:'error',msg:'Class Arm not found'})
	}
	
}



exports.getfeestypeadmin = async function (req, res) {
	var school_id = parseInt(emc.decrypt(req.payload.school))
	var _id = emc.decrypt(req.payload._id)
    _id = parseInt(_id)
    var result = []
	var sch_class = await connect.FeesType.findAll({where: {school_id:school_id }, order:[['name', 'ASC']]});
	var add_access = await emc.getuseraccess('Add Fees Type', _id, school_id)
	var edit_access = await emc.getuseraccess('Edit Fees Type', _id, school_id)
	var delete_access = await emc.getuseraccess('Delete Fees Type', _id, school_id)
	for (var i = 0; i < sch_class.length; i++) {
		var file = {}
		file.name = sch_class[i].name
		file.ref_id = sch_class[i].id
		result.push(file)
		
	}
	//console.log(result)
	res.send({status:'ok', data:result, add:add_access, edit:edit_access, delete:delete_access})
}

exports.getfeestype = async function (req, res) {
	var school_id = parseInt(emc.decrypt(req.payload.school))
	var _id = emc.decrypt(req.payload._id)
    _id = parseInt(_id)
    var result = []
	var sch_class = await connect.FeesType.findAll({where: {school_id:school_id }, order:[['name', 'ASC']]});
	for (var i = 0; i < sch_class.length; i++) {
		var file = {}
		file.name = sch_class[i].name
		file.ref_id = sch_class[i].id
		result.push(file)
		
	}
	//console.log(result)
	res.send(result)
}


exports.postfeestype = async function (req, res) {
	var school_id = parseInt(emc.decrypt(req.payload.school))
	var _id = parseInt(emc.decrypt(req.payload._id))
	//console.log(req.body)
	var sch = await connect.FeesType.create({name:req.body.name, user_id:_id, school_id:school_id})
	res.send({status:'ok',msg:'Fees Type created successful', name:sch.dataValues.name, ref_id:sch.dataValues.id})
	
}
exports.updatefeestype = async function (req, res) {
	var school_id = parseInt(emc.decrypt(req.payload.school))
	var _id = parseInt(emc.decrypt(req.payload._id))
	console.log(req.body)
	var sch = await connect.FeesType.findOne({where:{id:req.params.ref_id, school_id:school_id}})
	if(sch){
		var schs = await connect.FeesType.update({name:req.body.name, user_id:_id}, {where:{id:sch.id}})
		res.send({status:'ok',msg:'Fees Type updated successful', name:req.body.name, ref_id:req.params.ref_id})
	}
	else{
		res.send({status:'error',msg:'Fees Type not found'})
	}
	
}

exports.deletefeestype = async function (req, res) {
	var school_id = parseInt(emc.decrypt(req.payload.school))
	var _id = parseInt(emc.decrypt(req.payload._id))
	console.log(req.body)
	var sch = await connect.FeesType.findOne({where:{id:req.params.ref_id, school_id:school_id}})
	if(sch){
		var schs = await connect.FeesType.destroy({where:{id:sch.id}})
		res.send({status:'ok',msg:'Fees Type delete successful'})
	}
	else{
		res.send({status:'error',msg:'Fees Type not found'})
	}
	
}


exports.postsession = async function (req, res) {
	var school_id = parseInt(emc.decrypt(req.payload.school))
	var _id = parseInt(emc.decrypt(req.payload._id))
	console.log(req.body)
	var sch = await connect.Session.create({name:req.body.name, first_term_start:moment(req.body.first_start).add(3, 'hours').format(), first_term_end:req.body.first_end, 
		second_term_start:moment(req.body.second_start).add(3, 'hours').format(), second_term_end:req.body.second_end, 
		third_term_start:moment(req.body.third_start).add(3, 'hours').format(), third_term_end:req.body.third_end,  user_id:_id, school_id:school_id})
	var first = moment(sch.dataValues.first_term_start).format('MMM, D, YYYY') +' - ' +moment(sch.dataValues.first_term_end).format('MMM, D, YYYY')
	var second = moment(sch.dataValues.second_term_start).format('MMM, D, YYYY') +' - ' +moment(sch.dataValues.second_term_end).format('MMM, D, YYYY')
	var third = moment(sch.dataValues.third_term_start).format('MMM, D, YYYY') +' - '+ moment(sch.dataValues.third_term_end).format('MMM, D, YYYY')
	res.send({status:'ok',msg:'Academic session created successful', name:sch.dataValues.name, ref_id:sch.dataValues.id, first_term:first, second_term:second, third_term:third})
}


exports.getsessionadmin = async function (req, res) {
	var school_id = parseInt(emc.decrypt(req.payload.school))
	var _id = emc.decrypt(req.payload._id)
    _id = parseInt(_id)
    var result = []
	var sch_class = await connect.Session.findAll({where: {school_id:school_id }, order:[['id', 'ASC']]});
	var add_access = await emc.getuseraccess('Add Academic Session', _id, school_id)
	var edit_access = await emc.getuseraccess('Edit Academic Session', _id, school_id)
	var delete_access = await emc.getuseraccess('Remove Academic Session', _id, school_id)
	
	for (var i = 0; i < sch_class.length; i++) {
		var sch = sch_class[i]
		var file = {}
		var first = moment(sch.first_term_start).format('MMM, D, YYYY') +' - ' +moment(sch.first_term_end).format('MMM, D, YYYY')
		var second = moment(sch.second_term_start).format('MMM, D, YYYY') +' - ' +moment(sch.second_term_end).format('MMM, D, YYYY')
		var third = moment(sch.third_term_start).format('MMM, D, YYYY') +' - '+ moment(sch.third_term_end).format('MMM, D, YYYY')
		file.name = sch_class[i].name
		file.ref_id = sch_class[i].id
		file.first_term = first
		file.second_term = second
		file.third_term = third
		result.push(file)
		
	}
	//console.log(result)
	
	res.send({status:'ok', data:result, add:add_access, edit:edit_access, delete:delete_access})
}
exports.getsession = async function (req, res) {
	var school_id = parseInt(emc.decrypt(req.payload.school))
	var _id = emc.decrypt(req.payload._id)
    _id = parseInt(_id)
    var result = []
	var sch_class = await connect.Session.findAll({where: {school_id:school_id }, order:[['id', 'ASC']]});
	
	
	for (var i = 0; i < sch_class.length; i++) {
		var sch = sch_class[i]
		var file = {}
		var first = moment(sch.first_term_start).format('MMM, D, YYYY') +' - ' +moment(sch.first_term_end).format('MMM, D, YYYY')
		var second = moment(sch.second_term_start).format('MMM, D, YYYY') +' - ' +moment(sch.second_term_end).format('MMM, D, YYYY')
		var third = moment(sch.third_term_start).format('MMM, D, YYYY') +' - '+ moment(sch.third_term_end).format('MMM, D, YYYY')
		file.name = sch_class[i].name
		file.ref_id = sch_class[i].id
		file.first_term = first
		file.second_term = second
		file.third_term = third
		result.push(file)
		
	}
	//console.log(result)
	res.send(result)
	
}

exports.deletesession = async function (req, res) {
	var school_id = parseInt(emc.decrypt(req.payload.school))
	var _id = parseInt(emc.decrypt(req.payload._id))
	console.log(req.body)
	var sch = await connect.Session.findOne({where:{id:req.params.ref_id, school_id:school_id}})
	if(sch){
		var schs = await connect.Session.destroy({where:{id:sch.id}})
		res.send({status:'ok',msg:'Academic session delete successful'})
	}
	else{
		res.send({status:'error',msg:'Academic session not found'})
	}
	
}

exports.getsessionbyid = async function (req, res) {
	var school_id = parseInt(emc.decrypt(req.payload.school))
	var _id = emc.decrypt(req.payload._id)
    _id = parseInt(_id)
    var result = []
	var sch = await connect.Session.findOne({where: {school_id:school_id, id:req.params.ref_id }, order:[['id', 'ASC']]});
	if(!sch){
		res.send({status:'error', msg:'Academic session not found'})
	}
	else{
		var file = {}
		file.name = sch.name
		file.ref_id = sch.id
		file.first_start = sch.first_term_start
		file.first_end = sch.first_term_end
		file.second_start = sch.second_term_start
		file.second_end = sch.second_term_end
		file.third_start = sch.third_term_start
		file.third_end = sch.third_term_end
		res.send({status:'ok', data:file})
	}
	
	
}

exports.updatesession = async function (req, res) {
	var school_id = parseInt(emc.decrypt(req.payload.school))
	var _id = parseInt(emc.decrypt(req.payload._id))
	console.log(req.body)
	var schs = await connect.Session.findOne({where:{id:req.params.ref_id, school_id:school_id}})
	if(schs){
		var sch = await connect.Session.update({name:req.body.name, first_term_start:moment(req.body.first_start).add(3, 'hours').format(), first_term_end:req.body.first_end, 
		second_term_start:moment(req.body.second_start).add(3, 'hours').format(), second_term_end:req.body.second_end, 
		third_term_start:moment(req.body.third_start).add(3, 'hours').format(), third_term_end:req.body.third_end,  user_id:_id, school_id:school_id}, {where:{id:schs.id}})
		res.send({status:'ok',msg:'Academic session update successful'})
	}
	else{
		res.send({status:'error',msg:'Academic session not found'})
	}
}


exports.postfees_registrar = async function (req, res) {
	var school_id = parseInt(emc.decrypt(req.payload.school))
	var _id = parseInt(emc.decrypt(req.payload._id))
	//console.log(req.body)
	var cls = JSON.parse(req.body.student_class)
	var ref_id = []
	for(var i = 0; i < cls.length; i++)
	{
		var file = {amount:req.body.amount, fees_types_id:req.body.fees_type, session_id:req.body.academic_session, 
			term:req.body.session_term, school_class_id:cls[i],user_id:_id, school_id:school_id}
		console.log(file)
		var sch = await connect.SchoolFees.create(file)
		ref_id.push({ref_id:sch.dataValues.id, cls:cls[i]})
		
	
	}
	res.send({status:'ok',msg:'School Fees created successful', ref_id:JSON.stringify(ref_id)})
}

exports.updatefees_registrar = async function (req, res) {
	var school_id = parseInt(emc.decrypt(req.payload.school))
	var _id = parseInt(emc.decrypt(req.payload._id))
	console.log(req.body)
	var file = {amount:req.body.amount, fees_types_id:req.body.fees_type, session_id:req.body.academic_session, 
			term:req.body.session_term, school_class_id:req.body.student_class,user_id:_id, school_id:school_id}
	console.log(file)
	var sch = await connect.SchoolFees.findOne({where:{id:req.params.ref_id}})
	if(!sch){
		res.send({status:'error', msg:'Fees information not found!'})
	}
	else{
		var sc = await connect.SchoolFees.update(file, {where:{id:sch.id}})
		res.send({status:'ok', msg:'Fees information update successful!'})
	}
}


exports.deletefees_registrar = async function (req, res) {
	var school_id = parseInt(emc.decrypt(req.payload.school))
	var _id = parseInt(emc.decrypt(req.payload._id))
	var sch = await connect.SchoolFees.findOne({where:{id:req.params.ref_id}})
	if(!sch){
		res.send({status:'error', msg:'Fees information not found!'})
	}
	else{
		var sc = await connect.StudentBill.findOne({where:{school_fees_id:sch.id}})
		if(!sc){
			var scc = await connect.SchoolFees.destroy({where:{id:sch.id}})
			res.send({status:'ok', msg:'Fees information delete successful!'})
		}
		else{
			res.send({status:'error', msg:'Fees information cannot be deleted, fees have reference with student payment!'})
		}
		
	}
}

exports.getfees_registrar = async function (req, res) {
	var school_id = parseInt(emc.decrypt(req.payload.school))
	var _id = emc.decrypt(req.payload._id)
    _id = parseInt(_id)
    var result = []
	var query = {school_id:school_id}
	if(req.query.academic_session == '' || req.query.academic_session == 'Any')
	{}
	else{
		query.session_id = req.query.academic_session
	}
	if(req.query.session_term == '' || req.query.session_term == 'Any')
	{}
	else{
		query.term = req.query.session_term
	}
	if(req.query.student_class == '' || req.query.student_class == 'Any')
	{}
	else{
		query.school_class_id = req.query.student_class
	}
	if(req.query.fees_type == '' || req.query.fees_type == 'Any')
	{}
	else{
		query.fees_types_id = req.query.fees_type
	}
	//console.log(query)
	
	var sch_class = await connect.SchoolFees.findAll({where: query, order:[['id', 'ASC']]});
	//console.log(sch_class)

	for (var i = 0; i < sch_class.length; i++) {
		var sch = sch_class[i]
		var cls = await connect.SchoolClass.findOne({where: {id:sch.school_class_id}});
		var fees = await connect.FeesType.findOne({where: {id:sch.fees_types_id }});
		var session = await connect.Session.findOne({where: {id:sch.session_id }});
		var file = {}
		file.amount = sch_class[i].amount
		file.ref_id = sch_class[i].id
		file.term = sch_class[i].term
		file.session = session.name
		file.student_class = cls.name
		file.fees = fees.name
		result.push(file)
	}
	//console.log(result)
	res.send(result)
}


exports.getfees_registraradmin = async function (req, res) {
	var school_id = parseInt(emc.decrypt(req.payload.school))
	var _id = emc.decrypt(req.payload._id)
    _id = parseInt(_id)
    var result = []
	var query = {school_id:school_id}
	if(req.query.academic_session == '' || req.query.academic_session == 'Any')
	{}
	else{
		query.session_id = req.query.academic_session
	}
	if(req.query.session_term == '' || req.query.session_term == 'Any')
	{}
	else{
		query.term = req.query.session_term
	}
	if(req.query.student_class == '' || req.query.student_class == 'Any')
	{}
	else{
		query.school_class_id = req.query.student_class
	}
	if(req.query.fees_type == '' || req.query.fees_type == 'Any')
	{}
	else{
		query.fees_types_id = req.query.fees_type
	}
	//console.log(query)
	var add_access = await emc.getuseraccess('Add Fees', _id, school_id)
	var edit_access = await emc.getuseraccess('Edit Fees', _id, school_id)
	var delete_access = await emc.getuseraccess('Remove Fees', _id, school_id)
	var sch_class = await connect.SchoolFees.findAll({where: query, order:[['id', 'ASC']]});
	//console.log(sch_class)

	for (var i = 0; i < sch_class.length; i++) {
		var sch = sch_class[i]
		var cls = await connect.SchoolClass.findOne({where: {id:sch.school_class_id}});
		var fees = await connect.FeesType.findOne({where: {id:sch.fees_types_id }});
		var session = await connect.Session.findOne({where: {id:sch.session_id }});
		var file = {}
		file.amount = sch_class[i].amount
		file.ref_id = sch_class[i].id
		file.term = sch_class[i].term
		file.session = session.name
		file.student_class = cls.name
		file.fees = fees.name
		file.fees_id = fees.id
		file.session_id = session.id
		file.student_class_id = cls.id
		result.push(file)
	}
	//console.log(result)
	res.send({status:'ok', data:result, add:add_access, edit:edit_access, delete:delete_access})
}

exports.getsessionname = async function (req, res) {
	var school_id = parseInt(emc.decrypt(req.payload.school))
	var _id = emc.decrypt(req.payload._id)
    _id = parseInt(_id)
    var result = []
	var sch_class = await connect.SessionName.findAll({ order:[['index', 'ASC']]});
	//console.log(sch_class)
	for (var i = 0; i < sch_class.length; i++) {
		var sch = sch_class[i]
		var file = {}
		file.name = sch_class[i].name
		file.ref_id = sch_class[i].id
		result.push(file)
		
	}
	//console.log(result)
	res.send(result)
}

exports.getacademicsession = async function (req, res) {
	var school_id = parseInt(emc.decrypt(req.payload.school))
	var _id = emc.decrypt(req.payload._id)
    _id = parseInt(_id)
    var result = []
	var academic = await emc.getacademicsession(school_id)
	
	//console.log(file)
	res.send(academic)
}



exports.getschoolbill = async function (req, res) {
	var school_id = parseInt(emc.decrypt(req.payload.school))
	var _id = emc.decrypt(req.payload._id)
    _id = parseInt(_id)
    var result = []
	var academic = await emc.getacademicsession(school_id)
	if(academic  == {}){}
	else{
		var query = {school_id:school_id}
		var sch_class = await connect.ClassArm.findAll({where: {school_id:school_id }, order:[['id', 'ASC']]});
		for (var i = 0; i < sch_class.length; i++) {
			var schclass = await connect.SchoolClass.findOne({where:{id:sch_class[i].school_class_id}})
			
			var fees = await connect.SchoolFees.findAll({where: {school_class_id:sch_class[i].school_class_id, session_id:academic.session_id, term:academic.term}, order:[['id', 'ASC']]});
			if(fees.length == 0){}
			else{
				var file = {}
				file.name = schclass.name+' '+sch_class[i].arm
				file.class_id = sch_class[i].id
				file.class_type = 'Arm'
				var ress = []
				for(var s = 0; s < fees.length; s++)
				{
					var info = {}
					var fees_info = await connect.FeesType.findOne({where: {id:fees[s].fees_types_id }});
					info.amount = fees[s].amount
					info.ref_id = fees[s].id
					info.fees = fees_info.name
					ress.push(info)
				}
				file.fees = ress.sort(emc.GetSortOrder('fees'))
				result.push(file)
			}
		}
		console.log(academic.term)
		if(academic.term == 'First Term'){
			var schclass = await connect.SchoolClass.findAll({})
			for (let i = 0; i < schclass.length; i++) {
				
				var fees = await connect.SchoolFees.findAll({where: {school_class_id:schclass[i].id, session_id:academic.session_id, term:academic.term}, order:[['id', 'ASC']]});
				if(fees.length == 0){}
				else{
					var file = {}
					file.name = schclass[i].name
					file.class_id = schclass[i].id
					file.class_type = 'Class'
					var ress = []
					for(var s = 0; s < fees.length; s++)
					{
						var info = {}
						var fees_info = await connect.FeesType.findOne({where: {id:fees[s].fees_types_id }});
						info.amount = fees[s].amount
						info.ref_id = fees[s].id
						info.fees = fees_info.name
						ress.push(info)
					}
					file.fees = ress.sort(emc.GetSortOrder('fees'))
					result.push(file)
				}
			}
		}
		
	}
	console.log(result)
	res.send(result)
	
}


exports.getstudentschoolbill = async function (req, res) {
	var school_id = parseInt(emc.decrypt(req.payload.school))
	var _id = emc.decrypt(req.payload._id)
    _id = parseInt(_id)
    var result = []
	var query = {}
	var academic = await emc.getacademicsession(school_id)
	if(academic  == {}){}
	else{
		console.log(req.query)
		
		var session = await connect.AcademicSession.findAll({where:{session_id:academic.session_id, class_arm_id:req.query.student_class, school_id:school_id, leave:0}});
		//console.log(session)
		for(var i = 0; i < session.length; i++){
			
			var q = {session_id:academic.session_id, term:academic.term, student_id:session[i].student_id, 
				class_arm_id:session[i].class_arm_id,school_fees_id:req.query.fees_type }
			
			var info = await connect.StudentBill.findOne({where:q});
			if(!info){
				var file = {}
				var student = await connect.Student.findOne({where:{id:session[i].student_id}});
				file.name = student.surname+' '+student.middlename+' '+student.firstname
				file.student_id = student.id
				result.push(file)
			}
			
		}
		
	}
	console.log(result)
	res.send(result)
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
		var student = JSON.parse(req.body.student)
		for(var i = 0; i < student.length; i++)
		{
			var fees = await connect.SchoolFees.findOne({where: {id:req.body.fees_type}, order:[['id', 'ASC']]});
			var ad = await connect.StudentBillTotal.findOne({where:{session_id:academic.session_id, term:academic.term, student_id:student[i], class_arm_id:req.body.student_class}});
			if(!ad){
				var info = await connect.StudentBillTotal.findOne({where:{session_id:academic.prev_session_id, term:academic.previous_term, student_id:student[i]}});
				if(!info){}
				else{
					var file = {session_id:academic.session_id, term:academic.term, student_id:student[i], class_arm_id:req.body.student_class,
					fees_types_id:0, school_fees_id:0, fees_name:'Outstanding Bill',category:'outstanding',
					amount:info.balance, payment:0, weaver:0, fine:0, balance: info.balance, user_id:_id, school_id:school_id}
					console.log(file)
					
					var total = {session_id:academic.session_id, term:academic.term, student_id:student[i], class_arm_id:req.body.student_class,
						amount:info.balance, payment:0, weaver:0, fine:0,balance: info.balance, user_id:_id, school_id:school_id}
					console.log(total)
					var sch = await connect.StudentBill.create(file)
					var sch = await connect.StudentBillTotal.create(total)
				}
			}
			
			var fees_types = await connect.FeesType.findOne({where: {id:fees.fees_types_id}, order:[['id', 'ASC']]});
			var file = {session_id:academic.session_id, term:academic.term, student_id:student[i], class_arm_id:req.body.student_class,
				fees_types_id:fees.fees_types_id, school_fees_id:req.body.fees_type, fees_name:fees_types.name,category:'bill',
				amount:req.body.amount, payment:0, weaver:0, fine:0, balance: req.body.amount, user_id:_id, school_id:school_id}
			console.log(file)
				var sch = await connect.StudentBill.create(file)
			var info = await connect.StudentBillTotal.findOne({where:{session_id:academic.session_id, term:academic.term, student_id:student[i], class_arm_id:req.body.student_class}});
			if(!info)
			{
				var total = {session_id:academic.session_id, term:academic.term, student_id:student[i], class_arm_id:req.body.student_class,
				amount:req.body.amount, payment:0,balance: req.body.amount, weaver:0, fine:0, user_id:_id, school_id:school_id}
				var sch = await connect.StudentBillTotal.create(total)
			}
			else{
				var amt = math.chain(req.body.amount).add(info.amount).done()
				var bal = math.chain(req.body.amount).add(info.balance).done()
				var total = {amount:amt, balance: bal}
				var sch = await connect.StudentBillTotal.update(total, {where:{id:info.id}})
			}
		}
		res.send({status:'ok', msg:'Bill assign successful!'})
	}
	
}



exports.getschoolaccountadmin = async function (req, res) {
	var school_id = parseInt(emc.decrypt(req.payload.school))
	var _id = emc.decrypt(req.payload._id)
    _id = parseInt(_id)
    var result = []
	var sch_class = await connect.SchoolAccount.findAll({where: {school_id:school_id, active:true }, order:[['id', 'ASC']]});
	var add_access = await emc.getuseraccess('Add School Account', _id, school_id)
	var edit_access = await emc.getuseraccess('Edit School Account', _id, school_id)
	var delete_access = await emc.getuseraccess('Remove School Account', _id, school_id)
	for (var i = 0; i < sch_class.length; i++) {
		var file = {}
		file.bank = sch_class[i].bank
		file.account_no = sch_class[i].account_no
		file.ref_id = sch_class[i].id
		result.push(file)
		
	}
	//console.log(result)
	res.send({status:'ok', data:result, add:add_access, edit:edit_access, delete:delete_access})
}

exports.getschoolaccount = async function (req, res) {
	var school_id = parseInt(emc.decrypt(req.payload.school))
	var _id = emc.decrypt(req.payload._id)
    _id = parseInt(_id)
    var result = []
	var sch_class = await connect.SchoolAccount.findAll({where: {school_id:school_id, active:true }, order:[['id', 'ASC']]});
	for (var i = 0; i < sch_class.length; i++) {
		var file = {}
		file.bank = sch_class[i].bank
		file.account_no = sch_class[i].account_no
		file.ref_id = sch_class[i].id
		result.push(file)
		
	}
	//console.log(result)
	res.send(result)
}


exports.postschoolaccount = async function (req, res) {
	var school_id = parseInt(emc.decrypt(req.payload.school))
	var _id = parseInt(emc.decrypt(req.payload._id))
	//console.log(req.body)
	var sch = await connect.SchoolAccount.create({account_no:req.body.account_no, bank:req.body.bank, active:true,user_id:_id, school_id:school_id})
	res.send({status:'ok',msg:'School account created successful', account_no:sch.dataValues.account_no, bank:sch.dataValues.bank, ref_id:sch.dataValues.id})
	
}
exports.updateschoolaccount = async function (req, res) {
	var school_id = parseInt(emc.decrypt(req.payload.school))
	var _id = parseInt(emc.decrypt(req.payload._id))
	console.log(req.body)
	var sch = await connect.SchoolAccount.findOne({where:{id:req.params.ref_id, school_id:school_id}})
	if(sch){
		var schs = await connect.SchoolAccount.update({account_no:req.body.account_no, bank:req.body.bank, user_id:_id}, {where:{id:sch.id}})
		res.send({status:'ok',msg:'School account updated successful', account_no:req.body.account_no, bank:req.body.bank, ref_id:req.params.ref_id})
	}
	else{
		res.send({status:'error',msg:'School account not found'})
	}
	
}

exports.deleteschoolaccount = async function (req, res) {
	var school_id = parseInt(emc.decrypt(req.payload.school))
	var _id = parseInt(emc.decrypt(req.payload._id))
	console.log(req.body)
	var sch = await connect.SchoolAccount.findOne({where:{id:req.params.ref_id, school_id:school_id}})
	if(sch){
		var schs = await connect.SchoolAccount.update({active:false},{where:{id:sch.id}})
		res.send({status:'ok',msg:'School account delete successful'})
	}
	else{
		res.send({status:'error',msg:'School account not found'})
	}
	
}


exports.promotestudent = async function (req, res) {
	console.log(req.query)
	var current = await connect.AcademicSession.findAll({where:{session_id:1, class_arm_id:req.query.current, leave:0}})
	console.log(current.length)
	for(let s = 0; s < current.length; s++){
		var file = {session_id:req.query.session,class_arm_id:req.query.to, student_id:current[s].student_id,
		term:'First Term', leave:0, user_id:1, school_id:1 }
		console.log(file)
		connect.AcademicSession.create(file)
	}
	res.send({status:'ok'})
}