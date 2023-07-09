$(document).ready(function(){
	
	if(auth.isLoggedIn())
	{
		var token = auth.getToken();
		var ref = $('head').attr('id')
		var href = 'https://alxproject.virilesoftware.com/api/notice/'+ref;
		$.ajax({
			type: 'GET',
			data: null,
			url: href,
			dataType:'JSON',
			beforeSend : function(req) {
				req.setRequestHeader('Authorization', 'Bearer '+token);
			}
		}).done(function(data){
			var htmls = ''
			var payload = jwt_decode(token);
			console.log(data)
            if(data.status == 'ok'){
                var file = data.data
                var htmls = '<h3 class="card-profile-name">'+file.subject+'</h3>\
                <p class="card-profile-position">'+file.author+'<a href="#"> '+file.destination+'</a></p>\
                <p>'+file.publish_date+'</p>\
                <p class="mg-b-0">'+file.content+'</p>\
              '
              $('#content').html(htmls)
            }
			
		});
	}
	else
	{
		window.location = 'https://alxproject.virilesoftware.com/login'
	}
	
	
	
	
	
	

});