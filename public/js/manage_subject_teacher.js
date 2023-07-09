$(document).ready(function(){
	
	var token = auth.getToken();
	
	
	if(auth.isLoggedIn())
	{
		
		var href = 'https://alxproject.virilesoftware.com/api/teachersubjectlist';
		$.ajax({
			type: 'GET',
			data: null,
			url: href,
			dataType:'JSON',
			beforeSend : function(req) {
				req.setRequestHeader('Authorization', 'Bearer '+token);
			}
		}).done(function(data){
			console.log(data)
            var payload = jwt_decode(token);
			var htmls = ''
			for(var i = 0; i < data.length; i++){
				htmls += '<tr>\
                  <th scope="row"><a href="https://alxproject.virilesoftware.com/eportal/'+payload.username+'/subjectdetail/'+data[i].ref_id+'?session='+encodeURIComponent(data[i].academic_session)+'&cls='+encodeURIComponent(data[i].student_class)+'&subject='+encodeURIComponent(data[i].name)+'" class="">'+data[i].name+'</a></th>\
                  <td>'+data[i].class_arm+'</td>\
                  <td>'+data[i].text_book+'</td>\
                  <td>'+data[i].student+'</td>\
				</tr>'
			}
			
			
			$('#hometable').html(htmls)
			
		})
		
		
	}
	else
	{
		window.location = 'https://alxproject.virilesoftware.com/eportal/login'
	}
	
	
	
	
});