var crypto = require('crypto'),
    algorithm = 'aes-256-ctr',
	password = 'mgjydtsd6F3Efeq';
	const ENCRYPTION_KEY = 'dgffgdftbsxddffhnca2332cfddddffz'; // Must be 256 bits (32 characters)
const IV_LENGTH = 16; // For AES, this is always 16
var moment = require('moment')
var connect = require("../config/config");
var exports = module.exports = {};

exports.encrypt = function(text){
	let iv = crypto.randomBytes(IV_LENGTH);
	let cipher = crypto.createCipheriv('aes-256-cbc', new Buffer.from(ENCRYPTION_KEY), iv);
	let encrypted = cipher.update(text);

	encrypted = Buffer.concat([encrypted, cipher.final()]);
	return iv.toString('hex') + ':' + encrypted.toString('hex');
}


exports.decrypt = function(text){
	let textParts = text.split(':');
	let iv = new Buffer.from(textParts.shift(), 'hex');
	let encryptedText = new Buffer.from(textParts.join(':'), 'hex');
	let decipher = crypto.createDecipheriv('aes-256-cbc', new Buffer.from(ENCRYPTION_KEY), iv);
	let decrypted = decipher.update(encryptedText);

	decrypted = Buffer.concat([decrypted, decipher.final()]);
	return decrypted.toString();
}

	exports.encrypts = function(text){
		var cipher = crypto.createCipher(algorithm,password)
		  var crypted = cipher.update(text,'utf8','hex')
		  crypted += cipher.final('hex');
		  return crypted;
	};
	exports.decrypts = function(text){
		var decipher = crypto.createDecipher(algorithm,password)
	  var dec = decipher.update(text,'hex','utf8')
	  dec += decipher.final('utf8');
	  return dec;
	}
	
	exports.randomPassword = function(){
		var chars = "abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNOP1234567890";
		var pass = "";
		for (var x = 0; x < 6; x++) {
			var i = Math.floor(Math.random() * chars.length);
			pass += chars.charAt(i);
		}
		return pass;
	}
	
	
	exports.decodeBase64Image = function(dataString) 
{
   var matches = dataString.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
   //console.log(matches)
   var response = {};

   if (matches.length !== 3) 
   {
      return new Error('Invalid input string');
   }

   response.type = matches[1];
   response.data = new Buffer(matches[2], 'base64');

   return response;
}

exports.convertDate = function(dt, status) {
	var dt_ = dt.split('/')
	if (dt_.length == 3) {
		if (status == 'e') {
			var tod = new Date(dt_[2], parseInt(dt_[1]) - 1, dt_[0]);
			tod.setHours(0, 0, 0, 0);
			var t = moment(tod).add(1, 'days')
			var today = new Date(t.format())
			console.log(today)

		} else {
			var today = new Date(dt_[2], parseInt(dt_[1]) - 1, dt_[0]);
			console.log(today)

		}

		return today
	} else {
		var today = new Date();
		console.log(today)
		return today

	}

}
exports.convertToDate = function (dt, status){
	var dt_ = dt.split('/')
	if(dt_.length == 3){
		if(parseInt(dt_[1]) > 12)
		{
			var today = new Date(dt_[2], parseInt(dt_[0]) - 1, dt_[1], 23, 0, 0);
		}
		else{
		var today = new Date(dt_[2], parseInt(dt_[1]) - 1, dt_[0], 23, 0, 0);
		}
		return today
	}
	else{
		var today = new Date();
		return today
	}
	
}

exports.convertToDateString = function (dt, status){
	var dt_ = dt.split('/')
	if(dt_.length == 3){
		var today = new Date(dt_[2], parseInt(dt_[0]) - 1, dt_[1], 23, 0, 0);
		return today
	}
	else{
		var today = new Date();
		return today
	}
	
}

exports.convertLocalDateToUTC = function (dt){
	var dt_ = dt.split('/')
	if(dt_.length == 3){
		var today = new Date(dt_[2], parseInt(dt_[1]) - 1, dt_[0]);
		return today
	}
	else{
		var today = new Date();
		return today
	}
	
}
exports.getuseraccess = async function(text, id, school){
	var user = await connect.User.findOne({where: {id: id, school_id:school}})
	if(user.position == 'Owner'){
		return true
	}
	else{
		var roles = await connect.StaffRole.findOne({where: {user_id: id, school_id:school}})
		if(!roles){
			return false
		}
		else{
			var data = JSON.parse(roles.roles)
			var index = data.indexOf(text);
			if (index > -1) {
				return true
			}
			else{
				return false
			}
		}
	}
}

exports.GetSortOrder = function(prop) {    
    return function(a, b) {    
        if (a[prop] > b[prop]) {    
            return 1;    
        } else if (a[prop] < b[prop]) {    
            return -1;    
        }    
        return 0;    
    }    
} 

exports.getpreviousacademicsession = async function (school_id) {
	var result = []
	var sch_class = await connect.SessionName.findAll({order:[['index', 'ASC']]});
	var temp = []
	var file = {}
	for (var i = 0; i < sch_class.length; i++) {
		var sch = sch_class[i]
		
		var session = await connect.Session.findOne({where: {name:sch.name, school_id:school_id }});
		if(!session){}
		else{
			temp.push(session)
			var third = moment(session.third_term_end).diff(moment(), 'days')
			
			if(third >= 0){
				if(temp.length == 1){
					file.previous_session = ''
					file.session = session.name
					file.session_id = session.id
					file.prev_session_id = 0
					break
				}
				else{
					var t = temp.length - 2
					var prev = temp[t]
					file.previous_session = prev.name
					file.session = session.name
					file.session_id = session.id
					file.prev_session_id = prev.id
					break
				}
			}
		}
	}
	return file
}
exports.getacademicsession = async function (school_id) {
	var result = []
	var sch_class = await connect.SessionName.findAll({order:[['index', 'ASC']]});
	var temp = []
	var file = {}
	for (var i = 0; i < sch_class.length; i++) {
		var sch = sch_class[i]
		
		var session = await connect.Session.findOne({where: {name:sch.name, school_id:school_id }});
		//console.log(session)
		if(!session){}
		else{
			temp.push(session)
			var first = moment(session.first_term_end).diff(moment(), 'days')
			var second = moment(session.second_term_end).diff(moment(), 'days')
			var third = moment(session.third_term_end).diff(moment(), 'days')
			// console.log(first)
			// console.log(second)
			// console.log(third)
			if(first >= 0){
				if(temp.length == 1){
					file.previous_session = ''
					file.previous_term = ''
					file.session = session.name
					file.term = 'First Term'
					file.session_id = session.id
					file.prev_session_id = 0
					break
				}
				else{
					var t = temp.length - 2
					var prev = temp[t]
					file.previous_session = prev.name
					file.previous_term = 'Third Term'
					file.session = session.name
					file.term = 'First Term'
					file.session_id = session.id
					file.prev_session_id = prev.id
					break
				}
			}
			else if(second >= 0){
				file.previous_session = session.name
				file.previous_term = 'First Term'
				file.session = session.name
				file.term = 'Second Term'
				file.session_id = session.id
				file.prev_session_id = session.id
				break
			}
			else if(third >= 0){
				file.previous_session = session.name
				file.previous_term = 'Second Term'
				file.session = session.name
				file.term = 'Third Term'
				file.session_id = session.id
				file.prev_session_id = session.id
				break
			}
		}
		

	}
	return file
}

exports.abbr = function(subject){
	if(subject == 'COMPUTER STUDIES'){
		return 'COMP. STUDIES'
	}
	else if(subject == 'AGRICULTURE SCIENCE'){
		return 'AGRIC SCIENCE'
	}
	else if(subject == 'FURTHER MATHEMATICS'){
		return 'FURTHER MATHS'
	}
	else if(subject == 'PHYSICAL EDUCATION'){
		return 'PHYSICAL EDU.'
	}
	else if(subject == 'PHYSICAL AND HEALTH EDUCATION'){
		return 'P.H.E.'
	}
	else if(subject =='BUILDING CONSTRUCTION'){
		return 'B. CONSTRUCTION'
	}
	else if(subject == 'GENERAL METAL WORK'){
		return 'METAL WORK'
	}
	else if(subject == 'TECHNICAL DRAWING'){
		return 'TECH. DRAWING'
	}
	else if(subject == 'FINANCIAL ACCOUNTING'){
		return 'FINANCIAL ACCT'
	}
	else if(subject == 'CHRISTIAN RELIGIOUS STUDIES'){
		return 'C.R.STUDIES'
	}
	else if(subject == 'CHRISTIAN RELIGIOUS KNOWLEDGE'){
		return 'C.R.K'
	}
	else if(subject == 'ISLAMIC RELIGIOUS KNOWLEDGE'){
		return 'I.R.K'
	}
	else if(subject == 'ISLAMIC RELIGIOUS STUDIES'){
		return 'I.R.STUDIES'
	}
	else if(subject == 'LITERATURE IN ENGLISH'){
		return 'LIT IN ENGLISH'
	}
	else if(subject == 'AUTO BODY REPAIR AND SPRAY PAINTING'){
		return 'A.B.R.A.S.P'
	}
	else if(subject == 'AUTOMOBILE PARTS MECHANDISING'){
		return 'AUTOMOBILE P. M'
	}
	else if(subject == 'DYEING AND STARCHING'){
		return 'DYE. & STARCHING'
	}
	else if(subject == 'MACHINE WOOD WORKING'){
		return 'WOOD WORK'
	}
	else if(subject == 'CULTURAL AND CREATIVE ART'){
		return 'C. CREATIVE ART'
	}
	else if(subject == 'COMPUTER EDUCATION'){
		return 'COMPUTER EDU.'
	}
	else if(subject == 'QUANTITATIVE REASONING'){
		return 'QUANTITATIVE R.' 
	}
	else if(subject == 'BASIC SCIENCE AND TECHNOLOGY'){
		return 'BASIC SC. & TECH'
	}
	else if(subject == 'RELIGIOUS AND VALUES EDUCATION'){
		return 'RELIGIOUS & VALUES EDU.'
	}
	else if(subject == 'PRE-VOCATIONAL STUDIES'){
		return 'PRE-VOCATIONAL.'
	}
	else if(subject == 'INFORMATION TECHNOLOGY'){
		return 'INFORMATION TECH.'
	}
	else if(subject =='NATIONAL VALUES EDUCATION'){
		return 'NATIONAL VALUES EDU.'
	}
	else if(subject == 'PREVOCATIONAL STUDIES'){
		return 'PREVOCATIONAL.'
	}
	else if(subject == 'PERSONAL DEVELOPMENT'){
		return 'PERSONAL DEVT.'
	}
	else if(subject == 'PERSONALITY DEVELOPMENT'){
		return 'PERSONALIITY DEVT.'
	}
	else{
		return subject
	}

}

exports.removeduplicate = function(arr){
	var new_arr = []
	for(var i = 0; i < arr.length; i++){
		if(i == 0){
			new_arr.push(arr[i])
		}
		else{
			if(new_arr.indexOf(arr[i]) == -1){
				new_arr.push(arr[i])
			}
		}
	}
	return new_arr
}


exports.validateEmail = function(mail){
	return /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()\.,;\s@\"]+\.{0,1})+([^<>()\.,;:\s@\"]{2,}|[\d\.]+))$/.test(mail);
  };
  