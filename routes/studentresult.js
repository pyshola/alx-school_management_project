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

function scoregrade(score){
    if(parseFloat(score) <= 39.4){
        return 'F9'
    }
    if(parseFloat(score) >= 39.5 && parseFloat(score) < 44.5){
        return 'E8'
    }
    if(parseFloat(score) >= 44.5 && parseFloat(score) < 49.5){
        return 'D7'
    }
    if(parseFloat(score) >= 49.5 && parseFloat(score) < 54.5){
        return 'C6'
    }
    if(parseFloat(score) >= 54.5 && parseFloat(score) < 59.5){
        return 'C5'
    }
    if(parseFloat(score) >= 59.5 && parseFloat(score) < 64.5){
        return 'C4'
    }
    if(parseFloat(score) >= 64.5 && parseFloat(score) < 69.5){
        return 'B3'
    }
    if(parseFloat(score) >= 69.5 && parseFloat(score) < 74.5){
        return 'B2'
    }
    if(parseFloat(score) >= 74.5){
        return 'A1'
    }
}

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



function getRatings(score, rating){
    rating.sort(emc.GetSortOrder('min'))
    if(isNaN(parseFloat(score))){
        return ''
    }
    else{
        var sc = parseFloat(score)
        var description = ''
        for(var s = 0; s < rating.length; s++){
            if(parseFloat(sc) >= parseFloat(rating[s].min) && parseFloat(sc) <= parseFloat(rating[s].max)){
                description = rating[s].description
                break
            }
        }
        return description
    }
}


var exports = module.exports = {};


exports.getstudentresult = async function (req, res) {
    var school_id = parseInt(emc.decrypt(req.payload.school))
    var _id = parseInt(emc.decrypt(req.payload._id))
    console.log(req.query)
    
    
    var studentname = ''
    var gender = ''

    var sch = await connect.School.findOne({where:{id:school_id}})
    var sch_class = await connect.ClassArm.findOne({where: {id:req.query.class_arm_id }});
    var session = await connect.Session.findOne({where: {school_id:school_id, id:req.query.session}});
    var subject = []
    if(sch_class && session){
        var report_infos = await connect.ReportCard.findOne({where: {session_id:req.query.session,
            term:req.query.term,class_arm_id:req.query.class_arm_id}});
        if(!report_infos){
            var report_info_date = ''
        }
        else{
            var report_info_date = moment(report_infos.release_date).format('ddd MMM Do, YYYY')
        }
        var schclass = await connect.SchoolClass.findOne({where:{id:sch_class.school_class_id}})
        var so = await connect.ResultSetup.findOne({where:{session_id:session.id, school_id:school_id, school_class_id:sch_class.school_class_id}})
        if(!so){
            var rating = rating_one
            var position = false
            var second_term_forward = false
            var third_term_forward = true
            var file = {rating:JSON.stringify(rating_one), school_class_id:sch_class.school_class_id, session_id:session.id, second_term:false,
                third_term:true, position:false, school_id:school_id, user_id:_id, rating_index:1}
                //console.log(file)
                var ss= await connect.ResultSetup.create(file)
        }
        else{
            var rating = JSON.parse(so.rating)
            var position = so.position
            var second_term_forward = so.second_term
            var third_term_forward = so.third_term
        }
        if(schclass.title == 'Secondary'){
            if(schclass.name[0] == 'J')
            {
                var ses = session.name+' '+req.query.term+' FOR JUNIOR SECONDARY SCHOOLS'
                subject = await connect.Subject.findAll({where: {category:'JSS', [Op.or]: [
                    { school_id:0  },{ school_id:school_id } ] }, order:[['name', 'ASC']]});
                var types = 'junior'
            }
            else{
                var ses = session.name+' '+req.query.term+' FOR SENIOR SECONDARY SCHOOLS'
                subject = await connect.Subject.findAll({where: {category:'SSS', [Op.or]: [
                    { school_id:0  },{ school_id:school_id } ] }, order:[['name', 'ASC']]});
                var types = 'senior'
            }
            var sch_info = {name:sch.secondary.toUpperCase(), address:sch.secondary_address.toUpperCase(),sub:'',
            session:ses.toUpperCase(), state_logo:'https://alxproject.virilesoftware.com/images/lag2.jpg', 
            sch_logo:sch.secondary_logo, category:'secondary', cls:types, signature:sch.secondary_signature}

            var behave = await connect.StudentAssessment.findOne({where:{academic_session_id:req.query.student_id, term:req.query.term, school_id:school_id}})
            if(!behave){
                var student_behavior = {obedience:'5',honesty:'5', self_control:'5', self_reliance:'5', initiative:'5',
                punctuality:'5', neatness:'5', perseverance:'5', attendance:'5', attentiveness:'5', politeness:'5',
                consideration:'5', sociability:'5',promptness:'5', sense_value:'5', handwriting:'5', communication:'5',
                sports:'5', manual_skill:'5', dexterity:'5',indoor_games:'5',ball_games:'5', combative_games:'5',tracks:'5',
                jumps:'5',throws:'5',swimming:'5',weight_lifting:'5'}
                var student_attendance = ''
                var student_comment = {teacher_comment:'', hm_comment:''}
            }
            else{
                var student_behavior = JSON.parse(behave.behavior)
                var student_attendance = behave.attendance
                var student_comment = JSON.parse(behave.comment)
                
            }

        }

        else{
            var ses = session.name+' '+req.query.term+'  REPORT CARD'
            subject = await connect.Subject.findAll({where: {category:'BASIC', [Op.or]: [
                { school_id:0  },{ school_id:school_id } ] }, order:[['name', 'ASC']]});


            var sch_info = {name:sch.primary.toUpperCase(), address:sch.primary_address.toUpperCase(),sub:'(CRECHE, NURSERY & PRIMARY SCHOOL)',
                session:ses.toUpperCase(), state_logo:'https://alxproject.virilesoftware.com/images/lag2.jpg', 
                sch_logo:sch.primary_logo, category:'primary', signature:sch.primary_signature, school_class:schclass.name}

                var behave = await connect.StudentAssessment.findOne({where:{academic_session_id:req.query.student_id, term:req.query.term, school_id:school_id}})
                if(!behave){
                    console.log(schclass.name)
                    if(schclass.name == 'PRE-NURSERY'){
                        var student_behavior = {obedience:'5', honesty:'5', self_control:'5', self_reliance:'5', initiative:'5',
                        punctuality:'5', politeness:'5', perseverance:'5', attendance:'5', attentiveness:'5', 
                        consideration:'5',  sociability:'5', promptness:'5', sense_of_value:'5',
                        handwriting:'5', communication:'5', sport_and_games:'5', manual_skill:'5', dexterity:'5'
                         }
                    }
                    else{

                        var student_behavior = {attentiveness:'5', school_work:'5', cooperating:'5', emotion:'5', health:'5',
                        helping:'5', honesty:'5', leadership:'5', attendance:'5', neatness:'5',
                        perseverance:'5', politeness:'5', punctuality:'5', speaking_writing:'5', drawing_painting:'5', handling_tools:'5',
                        games:'5', handwriting:'5', music:'5', sport:'5', verbal_fluency:'5'}
                    }
                    var student_attendance = ''
                    var student_comment = {teacher_comment:'', hm_comment:''}
                }
                else{
                    var student_behavior = JSON.parse(behave.behavior)
                    var student_attendance = behave.attendance
                    var student_comment = JSON.parse(behave.comment)
                }
        }
        var promo = {}
        if(req.query.term == 'First Term'){
			var leave = 1
            var start = moment(session.first_term_start)
            var end = moment(session.first_term_end)
            if(session.first_open == 0 || !session.first_open){
                var open = end.diff(start, 'days') * 2
                var terminal = end.diff(start, 'weeks')
            }
            else{
                var open = session.first_open
                var terminal = Math.floor(open) + 1
            }
            
            //var terminal = end.diff(start, 'weeks')
            var next_term = moment(session.second_term_start)
            var school_term = 'First Term'
            

		}
		else if(req.query.term == 'Second Term'){
			var leave = 2
            var start = moment(session.second_term_start)
            var end = moment(session.second_term_end)
            if(session.second_open == 0 || !session.second_open){
                var open = end.diff(start, 'days') * 2
                var terminal = end.diff(start, 'weeks')
            }
            else{
                var open = session.second_open
                var terminal = Math.floor(open) + 1
            }
            //var open = end.diff(start, 'days') + 2
            
            //var terminal = 14
            //var open = 138
            //var emp = 2 * terminal
            //open = open - emp
            var next_term = moment(session.third_term_start)
            var school_term = 'Second Term'
            
		}
		else if(req.query.term == 'Third Term'){
			var leave = 3
            var start = moment(session.third_term_start)
            var end = moment(session.third_term_end)
            if(session.third_open == 0 || !session.third_open){
                var open = end.diff(start, 'days') * 2
                var terminal = end.diff(start, 'weeks')
            }
            else{
                var open = session.third_open
                var terminal = Math.floor(open) + 1
            }

            //var open = end.diff(start, 'days')
            //var open = 144
            //var terminal = end.diff(start, 'weeks')
            var terminal = 12
            var session_name = await connect.SessionName.findOne({where: {name:session.name}});
            var ind = session_name.index + 1
            var session_name_new = await connect.SessionName.findOne({where: {index:ind}});
            var session_new = await connect.Session.findOne({where: {name:session_name_new.name}});
            if(session_new){
                var next_term = moment(session_new.first_term_start)
            }
            else{
                var next_term = moment()
            }
            var school_term = 'Third Term'
            var promotion = await connect.StudentPromotion.findOne({where:{academic_session_id:req.query.student_id, school_id:school_id}})
            if(!promotion){
                promo = {comment:'', data:['Promoted', 'Advised to Repeat', 'Promoted on Trial', 'Advised to Withdraw', 'Repeat Class']}
            }
            else{
                promo = {comment:promotion.comment, data:['Promoted', 'Advised to Repeat', 'Promoted on Trial', 'Advised to Withdraw', 'Repeat Class']}
            }
            
            
		}
		else{
			var leave = 1
            var start = moment(session.first_term_start)
            var end = moment(first_term_end)
            if(session.first_open == 0 || !session.first_open){
                var open = end.diff(start, 'days') * 2
                var terminal = end.diff(start, 'weeks')
            }
            else{
                var open = session.first_open
                var terminal = Math.floor(open) + 1
            }
            
            //var open = end.subtract(start, 'days')
            //var terminal = end.diff(start, 'weeks')
            var next_term = moment(session.second_term_start)
		}

        var r_mark = []
        var a_mark = await connect.MarkAcademic.findOne({where: {session_id:req.query.session, term:req.query.term,school_class_id:sch_class.school_class_id}});
		if(!a_mark){
			var mark = await connect.Mark.findAll({where: {school_class_id:sch_class.school_class_id}, order:[['id', 'ASC']]});
			for(var s = 0; s < mark.length; s++){
				var file = {name:mark[s].name, abbr:mark[s].abbr, point:mark[s].point}
				r_mark.push(file)
			}
		}
		else{
			var r_mark = JSON.parse(a_mark.mark)
		}
        var subject_len = subject.length
        var subject_position = []
        for(var s = 0; s < subject_len; s++){
            var file = {ref_id:subject[s].id, name:subject[s].name, abbr:emc.abbr(subject[s].name)}
            var student_acad = await connect.AcademicSession.findAll({where:{class_arm_id:sch_class.id, school_id:school_id, session_id:session.id, leave:{$lte:leave}}})
            var subject_score = []
            var checker = 0
            for(var z = 0; z < student_acad.length; z++){
                var studentscore = await connect.StudentScore.findOne({where:{academic_session_id:student_acad[z].id, subject_id:subject[s].id}})
                if(studentscore){
                    if(leave == 1){
                      if(isNaN(parseInt(studentscore.first_term_total))){}
                      else{
                          var sc = studentscore.first_term_total
                          //console.log(sc)
                          if(isNaN(sc)){}
                            else{
                                subject_score.push(sc)
                            }
                          //subject_score.push(sc)
                          checker = 1

                      }  
                    }
                    else if(leave == 2){
                        var index = 0
                        var total = 0
                        if(second_term_forward == true){
                            if(isNaN(parseInt(studentscore.first_term_total))){}
                            else{
                                total = math.chain(studentscore.first_term_total).add(total).done()
                                index += 1
                                checker = 1
                            }
                        }
                        if(isNaN(parseInt(studentscore.second_term_total))){}
                        else{
                            total = math.chain(studentscore.second_term_total).add(total).done()
                            index += 1
                            checker = 1
                        } 
                        if(parseInt(total) > 0){
                            var ave = math.chain(total).divide(index).done()
                            if(isNaN(ave)){
                                console.log(total)
                            }
                            else{
                                subject_score.push(ave.toFixed(2))
                            }
                            
                        } 
                    }
                    else if(leave == 3){
                        var index = 0
                        var total = 0
                        if(third_term_forward == true){
                            if(isNaN(parseInt(studentscore.first_term_total))){}
                            else{
                                total = math.chain(studentscore.first_term_total).add(total).done()
                                index += 1
                                checker = 1
                            }
                            if(isNaN(parseInt(studentscore.second_term_total))){}
                            else{
                                total = math.chain(studentscore.second_term_total).add(total).done()
                                index += 1
                                checker = 1
                            }
                        }
                        if(isNaN(parseInt(studentscore.third_term_total))){}
                        else{
                            total = math.chain(studentscore.third_term_total).add(total).done()
                            index += 1
                            checker = 1
                        }  
                        if(parseInt(total) > 0){
                            var ave = math.chain(total).divide(index).done()
                            if(isNaN(ave)){
                                console.log(total)
                            }
                            else{
                                subject_score.push(ave.toFixed(2))
                            }
                            //subject_score.push(ave.toFixed(2))
                        } 
                        
                    }
                }
			
            }
            var new_score = emc.removeduplicate(subject_score)
            new_score.sort(function(a, b){return parseFloat(b) - parseFloat(a)})
            //new_score.reverse()
            file.score = new_score
            
            if(checker == 1){
                //console.log(file)
                subject_position.push(file)
            }
        }
        //console.log(subject_position)
        var position_score = []
        var student_no = await connect.AcademicSession.findAll({where:{class_arm_id:sch_class.id, school_id:school_id, session_id:session.id, leave:{$lte:leave}}})
        if(position == false){}
        else{
            
            for(var w = 0; w < student_no.length; w++){
                var average_score = 0
                var average_index = 0
                var student_scores = await connect.StudentScore.findAll({where:{academic_session_id:student_no[w].id}})
                //console.log(student_scores.length)
                for(var y = 0; y < student_scores.length; y++){
                    var studentscore = student_scores[y]
                    if(leave == 1){
                        if(isNaN(parseInt(studentscore.first_term_total))){}
                        else{
                            var sc = studentscore.first_term_total
                            //console.log(sc)
                            if(isNaN(sc)){}
                            else{
                                average_score = math.chain(average_score).add(sc).done()
                                average_index += 100
                            }  
                        }  
                    }
                    else if(leave == 2){
                        if(second_term_forward == true){
                            if(isNaN(parseInt(studentscore.first_term_total))){}
                            else{
                                average_score = math.chain(average_score).add(studentscore.first_term_total).done()
                                average_index += 100                           
                            }
                        }
                        if(isNaN(parseInt(studentscore.second_term_total))){}
                        else{
                            average_score = math.chain(average_score).add(studentscore.second_term_total).done()
                            average_index += 100  
                            
                        }
                    }
                    else if(leave == 3){
                        if(third_term_forward == true){
                            if(isNaN(parseInt(studentscore.first_term_total))){}
                            else{
                                average_score = math.chain(average_score).add(studentscore.first_term_total).done()
                                average_index += 100  
                            }
                            if(isNaN(parseInt(studentscore.second_term_total))){}
                            else{
                                average_score = math.chain(average_score).add(studentscore.second_term_total).done()
                                average_index += 100
                            }
                        }
                        if(isNaN(parseInt(studentscore.third_term_total))){}
                        else{
                            average_score = math.chain(average_score).add(studentscore.third_term_total).done()
                            average_index += 100
                        }
                    }
                }
                if(parseInt(average_score) > 0){
                    //console.log(average_index)
                    //console.log(average_score)
                    var ave = math.chain(average_score).divide(average_index).multiply(100).done()
                    if(isNaN(ave)){}
                    else{
                        position_score.push(ave.toFixed(2))
                    }                              
                } 
            }

        }
        //console.log(position_score)
        position_score = emc.removeduplicate(position_score)
        position_score.sort(function(a, b){return parseFloat(b) - parseFloat(a)})
        var student_no = await connect.AcademicSession.count({where:{class_arm_id:sch_class.id, school_id:school_id, session_id:session.id, leave:{$lte:leave}}})
        
        var student_cls = await connect.AcademicSession.findAll({where:{class_arm_id:sch_class.id, school_id:school_id, session_id:session.id, id:req.query.student_id}})
		var student_result = []
        for(var i = 0; i < student_cls.length; i++){
            var total_score = 0
            var total_score_obtain = 0
            var score_arr = []
            var studentscores = await connect.StudentScore.findAll({where:{academic_session_id:student_cls[i].id}})
            for(var z = 0; z < studentscores.length; z++){
                var studentscore = studentscores[z]
                var stud = await connect.Subject.findOne({where:{id:studentscore.subject_id}})
                
                var subject_total_score_obtain = 0
                if(leave == 1){
                    if(isNaN(parseInt(studentscore.first_term_total))){
                        var score_info = {ref_id:stud.id, name:stud.name, abbr:emc.abbr(stud.name),mark:'',
                            total_score_term:'',
                            total_score:'', percentage:'', position:'', grade:'', rating:''}
                    }
                    else{
                        total_score_obtain = math.chain(total_score_obtain).add(studentscore.first_term_total).done()                        
                        total_score += 100
                        try{
                            var per = studentscore.first_term_total
                            if(isNaN(per))
                            {
                                per = ''
                                var score_info = {ref_id:stud.id, name:stud.name, abbr:emc.abbr(stud.name),mark:'',
                            total_score_term:'',
                            total_score:'', percentage:'', position:'', grade:'', rating:''}
                            }
                            else{
                                per = per
                                for(v = 0; v < subject_position.length; v++){
                                    if(subject_position[v].ref_id == stud.id){
                                        var position_arr = subject_position[v].score
                                        var position_subject = position_arr.indexOf(per) + 1
                                        var grade = scoregrade(per)
                                        var score_info = {ref_id:stud.id, name:stud.name, abbr:emc.abbr(stud.name),mark:studentscore.first_term_score,
                                            total_score_term:studentscore.first_term_total,
                                            total_score:studentscore.first_term_total, percentage:studentscore.first_term_total, 
                                            position:position_subject+''+positionstatus(position_subject),grade:grade, rating:getRatings(per, rating)}
                                        //console.log(subject_position[v])
                                        break 
                                    }
                                }
                            }
                            
                        }
                        catch(err){
                            console.log(err)
                            var per = ''
                            var position_subject = ''
                            var score_info = {ref_id:stud.id, name:stud.name, abbr:emc.abbr(stud.name),mark:'',
                            total_score_term:'',
                            total_score:'', percentage:'', position:'', grade:'', rating:''}
                        }
                        
                    }

                }
                else if(leave == 2){
                    var index = 0
                    var total = 0   
                    if(second_term_forward == true){                   
                        if(isNaN(parseInt(studentscore.first_term_total))){}
                        else{
                            total_score_obtain = math.chain(total_score_obtain).add(studentscore.first_term_total).done()
                            subject_total_score_obtain = math.chain(subject_total_score_obtain).add(studentscore.first_term_total).done()
                            total_score += 100
                            index += 1    
                        }
                    }
                    if(isNaN(parseInt(studentscore.second_term_total))){}
                    else{
                        total_score_obtain = math.chain(total_score_obtain).add(studentscore.second_term_total).done()
                        subject_total_score_obtain = math.chain(subject_total_score_obtain).add(studentscore.second_term_total).done()
                        total_score += 100
                        index += 1
                    }
                    try{
                        var per = math.chain(subject_total_score_obtain).divide(index).done()
                        if(isNaN(per))
                        {
                            per = ''
                            var score_info = {ref_id:stud.id, name:stud.name, abbr:emc.abbr(stud.name),mark:'', total_score_term:'',
                            total_score:'', percentage:per, first:'', position:'', grade:'', rating:''}
                        }
                        else{
                            per = per.toFixed(2)
                            for(v = 0; v < subject_position.length; v++){
                                if(subject_position[v].ref_id == stud.id){
                                    var position_arr = subject_position[v].score
                                    var position_subject = position_arr.indexOf(per) + 1
                                    var grade = scoregrade(per)
                                    var score_info = {ref_id:stud.id, name:stud.name, abbr:emc.abbr(stud.name),mark:studentscore.second_term_score,
                                        total_score_term:studentscore.second_term_total,
                                        total_score:subject_total_score_obtain, percentage:per, grade:grade, rating:getRatings(per, rating),
                                         first:studentscore.first_term_total, position:position_subject+''+positionstatus(position_subject)}
                                    //console.log(subject_position[v])
                                    break 
                                }
                            }
                        }
                        
                    }
                    catch(err){
                        var per = ''
                        var position_subject = ''
                        var score_info = {ref_id:stud.id, name:stud.name, abbr:emc.abbr(stud.name),mark:'', total_score_term:'',
                            total_score:'', percentage:per, first:'', position:position_subject, grade:'', rating:''}
                    }
                    
                    
                    
                    
                    
                    
                }
                else if(leave == 3){ 
                    var index = 0
                    var total = 0 
                    if(third_term_forward == true){                    
                        if(isNaN(parseInt(studentscore.first_term_total))){}
                        else{
                            total_score_obtain = math.chain(total_score_obtain).add(studentscore.first_term_total).done()
                            subject_total_score_obtain = math.chain(subject_total_score_obtain).add(studentscore.first_term_total).done()
                            total_score += 100
                            index += 1                          
                        }
                        if(isNaN(parseInt(studentscore.second_term_total))){}
                        else{
                            total_score_obtain = math.chain(total_score_obtain).add(studentscore.second_term_total).done()
                            subject_total_score_obtain = math.chain(subject_total_score_obtain).add(studentscore.second_term_total).done()
                            total_score += 100
                            index += 1
                        }
                    }
                    if(isNaN(parseInt(studentscore.third_term_total))){}
                    else{
                        total_score_obtain = math.chain(total_score_obtain).add(studentscore.third_term_total).done()
                        subject_total_score_obtain = math.chain(subject_total_score_obtain).add(studentscore.third_term_total).done()
                        total_score += 100
                        index += 1
                    } 
                    try{
                        var per = math.chain(subject_total_score_obtain).divide(index).done()
                        if(isNaN(per))
                        {
                            per = ''
                            var score_info = {ref_id:stud.id, name:stud.name, abbr:emc.abbr(stud.name),mark:'', total_score_term:'',
                            total_score:'', percentage:per, first:'', 
                            second:'',position:'', grade:'', rating:''}
                        }
                        else{
                            per = per.toFixed(2)
                            for(v = 0; v < subject_position.length; v++){
                                if(subject_position[v].ref_id == stud.id){
                                    var position_arr = subject_position[v].score
                                    var position_subject = position_arr.indexOf(per) + 1
                                    var grade = scoregrade(per)
                                    var score_info = {ref_id:stud.id, name:stud.name, abbr:emc.abbr(stud.name),mark:studentscore.third_term_score, total_score_term:studentscore.third_term_total,
                                        total_score:subject_total_score_obtain, percentage:per, first:studentscore.first_term_total, 
                                        second:studentscore.second_term_total,position:position_subject+''+positionstatus(position_subject), 
                                        grade:grade, rating:getRatings(per, rating)} 
                                    //console.log(subject_position[v])
                                    break 
                                }
                            }
                        }
                        
                    }
                    catch(err){
                        console.log(err)
                        var per = ''
                        var position_subject = ''
                        var score_info = {ref_id:stud.id, name:stud.name, abbr:emc.abbr(stud.name),mark:'', total_score_term:'',
                            total_score:'', percentage:per, first:'', 
                            second:'',position:position_subject, grade:'', rating:''} 
                    }
                      
                        
                        
                }
                //console.log(score_info)
                score_arr.push(score_info)
            }


            var file = {}
            file.result = score_arr.sort(emc.GetSortOrder('name'))
            var biodata = {}
            var student = await connect.Student.findOne({where:{id:student_cls[i].student_id}})
            var s = student.surname+' '+student.middlename+' '+student.firstname
            var studentnames = s
            var ar = studentnames.split(" ")
            var new_arr = []
            for(var o = 0; o < ar.length; o++){
                if(ar[o].length == 0){}
                else{
                    var first_char = ar[o].charAt(0).toUpperCase()
                    var rem = ar[o].slice(1)
                    rem = rem.toLowerCase()
                    new_arr.push(first_char + rem)
                }
                
            }
            studentname = new_arr.join(" ")
            gender = student.gender
            biodata.name = s.replace(/\s{2,}/g, ' ');
            biodata.admission_no = student.admission_no
            biodata.dob = moment(student.dob).format('DD/MM/YYYY')
            biodata.gender = student.gender
            biodata.student_class = schclass.name +' '+sch_class.arm
            biodata.passport = student.passport
            biodata.school_code = ''
            biodata.school_opened = open
            if(isNaN(parseInt(student_attendance))){
                biodata.student_present = ''
                biodata.student_absent = open
            }
            else{
                biodata.student_present = student_attendance
                biodata.student_absent = open - parseInt(student_attendance)
            }
            
            biodata.school_begin = start.format('DD-MM-YYYY')
            biodata.school_end = end.format('DD-MM-YYYY')
            biodata.school_next_term = next_term.format('DD-MM-YYYY')
            biodata.terminal = terminal
            biodata.no_in_class = student_no
            
            
            biodata.score_obtainable = total_score
            biodata.score_obtain = total_score_obtain
            if(parseInt(total_score) == 0){
                biodata.percentage = 0
                biodata.position = ''
            }
            else{
                var percentage = math.chain(total_score_obtain).divide(total_score).multiply(100).done()
                var pers = percentage.toFixed(2)
                biodata.percentage = pers
                if(position == false){
                    biodata.position = ''
                }
                else{
                    //console.log(position_score)
                    //console.log(percentage)
                    //console.log(position_score.indexOf(pers))
                    var positionsubject = position_score.indexOf(pers) + 1
                    biodata.position = positionsubject+positionstatus(positionsubject)
                }

            }
            
            if(req.query.term == 'Third Term'){
                biodata.promoted = "Pass"
            }
            else{
                biodata.promoted = ""
            }
            
            file.biodata = biodata
            file.behavior = student_behavior
            //biodata_arr.push(biodata)
            //student_comment = report_info
            student_comment.generate_date = report_info_date
            file.comment = student_comment
            //file.reportcard_info = report_info
            //file.promotion = promo

            var ratings = []
            for(var g = 0; g < rating.length; g++){
                ratings.push(rating[g].title)
            }
            file.rating = ratings
            file.abbr = r_mark

            student_result.push(file)

        }
        //console.log(student_result)
    }
    if(req.query.term == 'Second Term'){
        if(second_term_forward == true){
            var b_f = 'Yes'
        }
        else{
            var b_f = 'No'
        }
    }
    else if(req.query.term == 'Third Term'){
        if(third_term_forward == true){
            var b_f = 'Yes'
        }
        else{
            var b_f = 'No'
        }
    }
    else{
        var b_f = 'Yes'
    }
    
    var comment = await connect.Comment.findAll({where:{school_id:school_id}})
    var hm = []
    var teacher = []
    for(var s = 0; s < comment.length; s++){
        var com = comment[s].comment
        com = com.replace("{name}", studentname);
        if(gender == 'Male'){
            com = com.replace(/{his\/her}/g, 'his')
            com = com.replace(/{him\/her}/g, 'him')
            com = com.replace(/{he\/she}/g, 'he')
        }
        else{
            com = com.replace(/{his\/her}/g, 'her')
            com = com.replace(/{him\/her}/g, 'her')
            com = com.replace(/{he\/she}/g, 'she') 
        }
        if(comment[s].category == 'teacher'){
            teacher.push({ref_id:comment[s].comment, text:com})
        }
        else{
            hm.push({ref_id:comment[s].comment, text:com})
        }
    }
    var comment_section = {teacher:JSON.stringify(teacher), hm:JSON.stringify(hm)}
    //console.log(student_result)
    res.send({status:'ok', school_info:sch_info, data:student_result, school_term:school_term, b_f:b_f, comment:comment_section, promotion:promo});

    
  
};

exports.poststudentassessment = async function (req, res) {
    var school_id = parseInt(emc.decrypt(req.payload.school))
    var _id = parseInt(emc.decrypt(req.payload._id))
    //console.log(req.body.behavior)

    var student_no = await connect.AcademicSession.findOne({where:{id:req.body.student_id, school_id:school_id}})
    if(student_no){
        var report_infos = await connect.ReportCard.findOne({where: {session_id:student_no.session_id, term:req.body.term,
            class_arm_id:student_no.class_arm_id}});
        var result_publish = false
        if(!report_infos){}
        else{
            if(report_infos.release == true){
                result_publish = true
            }
        }
        //console.log(result_publish)
        if(result_publish == false){
            var behave = await connect.StudentAssessment.findOne({where:{academic_session_id:req.body.student_id, term:req.body.term, school_id:school_id}})
            if(!behave){
                var file = {behavior:req.body.behavior,comment:req.body.comment, attendance:req.body.attendance,
                school_id:school_id, user_id:_id, academic_session_id:req.body.student_id, term:req.body.term}
                console.log(file)
                var be = await connect.StudentAssessment.create(file)
                res.send({status:'ok', msg:'Assessment save successful'})
            }
            else{
                console.log('exist')
                var file = {behavior:req.body.behavior,comment:req.body.comment, attendance:req.body.attendance,
                    school_id:school_id, user_id:_id, academic_session_id:req.body.student_id, term:req.body.term}
                    console.log(file)
                    var be = await connect.StudentAssessment.update(file, {where:{id:behave.id}})
                res.send({status:'ok', msg:'Assessment save successful'})
            }
            if(req.body.term == 'Third Term'){
                var promotion = req.body.promotion
                var promo_status = promotion === 'Repeat Class' ? false : true

                var files = {comment:promotion, promotion:promo_status,
                    school_id:school_id, user_id:_id, academic_session_id:req.body.student_id, term:req.body.term}
                console.log(files)
                var pro = await connect.StudentPromotion.findOne({where:{academic_session_id:req.body.student_id, term:req.body.term, school_id:school_id}})
                if(!pro){
                    var p = await connect.StudentPromotion.create(files)
                }
                else{
                    var p = await connect.StudentPromotion.update(files, {where:{id:pro.id}})
                }

            }       
        }
        else{
            res.send({status:'401', message:'Cannot update student assesstment, report card already publish'})
    
        }

    }
        

    
    

}