var express = require('express');
var router = express.Router();
var jwt = require('express-jwt');
var emc = require('./emc')
var asyncs = require("async");
var auth = jwt({secret: 'IYAELEWA', userProperty: 'payload'});
var connect = require("../config/config");
var moment = require('moment')
var SchoolClass = require('./schoolclass')
var Subject = require('./subject')
var Student = require('./student')
var Expenses = require('./expenses')
var Staff = require('./staff')
var Teacher = require('./teacher')
var Result = require('./result')
var StudentResult = require('./studentresult')
var BroadSheet = require('./broadsheet')
var StudentResultSheet = require('./studentresultsheet')
var Bill = require('./bill')

function setRequestTime(req, res, next){
  req.connection.setTimeout( 1000 * 60 * 10 ); // ten minutes
  return next()
}

function isAuthenticated(req, res, next) {
  var _id = emc.decrypt(req.payload._id)
  _id = parseInt(_id)
  connect.User.findOne({where: {id: _id}}).then(function (users) {
  if(!users)
  {
    var result = {status:'error', message:'user not found!'};
    res.send(result)
  }
  else if(users.status == 'Deleted')
  {
    var result = {status:'error', message:'user not found!'};
    res.send(result)
  }
  else if(users.status == 'Block')
  {
    var result = {status:'error', message:'Your acccount is block, please contact director to enable it!'};
    res.send(result)
  }
  else
  {
    req.acct = users.account_id
    return next();
  }  
})
}




function authorisedOwner(req, res, next) {
//console.log(req.payload)
  var _id = emc.decrypt(req.payload._id)
  var zone = emc.decrypt(req.payload.zone)
  _id = parseInt(_id)
  connect.User.findOne({
      where: {
        id: _id,
        zone_id: zone
      }
    }).then(function (users) {
  if(!users)
  {
    var result = {status:'error', message:'user not found!'};
    res.send(result)
  }
  else
  {
    if(users.position == 'Owner')
    {
      req.acct = users.zone_id
      return next();
        
    }
    else
    {
      
        var result = {
          status: 'error',
          message: 'Unauthorised access!'
        };
        res.send(result)
    }
  }
})
}


router.get('/schoolclass', setRequestTime, auth, SchoolClass.getclass)
router.get('/schoolclassadmin', setRequestTime, auth, SchoolClass.getclassadmin)
router.get('/studentclass', setRequestTime, auth, SchoolClass.getstudentclass)
router.get('/studentallclass', setRequestTime, auth, SchoolClass.getstudentallclass)
router.post('/schoolclass', setRequestTime, auth, SchoolClass.postclass)
router.put('/schoolclass/:ref_id', setRequestTime, auth, SchoolClass.updateclass)
router.delete('/schoolclass/:ref_id', setRequestTime, auth, SchoolClass.deleteclass)
router.post('/classarm', setRequestTime, auth, SchoolClass.postclassarm)
router.get('/classarm', setRequestTime, auth, SchoolClass.getclassarm)
router.get('/classarmadmin', setRequestTime, auth, SchoolClass.getclassarmadmin)
router.put('/classarm/:ref_id', setRequestTime, auth, SchoolClass.updateclassarm)
router.delete('/classarm/:ref_id', setRequestTime, auth, SchoolClass.deleteclassarm)

router.get('/basicsubject', setRequestTime, auth, Subject.getbasicsubject)
router.get('/basicsubjectadmin', setRequestTime, auth, Subject.getbasicsubjectadmin)
router.post('/basicsubject', setRequestTime, auth, Subject.postbasicsubject)
router.get('/jsssubject', setRequestTime, auth, Subject.getjsssubject)
router.get('/jsssubjectadmin', setRequestTime, auth, Subject.getjsssubjectadmin)
router.post('/jsssubject', setRequestTime, auth, Subject.postjsssubject)
router.get('/ssssubject', setRequestTime, auth, Subject.getssssubject)
router.get('/ssssubjectadmin', setRequestTime, auth, Subject.getssssubjectadmin)
router.post('/ssssubject', setRequestTime, auth, Subject.postssssubject)
router.put('/subject/:ref_id', setRequestTime, auth, Subject.updatesubject)
router.delete('/subject/:ref_id', setRequestTime, auth, Subject.deletesubject)


router.get('/feestype', setRequestTime, auth, SchoolClass.getfeestype)
router.get('/feestypeadmin', setRequestTime, auth, SchoolClass.getfeestypeadmin)
router.post('/feestype', setRequestTime, auth, SchoolClass.postfeestype)
router.put('/feestype/:ref_id', setRequestTime, auth, SchoolClass.updatefeestype)
router.delete('/feestype/:ref_id', setRequestTime, auth, SchoolClass.deletefeestype)

router.get('/schoolaccount', setRequestTime, auth, SchoolClass.getschoolaccount)
router.get('/schoolaccountadmin', setRequestTime, auth, SchoolClass.getschoolaccountadmin)
router.post('/schoolaccount', setRequestTime, auth, SchoolClass.postschoolaccount)
router.put('/schoolaccount/:ref_id', setRequestTime, auth, SchoolClass.updateschoolaccount)
router.delete('/schoolaccount/:ref_id', setRequestTime, auth, SchoolClass.deleteschoolaccount)



router.post('/session', setRequestTime, auth, SchoolClass.postsession)
router.get('/session', setRequestTime, auth, SchoolClass.getsession)
router.get('/sessionadmin', setRequestTime, auth, SchoolClass.getsessionadmin)
router.delete('/session/:ref_id', setRequestTime, auth, SchoolClass.deletesession)
router.get('/session/:ref_id', setRequestTime, auth, SchoolClass.getsessionbyid)
router.put('/session/:ref_id', setRequestTime, auth, SchoolClass.updatesession)
router.get('/academicsession', setRequestTime, auth, SchoolClass.getacademicsession)
router.get('/sessionname', setRequestTime, auth, SchoolClass.getsessionname)
router.get('/schoolbill', setRequestTime, auth, SchoolClass.getschoolbill)
router.get('/studentschoolbill', setRequestTime, auth, SchoolClass.getstudentschoolbill)
router.get('/studentschoolbill', setRequestTime, auth, SchoolClass.getstudentschoolbill)
router.post('/studentschoolbill', setRequestTime, auth, SchoolClass.poststudentschoolbill)


router.post('/fees_registrar', setRequestTime, auth, SchoolClass.postfees_registrar)
router.put('/fees_registrar/:ref_id', setRequestTime, auth, SchoolClass.updatefees_registrar)
router.delete('/fees_registrar/:ref_id', setRequestTime, auth, SchoolClass.deletefees_registrar)
router.get('/fees_registrar', setRequestTime, auth, SchoolClass.getfees_registrar)
router.get('/fees_registraradmin', setRequestTime, auth, SchoolClass.getfees_registraradmin)

router.post('/student', setRequestTime, auth, Student.poststudent)
router.put('/student/:ref_id', setRequestTime, auth, Student.updatestudent)
router.post('/guardian', setRequestTime, auth, Student.postguardian)
router.get('/searchguardian', setRequestTime, auth, Student.searchguardian)
router.get('/student', setRequestTime, auth, Student.getstudent)
router.get('/academicstudent', setRequestTime, auth, Student.getacademicstudent)
router.post('/specialoffer', setRequestTime, auth, Student.postspecialoffer)
router.get('/studentfees', setRequestTime, auth, Student.getstudentfees)
router.get('/studentfees/:ref_id', setRequestTime, auth, Student.getstudentfeesbyid)
router.get('/studentbill/:ref_id', setRequestTime, auth, Student.getstudentbillbyid)
router.get('/studentbillnew/:ref_id', setRequestTime, auth, Student.getstudentbillbyidnew)
router.put('/studentfees/:ref_id', setRequestTime, auth, Student.updatestudentfees)
router.post('/studentfees/:ref_id', setRequestTime, auth, Student.poststudentfees)
router.get('/studentfeespayment/:ref_id', setRequestTime, auth, Student.getstudentfeespaymentbyid)
router.get('/studentbillpayment/:ref_id', setRequestTime, auth, Student.getstudentbillpaymentbyid)
router.get('/studentfeesinvoice/:ref_id', setRequestTime, auth, Student.getstudentfeespaymentinvoice)
router.get('/paymenthistory', setRequestTime, auth, Student.getpaymenthistory)
router.get('/feesreports', setRequestTime, auth, Student.getfeesreports)
router.get('/studentdetail/:ref_id', setRequestTime, auth, Student.getstudentdetail)
router.put('/studentclass/:ref_id', setRequestTime, auth, Student.updatestudentclass)
router.get('/studentinfo/:ref_id', setRequestTime, auth, Student.getstudentinfo)
router.get('/studentsummary', setRequestTime, auth, Student.getstudentsummary)
//router.put('/studentsession/:ref_id', setRequestTime, auth, Student.updatestudentsession)

router.get('/studenttopromote', setRequestTime, auth, Student.studenttopromote)
router.post('/promote', setRequestTime, auth, Student.promotestudent)


router.get('/feesanalysis', setRequestTime, auth, Student.getfeesanalysis)
router.get('/feeshomeanalysis', setRequestTime, auth, Student.getfeeshomeanalysis)

router.get('/expensestype', setRequestTime, auth, Expenses.getexpensestype)
router.post("/expensestype", setRequestTime, auth, isAuthenticated, Expenses.postexpensestype);
router.put("/expensestype/:ref_id", setRequestTime, auth, isAuthenticated, Expenses.updateexpensestype);
router.get('/expenses', setRequestTime, auth, isAuthenticated, Expenses.getexpensesreport)
router.delete('/expenses/:ref_id', setRequestTime, auth, isAuthenticated, Expenses.deleteexpenses)
router.post('/expenses', setRequestTime, auth, isAuthenticated, Expenses.addexpenses)
router.post('/otherincome', setRequestTime, auth, isAuthenticated, Expenses.addotherincome)
router.get('/otherincome', setRequestTime, auth, isAuthenticated, Expenses.getotherincomereport)
router.delete('/otherincome/:ref_id', setRequestTime, auth, isAuthenticated, Expenses.deleteotherincome)

router.get('/financereport', setRequestTime, auth, isAuthenticated, Expenses.getfinancereport)

//router.put("/company", setRequestTime, auth, isAuthenticated, Profile.updatecompany);

router.post("/staff", auth, isAuthenticated, Staff.poststaff);
router.get("/staff", auth, isAuthenticated, Staff.getstaffinfo);
router.get("/stafflist", auth, isAuthenticated, Staff.getstaff);
router.get("/staff/:ref_id", auth, isAuthenticated, Staff.getstaffbyid);
router.put("/staff/:ref_id", auth, isAuthenticated, Staff.updatestaff);
router.put("/staffrole/:ref_id", auth, isAuthenticated, Staff.updatestaffroles);
router.get("/staffrole/:ref_id", auth, isAuthenticated, Staff.getstaffroles);
router.get("/staffmenu", auth, isAuthenticated, Staff.getstaffmenu);
router.get("/teachermenu", auth, isAuthenticated, Staff.getteachermenu);
router.put('/staffhand/:ref_id', auth, isAuthenticated, Staff.updatestaffhand)
router.put('/staffhandpassword/:ref_id', auth, isAuthenticated, Staff.updatestaffhandpassword)
router.put('/password', auth, isAuthenticated, Staff.updatepassword)


router.post("/teacher", auth, isAuthenticated, Teacher.postteacher);
router.get("/teacher", auth, isAuthenticated, Teacher.getteacherinfo);
router.get("/academicteacher", auth, isAuthenticated, Teacher.getacademicteacher);
router.post("/classteacher/:ref_id", auth, isAuthenticated, Teacher.postclassteacher);
router.get("/classteacher/:ref_id", auth, isAuthenticated, Teacher.getclassteacher);
router.delete("/classteacher/:ref_id", auth, isAuthenticated, Teacher.deleteclassteacher);


router.post("/subjectteacher/:ref_id", auth, isAuthenticated, Teacher.postsubjectteacher);
router.get("/subjectteacher/:ref_id", auth, isAuthenticated, Teacher.getsubjectteacher);
router.delete("/subjectteacher/:ref_id", auth, isAuthenticated, Teacher.deletesubjectteacher);
router.get("/studentlistbysubject", auth, isAuthenticated, Teacher.getstudentlistbysubject);
router.get("/teachersubjectlist", auth, isAuthenticated, Teacher.getteachersubjectlist);
router.get("/teacherclass", auth, isAuthenticated, Teacher.getteacherclass);
router.delete("/studentsubject/:ref_id", auth, isAuthenticated, Teacher.deletestudentsubject);



router.get('/allocatesubject', setRequestTime, auth, Subject.getallocatestudent)
router.post('/allocatesubject', setRequestTime, auth, Subject.postallocatestudent)
router.post('/reportcardsetting', setRequestTime, auth, Subject.postreportcardsetting)
router.get('/reportcardsetting', setRequestTime, auth, Subject.getreportcardsetting)

router.post('/reportcardsetup', setRequestTime, auth, Subject.postreportcardsetup)
router.get('/reportcardsetup', setRequestTime, auth, Subject.getreportcardsetup)


router.get('/schoolsubject', setRequestTime, auth, Subject.getschoolsubject)
router.get('/subjectbyclass', setRequestTime, auth, Subject.getsubjectbyclass)
router.get('/scorebysubject', setRequestTime, auth, Subject.getscorebysubject)
router.post('/scorebysubject', setRequestTime, auth, Subject.postscorebysubject)
router.post('/scorebyexcel', setRequestTime, auth, Subject.postscorebyexcel)
router.get('/reportcardclass', setRequestTime, auth, Subject.getreportcardclass)
router.post('/publishresult', setRequestTime, auth, Subject.postpublishresult)
router.get('/studentreportcard', setRequestTime, auth, Result.getstudentreportcard)

router.get('/academicclass', setRequestTime, auth, SchoolClass.getacademicclass)
router.get('/studentresult', setRequestTime, auth, StudentResult.getstudentresult)
router.post('/studentassessment', setRequestTime, auth, StudentResult.poststudentassessment)

router.get('/studentresult/:ref_id', setRequestTime, auth, StudentResultSheet.getstudentresult)
router.get('/generatelogin', setRequestTime, auth, Student.generatelogin)
router.post('/notice', setRequestTime, auth, Student.postnotice)
router.get('/studentnotice/:ref_id', setRequestTime, auth, Student.getstudentnotice)
router.get('/notice/:ref_id', setRequestTime, auth, Student.getnotice)

router.get('/broadsheet', setRequestTime, auth, BroadSheet.getbroadsheet)

//router.get('/promote', setRequestTime, SchoolClass.promotestudent)

router.get('/image', setRequestTime, auth, Expenses.updateimage)


router.get('/studentallbill', setRequestTime, Bill.updatestudentallfees)

module.exports = router;

