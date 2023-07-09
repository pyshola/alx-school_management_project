$(document).ready(function(){
	
	if(auth.isLoggedIn())
	{
		var token = auth.getToken();
		var payload = JSON.parse(window.atob(token.split('.')[1]));
		var token_query = payload.exp > Date.now() / 1000
		if(token_query == true)
		{
			var href = 'https://alxproject.virilesoftware.com/api/schoolclass';
			$.ajax({
				type: 'GET',
				data: null,
				url: href,
				dataType:'JSON',
				beforeSend : function(req) {
					req.setRequestHeader('Authorization', 'Bearer '+token);
				}
			}).done(function(datas){
				//console.log(datas)
				$('#student_class_form').append('<option value="pre-primary">All Pre-Primary Pupil\'s</option>')
				$('#student_class_form').append('<option value="primary">All Primary  Pupil\'s</option>')
				$('#student_class_form').append('<option value="secondary">All Secondary  Pupil\'s</option>')
				
				
				for(var i = 0; i < datas.length; i++)
				{
					$('#student_class_form').append('<option value="'+datas[i].ref_id+'">'+datas[i].name+'</option>')
					
				}
			});
		}
		else{
		window.location = 'https://alxproject.virilesoftware.com/eportal/login'
		}
	}
	else
	{
		window.location = 'https://alxproject.virilesoftware.com/eportal/login'
	}
	$(document).on('click', '.logout', function (event) {
		
		event.preventDefault()
		auth.deleteToken();
		window.location.reload();
	});
	
	
	$(document).on('click', '.load-submit', function (event) {
		//alert('form')
		$('#processorderform').validate({
			
			submitHandler: function() {
				event.preventDefault()
				var form_data = new FormData();
				var subject = $('input[name=subject]').val();
                var author = $('input[name=author]').val();
                var msg_type = $('input[name=msg_type]').val();
				var destination = $('input[name=destination]').val();
                var data = CKEDITOR.instances.editor.getData();
				var summary = CKEDITOR.instances.editor.document.getBody().getText()
				var branch = $('#student_class_form').select2('data')
				var b = []
				for(var i = 0; i < branch.length; i++){
					b.push(branch[i].id)
				}
                var mem = {subject:subject, author:author, msg_type:msg_type,  'data':data, 'summary':summary,student_class:JSON.stringify(b),destination:destination}
				//console.log(mem)
				var token = auth.getToken();
				
				var payload = JSON.parse(window.atob(token.split('.')[1]));
				$.ajax({
					type: 'POST',
					data: mem,
					url: 'https://alxproject.virilesoftware.com/api/notice',
					beforeSend : function(req) {
					req.setRequestHeader('Authorization', 'Bearer '+token);
					}
				
				}).done(function( response ) {
					if(response.status == 'ok')
					{
						alert(response.message);
						window.location.reload();
					}
					else
					{
						alert(response.msg);
					
					}
		
					
				});
				
				
		
	
			}
		
		
	});
	});
	
});