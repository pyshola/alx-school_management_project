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

exports.getexpensestype = async function (req, res) {
	var result = []
  var school = emc.decrypt(req.payload.school)
  var _id = emc.decrypt(req.payload._id)
  var add_access = await emc.getuseraccess('Add Expenses Type', _id, school)
  var edit_access = await emc.getuseraccess('Edit Expenses Type', _id, school)
  var user = await connect.ExpensesType.findAll({where:{ school_id: school  }});
  for(var i = 0; i < user.length; i++){
    var file = {name: user[i].name,ref_id :user[i].id};
     result.push(file) 
  }
    res.send({status:'ok', data:result, add_access:add_access, edit_access:edit_access});
};

exports.postexpensestype = async function (req, res) {
  var school = emc.decrypt(req.payload.school)
  var file = {
    name: req.body.name,
    school_id: school,
  };
  var p = await connect.ExpensesType.create(file);
  res.send({ status: "ok" , ref_id:p.dataValues.id, name:req.body.name});
  
};
exports.updateexpensestype= async function (req, res) {
  var school = emc.decrypt(req.payload.school)
  var file = {
    name: req.body.name
  };
  var user = await connect.ExpensesType.findOne({
    where: { id: req.params.ref_id,school_id:school },
  });
  if (!user) {
    res.send({ status: "error", message:'' });
  } else {
    var p = await connect.ExpensesType.update(file, { where: { id: user.id },
    });
    res.send({ status: "ok" });
  }
};



exports.getpaymentmethod = async function (req, res) {
	var result = []
  var school = emc.decrypt(req.payload.school)
  var _id = emc.decrypt(req.payload._id)
  var add_access = await emc.getuseraccess('Add Payment Method', _id, school)
    var edit_access = await emc.getuseraccess('Edit Payment Method', _id, school)
    
    var user = await connect.PaymentMethod.findAll({where:{ school_id: school },order:[['name', 'ASC']]});
    for(var i = 0; i < user.length; i++){
      var file = {name: user[i].name,ref_id :user[i].id};
       result.push(file) 
    }
      res.send({status:'ok', data:result, add:add_access, edit:edit_access});
  
};

exports.postpaymentmethod = async function (req, res) {
  var school = emc.decrypt(req.payload.school)
    var _id = emc.decrypt(req.payload._id)
    var access = await emc.getuseraccess('Add Payment Method', _id, school)
	if(access == false){
        res.send({status: 'error', message: 'Unauthorised access!'})
	}
	else{
    var file = {
      name: req.body.name,
      school_id: school,
    };
    var p = await connect.PaymentMethod.create(file);
	res.send({ status: "ok" });
  }
  
};
exports.updatepaymentmethod = async function (req, res) {
  var school = emc.decrypt(req.payload.school)
    var _id = emc.decrypt(req.payload._id)
    var access = await emc.getuseraccess('Edit Payment Method', _id, school)
	if(access == false){
        res.send({status: 'error', message: 'Unauthorised access!'})
	}
	else{
    var file = {
      name: req.body.name
    };
    var user = await connect.PaymentMethod.findOne({
      where: { id: req.params.ref_id,school_id:school },
    });
    if (!user) {
      res.send({ status: "error", message:'' });
    } else {
      var p = await connect.PaymentMethod.update(file, { where: { id: user.id },
      });
      res.send({ status: "ok" });
    }
  }
};




exports.addexpenses = async function(req, res){
	console.log(req.body)
	var _id = emc.decrypt(req.payload._id)
    var school = emc.decrypt(req.payload.school)
    _id = parseInt(_id)
	school = parseInt(school)
	var academic = await emc.getacademicsession(school)
	if(academic  == {}){
		res.send({status:'error', msg:'Error academic session not found!'})
	}
	else{
		var exp = await connect.ExpensesType.findOne({where:{ school_id: school, id:req.body.expenses_type  }});
		if(exp){
			var file = {expenses_type_id:req.body.expenses_type, session_id:academic.session_id, term:academic.term, name:req.body.title, amount:req.body.amount,
				description:req.body.description, delete:false, user_id:_id, school_id:school, trans_date:new Date()}
			console.log(file)
			var r = await connect.Expenses.create(file)
				var user = await connect.User.findOne({where:{ school_id: school, id:_id }});
			return res.json({ status: 'ok', msg: 'Expenses add successfully', data:{category:exp.name, ref_id:r.dataValues.id, trans_date:r.dataValues.trans_date,
				title:r.dataValues.name, description:r.dataValues.description, amount:r.dataValues.amount, staff:user.firstname+' '+user.lastname} });
		}
	}
	
	
}

exports.deleteexpenses = async function(req, res){
	var school_id = parseInt(emc.decrypt(req.payload.school))
	var _id = parseInt(emc.decrypt(req.payload._id))
	console.log('delete')
	var access = await emc.getuseraccess('Delete Expenses', _id, school_id)
	if(access){
		var cash = await connect.Expenses.findOne({ where: { id:req.params.ref_id, school_id:school_id } })
		if(!cash){
			res.send({
				status: 'error',
				msg: 'Error, Information not found!'
			})
		}
		else{
			connect.Expenses.update({delete:true, user_id:_id}, {where:{id:cash.id}}).then(function (users) {
				return res.send({ status: 'ok', msg: 'Expenses delete successfully' });
			}).catch(function () {
				res.send({ status: 'error', msg: 'Error please try again' })
			})
		}
	}
}
exports.getexpensesreport = async function(req, res){
	var school_id = parseInt(emc.decrypt(req.payload.school))
	var _id = parseInt(emc.decrypt(req.payload._id))
	//console.log(req.query)
	 var delete_access = await emc.getuseraccess('Delete Expenses', _id, school_id)
	var query = {school_id:school_id, delete:false}
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
		if(go){
			query.term = req.query.session_term
		}
	}
	if(req.query.expenses_type == '' || req.query.expenses_type == 'Any')
	{}
	else{
		query.expenses_type_id = req.query.expenses_type
	}
	if(go == false){
		var s_dt = moment(new Date(req.query.first_start).setHours(0,0,0,0)).format()
		var e_dt = moment(new Date(req.query.first_end).setHours(24,0,0,0)).format()
		query.created_at = { between: [s_dt, e_dt] }
	}
	//console.log(query)
	var info = await connect.Expenses.findAll({where: query, order:[['id', 'ASC']]});
	var result = []
	for(var i = 0; i < info.length; i++)
	{
		var bill = info[i]
		var pay = await connect.ExpensesType.findOne({where:{ school_id: school_id, id:bill.expenses_type_id  }});
		var session = await connect.Session.findOne({where:{id:bill.session_id}});
		var file = {}
		file.amount = bill.amount
		file.trans_date = bill.trans_date
		file.description = bill.description
		file.category = pay.name
		file.academic = bill.term +' '+session.name
		var user = await connect.User.findOne({where:{id:bill.user_id}});
		file.user = user.firstname +' '+user.lastname
		file.ref_id = bill.id
		file.title = bill.name
		//console.log(file)
		result.push(file)
	}
	res.send({status:'ok', data:result, access:delete_access})
}



exports.addotherincome = async function(req, res){
	console.log(req.body)
	var _id = emc.decrypt(req.payload._id)
    var school = emc.decrypt(req.payload.school)
    _id = parseInt(_id)
	school = parseInt(school)
	var academic = await emc.getacademicsession(school)
	if(academic  == {}){
		res.send({status:'error', msg:'Error academic session not found!'})
	}
	else{
		var file = {session_id:academic.session_id, term:academic.term, name:req.body.title, amount:req.body.amount,
				description:req.body.description, delete:false, user_id:_id, school_id:school, trans_date:new Date()}
			console.log(file)
			var r = await connect.Income.create(file)
				var user = await connect.User.findOne({where:{ school_id: school, id:_id }});
			return res.json({ status: 'ok', msg: 'Other income add successfully', data:{ref_id:r.dataValues.id, trans_date:r.dataValues.trans_date,
				title:r.dataValues.name, description:r.dataValues.description, amount:r.dataValues.amount, staff:user.firstname+' '+user.lastname} });
		
	}
	
	
}

exports.deleteotherincome = async function(req, res){
	var school_id = parseInt(emc.decrypt(req.payload.school))
	var _id = parseInt(emc.decrypt(req.payload._id))
	console.log('delete')
	var access = await emc.getuseraccess('Delete Other Income', _id, school_id)
	if(access){
		var cash = await connect.Income.findOne({ where: { id:req.params.ref_id, school_id:school_id } })
		if(!cash){
			res.send({
				status: 'error',
				msg: 'Error, Information not found!'
			})
		}
		else{
			connect.Income.update({delete:true, user_id:_id}, {where:{id:cash.id}}).then(function (users) {
				return res.send({ status: 'ok', msg: 'Other income delete successfully' });
			}).catch(function () {
				res.send({ status: 'error', msg: 'Error please try again' })
			})
		}
	}
}
exports.getotherincomereport = async function(req, res){
	var school_id = parseInt(emc.decrypt(req.payload.school))
	var _id = parseInt(emc.decrypt(req.payload._id))
	//console.log(req.query)
	
	var query = {school_id:school_id, delete:false}
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
		if(go){
			query.term = req.query.session_term
		}
	}
	
	if(go == false){
		var s_dt = moment(new Date(req.query.first_start).setHours(0,0,0,0)).format()
		var e_dt = moment(new Date(req.query.first_end).setHours(24,0,0,0)).format()
		query.created_at = { between: [s_dt, e_dt] }
	}
	//console.log(query)
	var access = await emc.getuseraccess('Delete Other Income', _id, school_id)
	var info = await connect.Income.findAll({where: query, order:[['id', 'ASC']]});
	var result = []
	for(var i = 0; i < info.length; i++)
	{
		var bill = info[i]
		var session = await connect.Session.findOne({where:{id:bill.session_id}});
		var file = {}
		file.amount = bill.amount
		file.trans_date = bill.trans_date
		file.description = bill.description
		file.academic = bill.term +' '+session.name
		var user = await connect.User.findOne({where:{id:bill.user_id}});
		file.user = user.firstname +' '+user.lastname
		file.ref_id = bill.id
		file.title = bill.name
		//console.log(file)
		result.push(file)
	}
	res.send({status:'ok', data:result, access:access})
}



exports.getfinancereport = async function(req, res){
	var school_id = parseInt(emc.decrypt(req.payload.school))
	var _id = parseInt(emc.decrypt(req.payload._id))
	
	var query = {school_id:school_id, delete:false}
	var fee_query = {school_id:school_id}
	var go = false
	if(req.query.academic_session == '' || req.query.academic_session == 'Any')
	{}
	else{
		query.session_id = req.query.academic_session
		fee_query.session_id = req.query.academic_session
		go = true
	}
	if(req.query.session_term == '' || req.query.session_term == 'Any')
	{}
	else{
		if(go){
			query.term = req.query.session_term
			fee_query.term = req.query.session_term
		}
	}
	
	if(go == false){
		var s_dt = moment(new Date(req.query.first_start).setHours(0,0,0,0)).format()
		var e_dt = moment(new Date(req.query.first_end).setHours(24,0,0,0)).format()
		query.created_at = { between: [s_dt, e_dt] }
		fee_query.trans_date = { between: [s_dt, e_dt] }
	}
	console.log(fee_query)
	var income = await connect.Income.findAll({where: query});
	var expense = await connect.Expenses.findAll({where: query});
	var bill = await connect.StudentBillPay.findAll({where: fee_query});
	console.log(income.length)
	console.log(expense.length)
	console.log(bill.length)
	var fees = 0
	var otherincome = 0
	for(var s = 0; s < bill.length; s++){
		fees = math.chain(fees).add(bill[s].payment).done()
	}
	for(var s = 0; s < income.length; s++){
		otherincome = math.chain(otherincome).add(income[s].amount).done()
	}

	var pay = await connect.ExpensesType.findAll({where:{ school_id: school_id}});
	var exp = []
	for(var f = 0; f < pay.length; f++){
		exp.push({ref_id: pay[f].id, name:pay[f].name, amount:0})
	}
	var total_expense = 0
	for(var s = 0; s < expense.length; s++){
		for(var f = 0; f < exp.length; f++){
			if(exp[f].ref_id == expense[s].expenses_type_id){
				exp[f].amount = math.chain(exp[f].amount).add(expense[s].amount).done()
				total_expense = math.chain(total_expense).add(expense[s].amount).done()
			}
		}
	}

	console.log(exp)
	console.log(fees)
	console.log(otherincome)
	res.send({status:200, data:{income:otherincome, fees:fees, expense:total_expense, expense_info:exp}})

}