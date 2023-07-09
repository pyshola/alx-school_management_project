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

exports.updatestudentallfees = async function (req, res) {
	
	var infos = await connect.StudentBillTotal.findAll({where:{session_id:2, term:"Second Term"}});
	for(let info of infos){
		var bal = math.chain(info.amount).subtract(info.weaver).subtract(info.payment).done()
		var pa = await connect.StudentBillTotal.update({balance:bal},{where:{id:info.id}});
	}
	res.send({status:'ok', msg:'Student fees updated successful'})
}