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

function positionstatus(index){
    if(parseInt(index) == 1){
        return 'st'
    }
    else if(parseInt(index) == 2){
        return 'nd'
    }
    else if(parseInt(index) == 3)
    {
        return 'rd'
    }
    else{
        return 'th'
    }
}


var exports = module.exports = {};


getschoolsubject = async  (school_id, class_arm) => {
	const file = {}
	
		var cls = await connect.SchoolClass.findOne({where:{id:class_arm}})
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
        
		for(let i = 0; i < sch_class.length; i++){
            file[sch_class[i].name] = sch_class[i].id
			// file.name = sch_class[i].name
			// file.ref_id = sch_class[i].id
            // result.push(file)
        }
		
	
    //result.sort(emc.GetSortOrder('name'))
    return file
}


exports.getbroadsheet = async function (req, res) {
    var school_id = parseInt(emc.decrypt(req.payload.school))
    var _id = parseInt(emc.decrypt(req.payload._id))
    console.log(req.query)
    
    
    var studentname = ''
    var gender = ''

    var sch = await connect.School.findOne({where:{id:school_id}})
    //var sch_class = await connect.ClassArm.findOne({where: {id:req.query.class_arm_id }});
    var session = await connect.Session.findOne({where: {school_id:school_id, id:req.query.session}});
    var all_subject = await getschoolsubject(sch.id, req.query.class_arm_id)
    var schclass = await connect.SchoolClass.findOne({where:{id:req.query.class_arm_id}})
    if(schclass.title == 'Secondary'){
        class_category = 'secondary'
        if(schclass.name[0] == 'J')
        {
            var ses = session.name+' '+req.query.term+'  BROADSHEET FOR '+schclass.name
        }
        else{
            var ses = session.name+' '+req.query.term+'  BROADSHEET FOR '+schclass.name
        }
        var sch_info = {name:sch.secondary.toUpperCase(), address:sch.secondary_address.toUpperCase(),sub:'',
        session:ses.toUpperCase(), state_logo:'https://alxproject.virilesoftware.com/images/lag2.jpg', sch_logo:sch.secondary_logo}

        
    }

    else{
        class_category = 'primary'
        var ses = session.name+' '+req.query.term+'  BROADSHEET FOR '+schclass.name
        var sch_info = {name:sch.primary.toUpperCase(), address:sch.primary_address.toUpperCase(),sub:'(CRECHE, NURSERY & PRIMARY SCHOOL)',
        session:ses.toUpperCase(), state_logo:'https://alxproject.virilesoftware.com/images/lag2.jpg', sch_logo:sch.primary_logo}
            
    }
    //console.log(all_subject)
    var leave = 1
    
    const result = []
    var so = await connect.ResultSetup.findOne({where:{session_id:session.id, school_id:school_id, school_class_id:req.query.class_arm_id}})
    if(!so){
        var second_term_forward = true
        var third_term_forward = true
    }
    else{
        var second_term_forward = so.second_term
        var third_term_forward = so.third_term
    }
    var forward = false
    if(req.query.term == 'First Term'){
        leave = 1
        //var ses = session.name+' '+req.query.term+' FOR JUNIOR SECONDARY SCHOOLS'
        forward = true
    }
    if(req.query.term == 'Second Term'){
        leave = 2
        if(second_term_forward){
            forward = true
        }
    }
    if(req.query.term == 'Third Term'){
        leave = 3
        if(third_term_forward){
            forward = true
        }
    }

    var student_class = await connect.ClassArm.findAll({where: {school_class_id:req.query.class_arm_id }, order:[['id', 'ASC']]});
    var academic = []
    for(let k = 0; k < student_class.length; k++){
        var ac = await connect.AcademicSession.findAll({where:{class_arm_id:student_class[k].id, 
            school_id:school_id, session_id:req.query.session, leave:{$lte:leave}}})
        academic = [...academic, ...ac]
    }
    
    
    
    var subject = {}
    const p_subject = Object.keys(all_subject)
    for(let o = 0; o < p_subject.length; o++){
        //console.log(all_subject[p_subject[o]])
        for(let r = 0; r < academic.length; r++)
        {
            var ss = await connect.StudentScore.findOne({where:{academic_session_id:academic[r].id, subject_id:all_subject[p_subject[o]]}})
            if(ss){
                subject[p_subject[o]] = all_subject[p_subject[o]]
                break
            }
        }
               
    }
    //console.log(subject)
    var ave_arr = new Set()
    Promise.all(
        academic.map(async (student) =>{
            var student_info = await connect.Student.findOne({where:{id:student.student_id}})
            var s = student_info.surname+' '+student_info.middlename+' '+student_info.firstname
            var studentnames = s
            var ar = studentnames.split(" ")
            var new_arr = []
            for(var o = 0; o < ar.length; o++){
                if(ar[o].length == 0){}
                else{
                    new_arr.push(ar[0].toUpperCase())
                }
                

            }
            studentname = new_arr.join(" ")

            const subj = Object.keys(subject)
            if(second_term_forward == true){
            }
            else{

            }
            if(third_term_forward == true){
            }
            else{

            }
            let first_term_score = 0
            let second_term_score = 0
            let third_term_score = 0
            let total = 0
            let total_subject = 0
            const score_obj = {}
            score_obj.student_name = studentname
            for(let i = 0; i < subj.length; i++){
                var studentscore = await connect.StudentScore.findOne({where:{academic_session_id:student.id, subject_id:subject[subj[i]]}})
                if(studentscore){
                    if(leave == 1){
                        if(isNaN(parseInt(studentscore.first_term_total))){}
                        else{
                            var sc = studentscore.first_term_total
                            if(isNaN(sc)){
                                score_obj[subj[i]] = ''
                            }
                            else{
                                first_term_score = math.chain(first_term_score).add(sc).done()
                                total =  math.chain(total).add(sc).done()
                                score_obj[subj[i]] = sc
                                total_subject += 1
                            }
                        }  
                    }
                    else if(leave == 2){
                        if(second_term_forward == true){
                            if(isNaN(parseInt(studentscore.first_term_total))){}
                            else{
                                total = math.chain(studentscore.first_term_total).add(total).done()
                                first_term_score = math.chain(first_term_score).add(studentscore.first_term_total).done()
                                total_subject += 1
                            }
                        }
                        if(isNaN(parseInt(studentscore.second_term_total))){
                            score_obj[subj[i]] = ''
                        }
                        else{
                            total = math.chain(studentscore.second_term_total).add(total).done()
                            second_term_score = math.chain(second_term_score).add(studentscore.second_term_total).done()
                            score_obj[subj[i]] = studentscore.second_term_total
                            total_subject += 1
                        } 
                    }
                    else if(leave == 3){
                        if(third_term_forward == true){
                            if(isNaN(parseInt(studentscore.first_term_total))){}
                            else{
                                total = math.chain(studentscore.first_term_total).add(total).done()
                                first_term_score = math.chain(first_term_score).add(studentscore.first_term_total).done()
                                total_subject += 1
                            }
                            if(isNaN(parseInt(studentscore.second_term_total))){}
                            else{
                                total = math.chain(studentscore.second_term_total).add(total).done()
                                second_term_score = math.chain(second_term_score).add(studentscore.second_term_total).done()
                                total_subject += 1
                            }
                        }
                        if(isNaN(parseInt(studentscore.third_term_total))){
                            score_obj[subj[i]] = ''
                        }
                        else{
                            total = math.chain(studentscore.third_term_total).add(total).done()
                            third_term_score = math.chain(third_term_score).add(studentscore.third_term_total).done()
                            score_obj[subj[i]] = studentscore.third_term_total
                            total_subject += 1
                        }  
                          
                          
                    }
                
                }
                
            }
            var ave = math.chain(total).divide(total_subject).done()
            if(isNaN(ave)){}
            else{
                if(!ave_arr.has(ave.toFixed(2))){
                    ave_arr.add(ave.toFixed(2))
                }
                score_obj.average_score_id = ave.toFixed(2)
            }
            if(req.query.term == 'First Term'){
                score_obj.first_term_score = first_term_score
                score_obj.second_term_score = ''
                score_obj.third_term_score = ''
            }
            
            if(req.query.term == 'Second Term'){
                if(forward == false){
                    score_obj.first_term_score = ''
                    score_obj.second_term_score = second_term_score
                    score_obj.third_term_score = ''
                }
                else{
                    score_obj.first_term_score = first_term_score
                    score_obj.second_term_score = second_term_score
                    score_obj.third_term_score = ''
                }
                
            }
            if(req.query.term == 'Third Term'){
                if(forward == false){
                    score_obj.first_term_score = ''
                    score_obj.second_term_score = ''
                    score_obj.third_term_score = third_term_score
                }
                else{
                    score_obj.first_term_score = first_term_score
                    score_obj.second_term_score = second_term_score
                    score_obj.third_term_score = third_term_score
                }
            }
            score_obj.total_score = total
            
            
            return score_obj
            
        })
    ).then((result)=>{
        var average = [...ave_arr].sort((a,b) => b - a)
        //console.log(average)
        //console.log(result)
        result.sort(emc.GetSortOrder('student_name'))
        var sd = Object.keys(subject)
        const st = []
        for(let i = 0; i < sd.length; i++){
            st.push({name:sd[i], abbr:emc.abbr(sd[i])})
        }
        res.send({school_info:sch_info, data:result, average:average, subject:st, brought_forward:forward})
    })
    
    
}