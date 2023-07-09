var Sequelize = require("sequelize");
var exports = module.exports = {};	
var model = require("../models/schooldb");

var sequelize = new Sequelize("postgres://virilesoftware:shollybay123@A@127.0.0.1:5432/virilesoftware_iconhallschool",{dialectOptions: {connectTimeout: 100000},
logging: false, pool:{max: 3,  idle: 30000,  acquire: 100000},
retry: { match: [
    /SequelizeConnectionError/,
    /SequelizeConnectionRefusedError/,
    /SequelizeHostNotFoundError/,
    /SequelizeHostNotReachableError/,
    /SequelizeInvalidConnectionError/,
    /SequelizeConnectionTimedOutError/
  ],
  timeout: 100000,
  max: Infinity
}});

exports.db = sequelize
exports.School = model.School_table(sequelize);
exports.SessionName = model.SessionName_table(sequelize);
exports.User = model.User_table(sequelize);
exports.StaffRole = model.StaffRole_table(sequelize);
exports.Session = model.Session_table(sequelize);
exports.SchoolClass = model.SchoolClass_table(sequelize);
exports.ClassArm = model.ClassArm_table(sequelize);
exports.Subject = model.Subject_table(sequelize);
exports.FeesType = model.FeesType_table(sequelize);
exports.SchoolFees = model.SchoolFees_table(sequelize);
exports.Student = model.Student_table(sequelize);
exports.StudentLogin = model.StudentLogin_table(sequelize);
exports.AcademicSession = model.AcademicSession_table(sequelize);
exports.Guardian = model.Guardian_table(sequelize);
exports.Login = model.Login_table(sequelize);
exports.StudentBill = model.StudentBill_table(sequelize);
exports.StudentBillTotal = model.StudentBillTotal_table(sequelize);
exports.StudentBillPay = model.StudentBillPay_table(sequelize);
exports.SchoolAccount = model.SchoolAccount_table(sequelize);
exports.ExpensesType = model.ExpensesType_table(sequelize);
exports.Expenses = model.Expenses_table(sequelize);
exports.Income = model.Income_table(sequelize);
exports.Cash = model.Cash_table(sequelize);
exports.BankTeller = model.BankTeller_table(sequelize);
exports.BankTransfer = model.BankTransfer_table(sequelize);
exports.BankCheck = model.BankCheck_table(sequelize);
exports.PosPay = model.PosPay_table(sequelize);
exports.StudentScore = model.StudentScore_table(sequelize);
exports.Mark = model.Mark_table(sequelize)
exports.MarkAcademic = model.MarkAcademic_table(sequelize);
exports.ResultSetup = model.ResultSetup_table(sequelize)
exports.Result = model.Result_table(sequelize)
exports.ReportCard = model.ReportCard_table(sequelize)

exports.ClassTeacher = model.ClassTeacher_table(sequelize)
exports.SubjectTeacher = model.SubjectTeacher_table(sequelize)
exports.Comment = model.Comment_table(sequelize)
exports.StudentBehavior = model.StudentBehavior_table(sequelize)
exports.StudentAssessment = model.StudentAssessment_table(sequelize)
exports.StudentPromotion = model.StudentPromotion_table(sequelize)
exports.Notice = model.Notice_table(sequelize)