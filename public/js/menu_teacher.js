function getUrlVars()
{
    var vars = [], hash;
    var hashes = window.location.pathname.split('/')[2]
    
    return hashes;
}

$(document).ready(function(){
	$(document).on('click', '#user-logout', function (event) {
		event.preventDefault()
		auth.deleteToken();
		window.location.reload()
	})
	var tag = getUrlVars()
	
	
	
	//setInterval("setTokenSentToServer()",5000);
	
	var token = auth.getToken()
	if (token == null) {
		window.location = "https://alxproject.virilesoftware.com/eportal/login"
	} else {
		/*var href = 'https://alxproject.virilesoftware.com/api/cashbalance';
		$.ajax({
			type: 'GET',
			data: null,
			url: href,
			dataType:'JSON',
			beforeSend : function(req) {
				req.setRequestHeader('Authorization', 'Bearer '+token);
			}
		}).done(function(datas){
        })*/
		var payload = jwt_decode(token);
		$('#farm-name').html(payload.name)
		if(tag != payload.username){
			auth.deleteToken();
			window.location = "https://alxproject.virilesoftware.com/eportal/login"
		}
		//console.log(payload)
		var dt = new String(payload.username)
		$('#username').html(payload.name)
		//console.log(payload.position)
		var f = true
		if (f) {
			var htmls = '<li class=""><a href="https://alxproject.virilesoftware.com/eportal/'+payload.username +'"><span class="pcoded-micon"><i class="ti-home"></i></span>\
		<span class="pcoded-mtext" data-i18n="nav.dash.main">Dashboard</span><span class="pcoded-mcaret"></span></a></li>\
			<li clas=""><a href="https://alxproject.virilesoftware.com/eportal/'+payload.username +'/students"><span class="pcoded-micon"><i class="icon ion-ios-people"></i></span>\
			<span class="pcoded-mtext">Students</span><span class="pcoded-mcaret"></span></a></li>\
			<li class="pcoded-hasmenu"><a href="javascript:void(0)" data-i18n="nav.navigate.main"><span class="pcoded-micon"><i class="icon ion-ios-book"></i></span>\
			<span class="pcoded-mtext">Academic</span><span class="pcoded-mcaret"></span></a><ul class="pcoded-submenu">\
			<li class=" "><a href="https://alxproject.virilesoftware.com/eportal/'+payload.username +'/manage_class" data-i18n="nav.navigate.navbar"><span class="pcoded-micon"><i class="ti-angle-right"></i></span>\
			<span class="pcoded-mtext">Class</span><span class="pcoded-mcaret"></span></a></li>\
                                        <li class=" ">\
                                            <a href="https://alxproject.virilesoftware.com/eportal/'+payload.username +'/manage_subject" data-i18n="nav.navigate.navbar-inverse">\
                                                <span class="pcoded-micon"><i class="ti-angle-right"></i></span>\
                                                <span class="pcoded-mtext">Subject</span>\
                                                <span class="pcoded-mcaret"></span>\
                                            </a>\
                                        </li>\
                                        <li class=" ">\
                                            <a href="#" data-i18n="nav.navigate.navbar-inverse">\
                                                <span class="pcoded-micon"><i class="ti-angle-right"></i></span>\
                                                <span class="pcoded-mtext">TimeTable</span>\
                                                <span class="pcoded-mcaret"></span>\
                                            </a>\
                                        </li>\
                                    </ul>\
                                </li>\
								<li class="pcoded-hasmenu">\
                                    <a href="javascript:void(0)" data-i18n="nav.navigate.main">\
                                        <span class="pcoded-micon"><i class="icon ion-cash"></i></span>\
                                        <span class="pcoded-mtext">Finance</span>\
                                        <span class="pcoded-mcaret"></span>\
                                    </a>\
                                    <ul class="pcoded-submenu">\
                                        <li class=" ">\
                                            <a href="https://alxproject.virilesoftware.com/eportal/'+payload.username + '/fees_management" data-i18n="nav.navigate.navbar-inverse">\
                                                <span class="pcoded-micon"><i class="ti-angle-right"></i></span>\
                                                <span class="pcoded-mtext">Fees Management</span>\
                                                <span class="pcoded-mcaret"></span>\
                                            </a>\
                                        </li>\
										<li class=" ">\
                                            <a href="https://alxproject.virilesoftware.com/eportal/'+payload.username + '/payment_history" data-i18n="nav.navigate.navbar-inverse">\
                                                <span class="pcoded-micon"><i class="ti-angle-right"></i></span>\
                                                <span class="pcoded-mtext">Payment History</span>\
                                                <span class="pcoded-mcaret"></span>\
                                            </a>\
                                        </li>\
										<li class=" ">\
                                            <a href="https://alxproject.virilesoftware.com/eportal/'+payload.username + '/fees_reports" data-i18n="nav.navigate.navbar-inverse">\
                                                <span class="pcoded-micon"><i class="ti-angle-right"></i></span>\
                                                <span class="pcoded-mtext">Fees Reports</span>\
                                                <span class="pcoded-mcaret"></span>\
                                            </a>\
                                        </li>\
										<li class=" ">\
                                            <a href="https://alxproject.virilesoftware.com/eportal/'+payload.username + '/expenses" data-i18n="nav.navigate.navbar-inverse">\
                                                <span class="pcoded-micon"><i class="ti-angle-right"></i></span>\
                                                <span class="pcoded-mtext">Expenses</span>\
                                                <span class="pcoded-mcaret"></span>\
                                            </a>\
                                        </li>\
										<li class=" ">\
                                            <a href="https://alxproject.virilesoftware.com/eportal/'+payload.username + '/other_income" data-i18n="nav.navigate.navbar-inverse">\
                                                <span class="pcoded-micon"><i class="ti-angle-right"></i></span>\
                                                <span class="pcoded-mtext">Other Income</span>\
                                                <span class="pcoded-mcaret"></span>\
                                            </a>\
                                        </li>\
										<li class=" ">\
                                            <a href="https://alxproject.virilesoftware.com/eportal/'+payload.username + '/fees_registrar" data-i18n="nav.navigate.navbar-inverse">\
                                                <span class="pcoded-micon"><i class="ti-angle-right"></i></span>\
                                                <span class="pcoded-mtext">Fees Registrar</span>\
                                                <span class="pcoded-mcaret"></span>\
                                            </a>\
                                        </li>\
                                        <li class=" ">\
                                            <a href="https://alxproject.virilesoftware.com/eportal/'+payload.username + '/finance_report" data-i18n="nav.navigate.navbar-inverse">\
                                                <span class="pcoded-micon"><i class="ti-angle-right"></i></span>\
                                                <span class="pcoded-mtext">Reports</span>\
                                                <span class="pcoded-mcaret"></span>\
                                            </a>\
                                        </li>\
                                    </ul>\
                                </li>\
								<li class="pcoded-hasmenu">\
                                    <a href="javascript:void(0)" data-i18n="nav.navigate.main">\
                                        <span class="pcoded-micon"><i class="icon ion-cash"></i></span>\
                                        <span class="pcoded-mtext">Result</span>\
                                        <span class="pcoded-mcaret"></span>\
                                    </a>\
                                    <ul class="pcoded-submenu">\
                                        <li class=" ">\
                                            <a href="https://alxproject.virilesoftware.com/eportal/'+payload.username + '/result_subject" data-i18n="nav.navigate.navbar-inverse">\
                                                <span class="pcoded-micon"><i class="ti-angle-right"></i></span>\
                                                <span class="pcoded-mtext">Enter Score</span>\
                                                <span class="pcoded-mcaret"></span>\
                                            </a>\
                                        </li>\
										<li class=" ">\
                                            <a href="https://alxproject.virilesoftware.com/eportal/'+payload.username + '/bulk_result" data-i18n="nav.navigate.navbar-inverse">\
                                                <span class="pcoded-micon"><i class="ti-angle-right"></i></span>\
                                                <span class="pcoded-mtext">Upload Score in Bulk</span>\
                                                <span class="pcoded-mcaret"></span>\
                                            </a>\
                                        </li>\
										<li class=" ">\
                                            <a href="https://alxproject.virilesoftware.com/eportal/'+payload.username + '/subject_performace" data-i18n="nav.navigate.navbar-inverse">\
                                                <span class="pcoded-micon"><i class="ti-angle-right"></i></span>\
                                                <span class="pcoded-mtext">Performance Metrics</span>\
                                                <span class="pcoded-mcaret"></span>\
                                            </a>\
                                        </li>\
										<li class=" ">\
                                            <a href="https://alxproject.virilesoftware.com/eportal/'+payload.username + '/report_card" data-i18n="nav.navigate.navbar-inverse">\
                                                <span class="pcoded-micon"><i class="ti-angle-right"></i></span>\
                                                <span class="pcoded-mtext">Report Card</span>\
                                                <span class="pcoded-mcaret"></span>\
                                            </a>\
                                        </li>\
										<li class=" ">\
                                            <a href="https://alxproject.virilesoftware.com/eportal/'+payload.username + '/broad_sheet" data-i18n="nav.navigate.navbar-inverse">\
                                                <span class="pcoded-micon"><i class="ti-angle-right"></i></span>\
                                                <span class="pcoded-mtext">Broad Sheet</span>\
                                                <span class="pcoded-mcaret"></span>\
                                            </a>\
                                        </li>\
                                        <li class=" ">\
                                            <a href="https://alxproject.virilesoftware.com/eportal/'+payload.username + '/promotion" data-i18n="nav.navigate.navbar-inverse">\
                                                <span class="pcoded-micon"><i class="ti-angle-right"></i></span>\
                                                <span class="pcoded-mtext">Promotion</span>\
                                                <span class="pcoded-mcaret"></span>\
                                            </a>\
                                        </li>\
                                    </ul>\
                                </li>\
                                <li>\
                                    <a href="javascript:void(0)" data-i18n="nav.navigate.main">\
                                        <span class="pcoded-micon"><i class="icon ion-person-stalker"></i></span>\
                                        <span class="pcoded-mtext">Parents</span>\
                                        <span class="pcoded-mcaret"></span>\
                                    </a>\
                                </li>\
                                <li  class="active">\
                                    <a href="https://alxproject.virilesoftware.com/eportal/'+payload.username + '/teacher">\
                                        <span class="pcoded-micon"><i class="icon ion-person"></i></span>\
                                        <span class="pcoded-mtext">Teachers</span>\
                                        </a>\
									\
                                </li>\
                                <li class="pcoded-hasmenu">\
                                    <a href="javascript:void(0)" data-i18n="nav.navigate.main">\
                                        <span class="pcoded-micon"><i class="icon ion-ios-calendar"></i></span>\
                                        <span class="pcoded-mtext">Communications</span>\
                                        <span class="pcoded-mcaret"></span>\
                                    </a>\
                                    <ul class="pcoded-submenu">\
                                        <li class=" ">\
                                        <a href="https://alxproject.virilesoftware.com/eportal/'+payload.username + '/addnotice">\
                                                <span class="pcoded-micon"><i class="ti-angle-right"></i></span>\
                                                <span class="pcoded-mtext">Announcement</span>\
                                                <span class="pcoded-mcaret"></span>\
                                            </a>\
                                        </li>\
                                        <li class=" ">\
                                        <a href="navbar-light.html" data-i18n="nav.navigate.navbar">\
                                            <span class="pcoded-micon"><i class="ti-angle-right"></i></span>\
                                            <span class="pcoded-mtext">Events</span>\
                                            <span class="pcoded-mcaret"></span>\
                                        </a>\
                                    </li>\
                                        <li class=" ">\
                                            <a href="#" data-i18n="nav.navigate.navbar-inverse">\
                                                <span class="pcoded-micon"><i class="ti-angle-right"></i></span>\
                                                <span class="pcoded-mtext">Email</span>\
                                                <span class="pcoded-mcaret"></span>\
                                            </a>\
                                        </li>\
                                    </ul>\
                                </li>\
                                <li class="pcoded-hasmenu">\
                                    <a href="javascript:void(0)">\
                                        <span class="pcoded-micon"><i class="icon ion-ios-gear"></i></span>\
                                        <span class="pcoded-mtext">Setup</span>\
                                        <span class="pcoded-mcaret"></span>\
                                    </a>\
                                    <ul class="pcoded-submenu">\
                                        <li class=" ">\
                                            <a href="https://alxproject.virilesoftware.com/eportal/'+payload.username + '/schoolclass">\
                                                <span class="pcoded-micon"><i class="ti-angle-right"></i></span>\
                                                <span class="pcoded-mtext">School Class</span>\
                                                <span class="pcoded-mcaret"></span>\
                                            </a>\
                                        </li>\
										<li class=" ">\
                                            <a href="https://alxproject.virilesoftware.com/eportal/'+payload.username + '/classarm">\
                                                <span class="pcoded-micon"><i class="ti-angle-right"></i></span>\
                                                <span class="pcoded-mtext">Class Arms</span>\
                                                <span class="pcoded-mcaret"></span>\
                                            </a>\
                                        </li>\
                                        <li class=" ">\
                                            <a href="https://alxproject.virilesoftware.com/eportal/'+payload.username + '/session" data-i18n="nav.navigate.navbar-inverse">\
                                                <span class="pcoded-micon"><i class="ti-angle-right"></i></span>\
                                                <span class="pcoded-mtext">Academic Session</span>\
                                                <span class="pcoded-mcaret"></span>\
                                            </a>\
                                        </li>\
										<li class=" ">\
                                            <a href="https://alxproject.virilesoftware.com/eportal/'+payload.username + '/subject" data-i18n="nav.navigate.navbar-inverse">\
                                                <span class="pcoded-micon"><i class="ti-angle-right"></i></span>\
                                                <span class="pcoded-mtext">Subject</span>\
                                                <span class="pcoded-mcaret"></span>\
                                            </a>\
                                        </li>\
                                        <li class=" ">\
                                            <a href="https://alxproject.virilesoftware.com/eportal/'+payload.username + '/fees_type" data-i18n="nav.navigate.navbar-inverse">\
                                                <span class="pcoded-micon"><i class="ti-angle-right"></i></span>\
                                                <span class="pcoded-mtext">Fees Type</span>\
                                                <span class="pcoded-mcaret"></span>\
                                            </a>\
                                        </li>\
										<li class=" ">\
                                            <a href="https://alxproject.virilesoftware.com/eportal/'+payload.username + '/school_account" data-i18n="nav.navigate.navbar-inverse">\
                                                <span class="pcoded-micon"><i class="ti-angle-right"></i></span>\
                                                <span class="pcoded-mtext">School Account</span>\
                                                <span class="pcoded-mcaret"></span>\
                                            </a>\
                                        </li>\
										<li class=" ">\
                                            <a href="https://alxproject.virilesoftware.com/eportal/'+payload.username + '/expenses_type" data-i18n="nav.navigate.navbar-inverse">\
                                                <span class="pcoded-micon"><i class="ti-angle-right"></i></span>\
                                                <span class="pcoded-mtext">Expenses Type</span>\
                                                <span class="pcoded-mcaret"></span>\
                                            </a>\
                                        </li>\
										<li class=" ">\
                                            <a href="https://alxproject.virilesoftware.com/eportal/'+payload.username + '/mark_distribution" data-i18n="nav.navigate.navbar-inverse">\
                                                <span class="pcoded-micon"><i class="ti-angle-right"></i></span>\
                                                <span class="pcoded-mtext">Mark Distribution</span>\
                                                <span class="pcoded-mcaret"></span>\
                                            </a>\
                                        </li>\
                                        <li class=" ">\
                                            <a href="https://alxproject.virilesoftware.com/eportal/'+payload.username + '/reportcard_setting" data-i18n="nav.navigate.navbar-inverse">\
                                                <span class="pcoded-micon"><i class="ti-angle-right"></i></span>\
                                                <span class="pcoded-mtext">Report Card</span>\
                                                <span class="pcoded-mcaret"></span>\
                                            </a>\
                                        </li>\
										<li class=" ">\
                                            <a href="https://alxproject.virilesoftware.com/eportal/'+payload.username + '/grade" data-i18n="nav.navigate.navbar-inverse">\
                                                <span class="pcoded-micon"><i class="ti-angle-right"></i></span>\
                                                <span class="pcoded-mtext">Grade</span>\
                                                <span class="pcoded-mcaret"></span>\
                                            </a>\
                                        </li>\
                                        <li class=" ">\
                                            <a href="#" data-i18n="nav.navigate.navbar-inverse">\
                                                <span class="pcoded-micon"><i class="ti-angle-right"></i></span>\
                                                <span class="pcoded-mtext">School Information</span>\
                                                <span class="pcoded-mcaret"></span>\
                                            </a>\
                                        </li>\
                                    </ul>\
                                </li>\
								<li class="	">\
                                    <a href="https://alxproject.virilesoftware.com/eportal/'+payload.username + '/admin">\
                                        <span class="pcoded-micon"><i class="fa fa-user-secret"></i></span>\
                                        <span class="pcoded-mtext">Administrator</span>\
                                        </a>\
								</li>'
			
                                if(payload.position != 'Owner'){
                                    htmls += ' <li class=" ">\
                                        <a href="https://alxproject.virilesoftware.com/eportal/'+payload.username +'/manage_password" data-i18n="nav.navigate.navbar-inverse">\
                                        <span class="pcoded-micon"><i class="icon ion-ios-gear"></i></span>\
                                            <span class="pcoded-mtext">Password</span>\
                                            \
                                        </a>\
                                    </li>'
                                }
			$('#side-menu').html(htmls)
			
			
		}
		else{
			$.ajax({
			type: 'GET',
			data: null,
			url: 'https://alxproject.virilesoftware.com/api/staffmenu',
			dataType:'JSON',
			beforeSend : function(req) {
				req.setRequestHeader('Authorization', 'Bearer '+token);
			}
		}).done(function(data){
			//console.log(data)
			var menu_data = {borrowers:'d-none',add_borrowers:'d-none', view_borrowers:'d-none', loan:'d-none', view_loan:'d-none', due_loan:'d-none', view_guarantor:'d-none', view_approved_loan:'d-none',
	view_projection:'d-none', view_payment_sheet:'d-none', groups:'d-none', add_group:'d-none', view_all_group:'d-none', view_group_projection:'d-none', view_group_payment:'d-none',
	repayment:'d-none', view_all_repayment:'d-none', view_due_repayment:'d-none', view_miss_repayment:'d-none', view_no_repayment:'d-none', collateral:'d-none', saving_account:'d-none',
	savings:'d-none', saving_transaction:'d-none', reports:'d-none',part_maturity:'d-none',principal_outstanding:'d-none', late_loan:'d-none', 
	cash_flow:'d-none',charts:'d-none', admin:'d-none', loan_products:'d-none',add_repayment:'d-none',add_saving_plan:'d-none', group_transaction:'d-none',
	saving_plan:'d-none',loan_fee:'d-none',payment_method:'d-none',manage_branch:'d-none', add_branch:'d-none',view_branch:'d-none',staff:'d-none',
				disbursement:'d-none',cose_account:'d-none',}
	
			if(data.status == 'ok'){
				
			}
			else{
				var htmls = '<li class="nav-item"><a href="https://alxproject.virilesoftware.com/' + dt.toString() + '" class="nav-link">\
				<i class="link-icon" data-feather="home"></i><span class="link-title">Home</span></a></li>'
			}
			$('#side-menu').html(htmls)
			
			
		})
			
				
		}
		
		
		
	
		
	}
			
	if(payload.position == 'Owner')
	{
		var htmlss = '<li><a href="javascript:;"><i class="ti-email"></i>My Messages</a></li>\
        <li><a href="javascript:;" id="user-logout"><i class="ti-layout-sidebar-left"></i>Log Out</a></li>\
				'
		$('.profile-notification').html(htmlss)
		


	}else{
		var htmlss = '<li><a href="javascript:;" id="user-logout"><i class="ti-layout-sidebar-left"></i>Log Out</a></li>'
		$('.profile-notification').html(htmlss)
			

	} 
			 

})