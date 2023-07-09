$(document).ready(function() {
	
	
	$(document).on('click', '#load-submit', function (event) {
		event.stopImmediatePropagation()
		event.stopPropagation()
		$('#loginuser').validate({
			
			submitHandler: function() {
				event.preventDefault()
				$('#errormsg').addClass('hide')
				var username = $('input[name=email]').val();
				var password = $('input[name=password]').val();
				var href = 'https://alxproject.virilesoftware.com/autheticate/login';
				var passd = {'username':username,'password':password}
				$('.login_btn').button('loading');
				$.ajax({
						type: 'POST',
						data: passd,
						url: href,
						dataType:'JSON',
						}).done(function(data){
							
					if(data.status == 'error')
					{
						swal("Error", data.msg, "error");
					}
					else
					{
						auth.saveToken(data.token);
						var token = auth.getToken()
						var payload = jwt_decode(token);					
						window.location = 'https://alxproject.virilesoftware.com/eportal/'+payload.username
						
						
					
					}
					//window.location.reload();
					   
				});
				
				
				
			}
			
			});
		
		
	});
	
	
})