var Sequelize = require('sequelize');
module.exports = {
	School_table: function(sequelize) {
		var School = sequelize.define("School", {
			name:Sequelize.TEXT,
			phone:Sequelize.TEXT,
			address:Sequelize.TEXT,
			city: Sequelize.TEXT,
			state: Sequelize.TEXT,
			country: Sequelize.TEXT,
			email: Sequelize.TEXT,
			website: Sequelize.TEXT,
			status: Sequelize.TEXT,
			logo:Sequelize.TEXT,
			expire: Sequelize.DATE,
			token:Sequelize.TEXT,
			primary:Sequelize.TEXT,
			primary_address:Sequelize.TEXT,
			primary_logo:Sequelize.TEXT,
			secondary:Sequelize.TEXT,
			secondary_address:Sequelize.TEXT,
			secondary_logo:Sequelize.TEXT,
			secondary_signature:Sequelize.TEXT,
			primary_signature:Sequelize.TEXT,
		},{underscored: true});
		School.sync({ force: false });
		return School;
	},
	

	User_table: function(sequelize) {
		var User = sequelize.define("User", {
			login_id:Sequelize.TEXT,
			firstname:Sequelize.TEXT,
			lastname:Sequelize.TEXT,
			email:Sequelize.TEXT,
			phone:Sequelize.TEXT,
			address: Sequelize.TEXT,
			gender: Sequelize.TEXT,
			image:Sequelize.TEXT,
			username: Sequelize.TEXT,
			token: Sequelize.TEXT,
			status: Sequelize.TEXT,
			position: Sequelize.TEXT,
			disable:Sequelize.INTEGER,			
		},{underscored: true});
		User.belongsTo(module.exports.School_table(sequelize));
		User.sync({ force: false });
		return User;
	},
	
	StaffRole_table: function(sequelize) {
    var StaffRole = sequelize.define("StaffRole", {
        roles:Sequelize.TEXT,
		user_id:Sequelize.INTEGER,
		school_id: Sequelize.INTEGER,	
		
    },{underscored: true});
	StaffRole.sync({ force: false });
    return StaffRole;
	},

	Activity_table: function(sequelize) {
    var Activity = sequelize.define("Activity", {
		description: Sequelize.TEXT,
		tables: Sequelize.TEXT,
		post_id: Sequelize.INTEGER,
		user_id: Sequelize.INTEGER,
		},  {underscored: true});
	Activity.sync({ force: false });
    return Activity;
	},
	
	SchoolClass_table: function(sequelize) {
    var SchoolClass = sequelize.define("SchoolClass", {
		name: Sequelize.TEXT,
		school_id: Sequelize.INTEGER,
		to: Sequelize.INTEGER,
		user_id: Sequelize.INTEGER,
		title:Sequelize.TEXT
		},  {underscored: true});
	SchoolClass.sync({ force: false});
    return SchoolClass;
	},
	FeesType_table: function(sequelize) {
    var FeesType = sequelize.define("FeesType", {
		name: Sequelize.TEXT,
		school_id: Sequelize.INTEGER,
		user_id: Sequelize.INTEGER,
		},  {underscored: true});
	FeesType.sync({ force: false});
    return FeesType;
	},
	ClassArm_table: function(sequelize) {
		var ClassArm = sequelize.define("ClassArm", {
			arm: Sequelize.TEXT,
			},  {underscored: true});
		ClassArm.belongsTo(module.exports.School_table(sequelize));
		ClassArm.belongsTo(module.exports.SchoolClass_table(sequelize));
		ClassArm.belongsTo(module.exports.User_table(sequelize));
		ClassArm.sync({ force: false });
		return ClassArm;
	},
	Subject_table: function(sequelize) {
    var Subject = sequelize.define("Subject", {
		name: Sequelize.TEXT,
		category: Sequelize.TEXT,
		school_id: Sequelize.INTEGER,
		user_id: Sequelize.INTEGER,
		},  {underscored: true});
	Subject.sync({ force: false});
    return Subject;
	},
	SessionName_table: function(sequelize) {
    var SessionName = sequelize.define("SessionName", {
		name: Sequelize.TEXT,
		index: Sequelize.INTEGER,
		},  {underscored: true});
	SessionName.sync({ force: false});
    return SessionName;
	},
	Session_table: function(sequelize) {
    var Session = sequelize.define("Session", {
		name: Sequelize.TEXT,
		first_term_start: Sequelize.DATEONLY,
		first_term_end: Sequelize.DATEONLY,
		second_term_start: Sequelize.DATEONLY,
		second_term_end: Sequelize.DATEONLY,
		third_term_start: Sequelize.DATEONLY,
		third_term_end: Sequelize.DATEONLY,
		first_open: Sequelize.INTEGER,
		second_open: Sequelize.INTEGER,
		third_open: Sequelize.INTEGER,
		school_id: Sequelize.INTEGER,
		user_id: Sequelize.INTEGER,
		},  {underscored: true});
	Session.sync({ force: false});
    return Session;
	},
	SchoolFees_table: function(sequelize) {
    var SchoolFees = sequelize.define("SchoolFees", {
		amount: Sequelize.TEXT,
		school_class_id: Sequelize.INTEGER,
		fees_types_id: Sequelize.INTEGER,
		session_id: Sequelize.INTEGER,
		term: Sequelize.TEXT,
		school_id: Sequelize.INTEGER,
		user_id: Sequelize.INTEGER,
		},  {underscored: true});
	SchoolFees.sync({ force: false});
    return SchoolFees;
	},
	Student_table: function(sequelize) {
    var Student = sequelize.define("Student", {
		surname: Sequelize.TEXT,
		firstname: Sequelize.TEXT,
		middlename: Sequelize.TEXT,
		admission_no: Sequelize.TEXT,
		admission_year: Sequelize.DATEONLY,
		gender: Sequelize.TEXT,
		dob: Sequelize.DATEONLY,
		religion: Sequelize.TEXT,
		nationality: Sequelize.TEXT,
		address: Sequelize.TEXT,
		city: Sequelize.TEXT,
		state: Sequelize.TEXT,
		country: Sequelize.TEXT,
		hobbies: Sequelize.TEXT,
		ailment: Sequelize.TEXT,
		disability: Sequelize.TEXT,
		passport: Sequelize.TEXT,
		username: Sequelize.TEXT,
		guardian: Sequelize.INTEGER,
		school_id: Sequelize.INTEGER,
		user_id: Sequelize.INTEGER,
		},  {underscored: true});
	Student.sync({ force: false});
    return Student;
	},

	StudentLogin_table: function(sequelize) {
		var StudentLogin = sequelize.define("StudentLogin", {
			student_id: Sequelize.INTEGER,
			school_id: Sequelize.INTEGER,
			user_id: Sequelize.INTEGER,
			login_id: Sequelize.TEXT,
			password: Sequelize.TEXT,
			},  {underscored: true});
		StudentLogin.sync({ force: false});
		return StudentLogin;
		},

	AcademicSession_table: function(sequelize) {
    var AcademicSession = sequelize.define("AcademicSession", {
		student_id: Sequelize.INTEGER,
		session_id: Sequelize.INTEGER,
		class_arm_id: Sequelize.INTEGER,
		term: Sequelize.TEXT,
		leave: Sequelize.INTEGER,
		school_id: Sequelize.INTEGER,
		user_id: Sequelize.INTEGER,
		},  {underscored: true});
	AcademicSession.sync({ force: false});
    return AcademicSession;
	},
	Guardian_table: function(sequelize) {
    var Guardian = sequelize.define("Guardian", {
		name: Sequelize.TEXT,
		phone: Sequelize.TEXT,
		email: Sequelize.TEXT,
		occupation: Sequelize.TEXT,
		relationship: Sequelize.TEXT,
		address: Sequelize.TEXT,
		passport: Sequelize.TEXT,
		school_id: Sequelize.INTEGER,
		user_id: Sequelize.INTEGER,
		},  {underscored: true});
	Guardian.sync({ force: false});
    return Guardian;
	},
	Login_table: function(sequelize) {
    var Login = sequelize.define("Login", {
		student_id: Sequelize.INTEGER,
		username: Sequelize.TEXT,
		password: Sequelize.TEXT,
		category: Sequelize.TEXT,
		school_id: Sequelize.INTEGER,
		user_id: Sequelize.INTEGER,
		},  {underscored: true});
	Login.sync({ force: false});
    return Login;
	},
	StudentBill_table: function(sequelize) {
    var StudentBill = sequelize.define("StudentBill", {
		session_id: Sequelize.INTEGER,
		student_id: Sequelize.INTEGER,
		class_arm_id: Sequelize.INTEGER,
		term: Sequelize.TEXT,
		school_fees_id: Sequelize.INTEGER,
		fees_types_id: Sequelize.INTEGER,
		fees_name: Sequelize.TEXT,
		category: Sequelize.TEXT,
		amount: Sequelize.TEXT,
		payment: Sequelize.TEXT,
		weaver: Sequelize.TEXT,
		fine: Sequelize.TEXT,
		balance: Sequelize.TEXT,
		school_id: Sequelize.INTEGER,
		user_id: Sequelize.INTEGER,
		},  {underscored: true});
	StudentBill.sync({ force: false});
    return StudentBill;
	},
	StudentBillTotal_table: function(sequelize) {
    var StudentBillTotal = sequelize.define("StudentBillTotal", {
		session_id: Sequelize.INTEGER,
		student_id: Sequelize.INTEGER,
		class_arm_id: Sequelize.INTEGER,
		term: Sequelize.TEXT,
		amount: Sequelize.TEXT,
		payment: Sequelize.TEXT,
		weaver: Sequelize.TEXT,
		fine: Sequelize.TEXT,
		balance: Sequelize.TEXT,
		school_id: Sequelize.INTEGER,
		user_id: Sequelize.INTEGER,
		},  {underscored: true});
	StudentBillTotal.sync({ force: false});
    return StudentBillTotal;
	},
	
	StudentBillPay_table: function(sequelize) {
    var StudentBillPay = sequelize.define("StudentBillPay", {
		ref_id: Sequelize.INTEGER,
		session_id: Sequelize.INTEGER,
		student_id: Sequelize.INTEGER,
		class_arm_id: Sequelize.INTEGER,
		term: Sequelize.TEXT,
		amount: Sequelize.TEXT,
		weaver: Sequelize.TEXT,
		fine: Sequelize.TEXT,
		prev_pay: Sequelize.TEXT,
		due: Sequelize.TEXT,
		payment: Sequelize.TEXT,
		balance: Sequelize.TEXT,
		bill: Sequelize.TEXT,
		school_id: Sequelize.INTEGER,
		user_id: Sequelize.INTEGER,
		payment_type_id:Sequelize.INTEGER,
		trans_date:Sequelize.DATE
		},  {underscored: true});
	StudentBillPay.sync({ force: false});
    return StudentBillPay;
	},
	SchoolAccount_table: function(sequelize) {
		var SchoolAccount = sequelize.define("SchoolAccount", {
			account_no:Sequelize.TEXT,
			bank:Sequelize.TEXT,
			active:Sequelize.BOOLEAN,
			user_id:Sequelize.INTEGER,
			school_id: Sequelize.INTEGER,
			},  {underscored: true});
		SchoolAccount.sync({ force: false });
		return SchoolAccount;
	},
	ExpensesType_table: function(sequelize) {
		var ExpensesType = sequelize.define("ExpensesType", {
			name:Sequelize.TEXT,
			school_id: Sequelize.INTEGER,
			},  {underscored: true});
		ExpensesType.sync({ force: false });
		return ExpensesType;
	},
	Expenses_table: function (sequelize) {
		var Expenses = sequelize.define("Expenses", {
			expenses_type_id: Sequelize.INTEGER,
			session_id: Sequelize.INTEGER,
			term: Sequelize.TEXT,
			name: Sequelize.TEXT,
			amount: Sequelize.TEXT,
			description: Sequelize.TEXT,
			delete: Sequelize.BOOLEAN,
			user_id: Sequelize.INTEGER,
			school_id: Sequelize.INTEGER,
			trans_date:Sequelize.DATEONLY
		}, { underscored: true });
		Expenses.sync({ force: false });
		return Expenses;
	},
	Cash_table: function(sequelize) {
		var Cash = sequelize.define("Cash", {
			description:Sequelize.TEXT,
			pay_id: Sequelize.INTEGER,
			user_id: Sequelize.INTEGER,
			school_id: Sequelize.INTEGER,
			},  {underscored: true});
		Cash.sync({ force: false });
		return Cash;
	},
	BankTeller_table: function(sequelize) {
		var BankTeller = sequelize.define("BankTeller", {
			description:Sequelize.TEXT,
			teller_no:Sequelize.TEXT,
			teller_date:Sequelize.TEXT,
			school_account_id: Sequelize.INTEGER,
			pay_id: Sequelize.INTEGER,
			user_id: Sequelize.INTEGER,
			school_id: Sequelize.INTEGER,
			},  {underscored: true});
		BankTeller.sync({ force: false });
		return BankTeller;
	},
	BankTransfer_table: function(sequelize) {
		var BankTransfer = sequelize.define("BankTransfer", {
			description:Sequelize.TEXT,
			transfer_date:Sequelize.TEXT,
			transfer_reference:Sequelize.TEXT,
			school_account_id: Sequelize.INTEGER,
			pay_id: Sequelize.INTEGER,
			user_id: Sequelize.INTEGER,
			school_id: Sequelize.INTEGER,
			},  {underscored: true});
		BankTransfer.sync({ force: false });
		return BankTransfer;
	},
	BankCheck_table: function(sequelize) {
		var BankCheck = sequelize.define("BankCheck", {
			description:Sequelize.TEXT,
			check_account:Sequelize.TEXT,
			check_no:Sequelize.TEXT,
			issuer_bank:Sequelize.TEXT,
			issuer_date:Sequelize.TEXT,
			pay_id: Sequelize.INTEGER,
			user_id: Sequelize.INTEGER,
			school_id: Sequelize.INTEGER,
			},  {underscored: true});
		BankCheck.sync({ force: false });
		return BankCheck;
	},
	PosPay_table: function(sequelize) {
		var PosPay = sequelize.define("PosPay", {
			description:Sequelize.TEXT,
			card_name:Sequelize.TEXT,
			card_no:Sequelize.TEXT,
			reference:Sequelize.TEXT,
			transaction_date:Sequelize.TEXT,
			school_account_id: Sequelize.INTEGER,
			pay_id: Sequelize.INTEGER,
			user_id: Sequelize.INTEGER,
			school_id: Sequelize.INTEGER,
			},  {underscored: true});
		PosPay.sync({ force: false });
		return PosPay;
	},
	StudentScore_table: function(sequelize) {
		var StudentScore = sequelize.define("StudentScore", {
			first_term_score:Sequelize.TEXT,
			first_term_total:Sequelize.TEXT,
			second_term_score:Sequelize.TEXT,
			second_term_total:Sequelize.TEXT,
			third_term_score:Sequelize.TEXT,
			third_term_total:Sequelize.TEXT,
			academic_session_id: Sequelize.INTEGER,
			subject_id: Sequelize.INTEGER,
			user_id: Sequelize.INTEGER,
			school_id: Sequelize.INTEGER,
			},  {underscored: true});
		StudentScore.sync({ force: false });
		return StudentScore;
	},
	Mark_table: function(sequelize) {
		var Mark = sequelize.define("Mark", {
			point:Sequelize.TEXT,
			name:Sequelize.TEXT,
			abbr:Sequelize.TEXT,
			school_class_id: Sequelize.INTEGER,
			user_id: Sequelize.INTEGER,
			school_id: Sequelize.INTEGER,
			},  {underscored: true});
		Mark.sync({ force: false });
		return Mark;
	},

	Remark_table: function(sequelize) {
		var Remark = sequelize.define("Remark", {
			school_class_id: Sequelize.INTEGER,
			user_id: Sequelize.INTEGER,
			school_id: Sequelize.INTEGER,
			},  {underscored: true});
		Remark.sync({ force: false });
		return Remark;
	},


	MarkAcademic_table: function(sequelize) {
    var MarkAcademic = sequelize.define("MarkAcademic", {
		session_id: Sequelize.INTEGER,
		school_class_id: Sequelize.INTEGER,
		term: Sequelize.TEXT,
		mark: Sequelize.TEXT,
		},  {underscored: true});
	MarkAcademic.sync({ force: false});
    return MarkAcademic;
	},
	Result_table: function(sequelize) {
		var Result = sequelize.define("Result", {
			session_id: Sequelize.INTEGER,
			class_arm_id: Sequelize.INTEGER,
			term: Sequelize.TEXT,
			publsh: Sequelize.BOOLEAN,
			school_id: Sequelize.INTEGER,
			user_id: Sequelize.INTEGER,
		},  {underscored: true});
		Result.sync({ force: false});
		return Result;
	},
	ResultSetup_table: function(sequelize) {
		var ResultSetup = sequelize.define("ResultSetup", {
			session_id: Sequelize.INTEGER,
			school_class_id: Sequelize.INTEGER,
			rating:Sequelize.TEXT,
			rating_index:Sequelize.INTEGER,
			position:Sequelize.BOOLEAN,
			second_term: Sequelize.BOOLEAN,
			third_term: Sequelize.BOOLEAN,
			index: Sequelize.INTEGER,
			school_id: Sequelize.INTEGER,
			user_id: Sequelize.INTEGER,
		},  {underscored: true});
		ResultSetup.sync({ force: false});
		return ResultSetup;
	},

	ClassTeacher_table: function(sequelize) {
		var ClassTeacher = sequelize.define("ClassTeacher", {
			session_id: Sequelize.INTEGER,
			class_arm_id: Sequelize.INTEGER,
			teacher_id:Sequelize.INTEGER,
			start_date:Sequelize.DATEONLY,
			end_date: Sequelize.DATEONLY,
			school_id: Sequelize.INTEGER,
			user_id: Sequelize.INTEGER,
		},  {underscored: true});
		ClassTeacher.sync({ force: false});
		return ClassTeacher;
	},

	SubjectTeacher_table: function(sequelize) {
		var SubjectTeacher = sequelize.define("SubjectTeacher", {
			session_id: Sequelize.INTEGER,
			subject_id: Sequelize.INTEGER,
			class_arm_id: Sequelize.INTEGER,
			teacher_id:Sequelize.INTEGER,
			start_date:Sequelize.DATEONLY,
			end_date: Sequelize.DATEONLY,
			school_id: Sequelize.INTEGER,
			user_id: Sequelize.INTEGER,
		},  {underscored: true});
		SubjectTeacher.sync({ force: false});
		return SubjectTeacher;
	},
	StudentBehavior_table: function(sequelize) {
		var StudentBehavior = sequelize.define("StudentBehavior", {
			first_term:Sequelize.TEXT,
			first_term_comment:Sequelize.TEXT,
			first_term_attendance:Sequelize.INTEGER,
			second_term:Sequelize.TEXT,
			second_term_comment:Sequelize.TEXT,
			second_term_attendance:Sequelize.INTEGER,
			third_term:Sequelize.TEXT,
			third_term_comment:Sequelize.TEXT,
			second_term_attendance:Sequelize.INTEGER,
			academic_session_id: Sequelize.INTEGER,
			user_id: Sequelize.INTEGER,
			school_id: Sequelize.INTEGER,
			},  {underscored: true});
		StudentBehavior.sync({ force: false });
		return StudentBehavior;
	},
	StudentAssessment_table: function(sequelize) {
		var StudentAssessment = sequelize.define("StudentAssessment", {
			term:Sequelize.TEXT,
			comment:Sequelize.TEXT,
			attendance:Sequelize.TEXT,
			behavior:Sequelize.TEXT,
			academic_session_id: Sequelize.INTEGER,
			user_id: Sequelize.INTEGER,
			school_id: Sequelize.INTEGER,
			},  {underscored: true});
		StudentAssessment.sync({ force: false });
		return StudentAssessment;
	},
	StudentPromotion_table: function(sequelize) {
		var StudentPromotion = sequelize.define("StudentPromotion", {
			term:Sequelize.TEXT,
			comment:Sequelize.TEXT,
			promotion:Sequelize.BOOLEAN,
			academic_session_id: Sequelize.INTEGER,
			user_id: Sequelize.INTEGER,
			school_id: Sequelize.INTEGER,
			},  {underscored: true});
			StudentPromotion.sync({ force: false });
		return StudentPromotion;
	},
	Comment_table: function(sequelize) {
		var Comment = sequelize.define("Comment", {
			comment: Sequelize.TEXT,
			category: Sequelize.TEXT,
			school_id: Sequelize.INTEGER,
			user_id: Sequelize.INTEGER,
		},  {underscored: true});
		Comment.sync({ force: false});
		return Comment;
	},
	ReportCard_table: function(sequelize) {
		var ReportCard = sequelize.define("ReportCard", {
			session_id: Sequelize.INTEGER,
			class_arm_id: Sequelize.INTEGER,
			term: Sequelize.TEXT,
			release_date: Sequelize.DATEONLY,
			release:Sequelize.BOOLEAN,
			school_id: Sequelize.INTEGER,
			user_id: Sequelize.INTEGER,
			},  {underscored: true});
			ReportCard.sync({ force: false});
		return ReportCard;
	},
	Notice_table: function(sequelize) {
		var Notice = sequelize.define("Notice", {
			subject: Sequelize.TEXT,
			content: Sequelize.TEXT,
			summary: Sequelize.TEXT,
			author: Sequelize.TEXT,
			destination: Sequelize.TEXT,
			msg_type: Sequelize.TEXT,
			school_class_id: Sequelize.INTEGER,
			publish:Sequelize.BOOLEAN,
			publish_date:Sequelize.DATEONLY,
			student: Sequelize.INTEGER,
			school_id: Sequelize.INTEGER,
			user_id: Sequelize.INTEGER,
			},  {underscored: true});
		Notice.sync({ force: false});
		return Notice;
	},
	Income_table: function (sequelize) {
		var Income = sequelize.define("Income", {
			session_id: Sequelize.INTEGER,
			term: Sequelize.TEXT,
			name: Sequelize.TEXT,
			amount: Sequelize.TEXT,
			description: Sequelize.TEXT,
			delete: Sequelize.BOOLEAN,
			user_id: Sequelize.INTEGER,
			school_id: Sequelize.INTEGER,
			trans_date:Sequelize.DATEONLY
		}, { underscored: true });
		Income.sync({ force: false });
		return Income;
	},
	Promotion_table: function(sequelize) {
		var Promotion = sequelize.define("Promotion", {
			student: Sequelize.TEXT,
			session_id: Sequelize.INTEGER,
			class_arm_id: Sequelize.INTEGER,
			school_id: Sequelize.INTEGER,
			user_id: Sequelize.INTEGER,
		},  {underscored: true});
		Promotion.sync({ force: false});
		return Promotion;
	},
	Signature_table: function(sequelize) {
		var Signature = sequelize.define("Signature", {
			school:Sequelize.TEXT,
			term:Sequelize.TEXT,
			sign:Sequelize.TEXT,
			session_id: Sequelize.INTEGER,
			school_id: Sequelize.INTEGER,
			user_id: Sequelize.INTEGER,
		},  {underscored: true});
		Signature.sync({ force: false});
		return Signature;
	},
	StudentReportCard_table: function(sequelize) {
		var StudentReportCard = sequelize.define("StudentReportCard", {
			academic_session_id: Sequelize.INTEGER,
			term: Sequelize.TEXT,
			release:Sequelize.BOOLEAN,
			school_id: Sequelize.INTEGER,
			user_id: Sequelize.INTEGER,
			},  {underscored: true});
			StudentReportCard.sync({ force: false});
		return StudentReportCard;
	},
}
