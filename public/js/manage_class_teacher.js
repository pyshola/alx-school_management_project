$(document).ready(function(){
	var token = auth.getToken();
	
	
	if(auth.isLoggedIn())
	{
		var href = 'https://alxproject.virilesoftware.com/api/teacherclass';
        $.ajax({
            type: 'GET',
            data:null,
            url: href,
            dataType:'JSON',
            beforeSend : function(req) {
                req.setRequestHeader('Authorization', 'Bearer '+token);
            }
        }).done(function(info){
            var payload = jwt_decode(token);
            var htmls = ''
            for(var i = 0; i < info.length; i++){
                htmls += '<tr>\
                <th scope="row"><a href="https://alxproject.virilesoftware.com/eportal/'+payload.username+'/classdetail/'+info[i].ref_id+'?session='+encodeURIComponent(info[i].academic_session)+'&cls='+encodeURIComponent(info[i].name)+'" class="">'+ info[i].name+'</a></th>\
                <td>'+info[i].student+'</td>\
                </tr>'
            }
                 
            
            $('#hometable').html(htmls)
		});
		
		
		
	}
	else
	{
		window.location = 'https://alxproject.virilesoftware.com/eportal/login'
	}
	
	
	
	
	
	
});