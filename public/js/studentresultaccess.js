function getQueryParams(url) {
	const urlObj = new URL(url);
	urlObj.hash = "";
	console.log(urlObj)
    const paramArr = urlObj.href.slice(url.indexOf('?') + 1).split('&');
    const params = {};
    paramArr.map(param => {
        const [key, val] = param.split('=');
        params[key] = decodeURIComponent(val);
    })
    return params;
}

$(document).ready(function(){
	var token = auth.getToken();
	if(auth.isLoggedIn())
	{
        let mem = getQueryParams(window.location.href)
        var payload = jwt_decode(token);
        console.log(mem)
        var href = 'https://alxproject.virilesoftware.com/api/studentreportcardaccess';
		$.ajax({
			type: 'GET',
			data: mem,
			url: href,
			dataType:'JSON',
			beforeSend : function(req) {
				req.setRequestHeader('Authorization', 'Bearer '+token);
			}
		}).done(function(data){
            var htmls = ''
            for(let i = 0; i < data.length; i++){
				if(data[i].publish == true){
					htmls += '<tr><td>'+ data[i].name+ '</td>\
				<td>'+data[i].academic_session+'</td><td>'+data[i].term+'</td>\
				<td>'+data[i].class_name+'</td>\
				<td><div class="toggle-btn active">\
				<input type="checkbox" checked class="publish-value" id="publish'+data[i].ref_id+'" data-id="'+data[i].ref_id+'" data-term="'+data[i].term+'"/>\
				<span class="round-btn"></span>\
			  </div></td>\
				</tr>'
			  
				}
				else{
					htmls += '<tr><td>'+ data[i].name+ '</td>\
				<td>'+data[i].academic_session+'</td><td>'+data[i].term+'</td>\
				<td>'+data[i].class_name+'</td>\
				<td><div class="toggle-btn">\
				<input type="checkbox" class="publish-value" data-id="'+data[i].ref_id+'" data-term="'+data[i].term+'"/>\
				<span class="round-btn"></span>\
			  </div></td>\
				</tr>'
					
				}
				
				

			}
			
			$('#tablebody').html(htmls)

        })
		
		
	}
	else
	{
		window.location = 'https://alxproject.virilesoftware.com/eportal/login'
	}
	
	$(document).on('click', '.publish-value', function (event) {
		let ref_ids = $(this).attr('data-id')
        let term = $(this).attr('data-term')
        let session = $(this).attr('data-session')
		var mainParent = $(this).parent('.toggle-btn');
		if($(mainParent).find('input.publish-value').is(':checked')) {
			$(mainParent).addClass('active');
			var href = 'https://alxproject.virilesoftware.com/api/publishstudentresult';
			$.ajax({
				type: 'POST',
				data: {ref_id:ref_ids, session:session,term:term, publish:'publish'},
				url: href,
				dataType:'JSON',
				beforeSend : function(req) {
					req.setRequestHeader('Authorization', 'Bearer '+token);
				}
			}).done(function(datas){
				if(datas.status == 'ok'){
					$(mainParent).addClass('active');
				}
				else{
					$(mainParent).removeClass('active');
				}
				

			})
		  $(mainParent).addClass('active');
		} else {
		  $(mainParent).removeClass('active');
		  var href = 'https://alxproject.virilesoftware.com/api/publishstudentresult';
			$.ajax({
				type: 'POST',
				data: {ref_id:ref_ids, term:term, publish:'unpublish'},
				url: href,
				dataType:'JSON',
				beforeSend : function(req) {
					req.setRequestHeader('Authorization', 'Bearer '+token);
				}
			}).done(function(datas){
				if(datas.status == 'ok'){
					$(mainParent).removeClass('active');
				}
				else{
					$(mainParent).addClass('active');
				}
				

			})
		}
	  
	  })
	
});