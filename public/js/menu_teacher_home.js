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
		
		$.ajax({
			type: 'GET',
			data: null,
			url: 'https://alxproject.virilesoftware.com/api/teachermenu',
			dataType:'JSON',
			beforeSend : function(req) {
				req.setRequestHeader('Authorization', 'Bearer '+token);
			}
		}).done(function(data){
            //console.log(data)
            var htmls = ''
            if(data.status == 'ok'){
                if(data.class_teacher == 'Yes'){
                   htmls += '<li class=" "><a href="https://alxproject.virilesoftware.com/eportal/'+payload.username +'/manage_class" data-i18n="nav.navigate.navbar">\
                   <span class="pcoded-micon"><i class="icon ion-ios-people"></i></span>\
			        <span class="pcoded-mtext">Class</span></a></li>'
                }
                if(data.subject_teacher == 'Yes'){
                    htmls += ' <li class=" ">\
                    <a href="https://alxproject.virilesoftware.com/eportal/'+payload.username +'/manage_subject" data-i18n="nav.navigate.navbar-inverse">\
                    <span class="pcoded-micon"><i class="icon ion-ios-book"></i></span>\
                        <span class="pcoded-mtext">Subject</span>\
                        \
                    </a>\
                </li>'
                }
				htmls += ' <li class=" ">\
                    <a href="https://alxproject.virilesoftware.com/eportal/'+payload.username +'/manage_password" data-i18n="nav.navigate.navbar-inverse">\
                    <span class="pcoded-micon"><i class="icon ion-ios-gear"></i></span>\
                        <span class="pcoded-mtext">Password</span>\
                        \
                    </a>\
                </li>'
            }
            $('#side-menu').html(htmls)
		})	
		
	}
			
	var htmlss = '<li><a href="javascript:;" id="user-logout"><i class="ti-layout-sidebar-left"></i>Log Out</a></li>'
	$('.profile-notification').html(htmlss)
 

})