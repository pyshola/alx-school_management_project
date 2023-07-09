$(document).ready(function(){
	
	
	$(document).on('click', '#load-submit', function (event) {
		event.stopImmediatePropagation()
		event.stopPropagation()
		$('#registeruser').validate({
			submitHandler: function() {
				
				event.preventDefault()
				var email = $('input[name=email]').val();
				var school_email = $('input[name=school_email]').val();
				var password = $('input[name=password]').val();
				var firstname = $('input[name=firstname]').val();
				var lastname = $('input[name=lastname]').val();
				var phone = $('input[name=phone]').val();
				var school = $('input[name=school_name]').val();
				var passd = {'email':email, 'school_email':school_email,'password':password,'firstname':firstname, 'lastname':lastname, 'phone':phone, 'school':school}
				var href = 'https://alxproject.virilesoftware.com/autheticate/signup';
				$('#load-submit').button('loading');
				//$('#errormsg').addClass('hide')
				$.ajax({
						type: 'POST',
						data: passd,
						url: href,
						dataType:'JSON',
						}).done(function(data){
					if(data.status == 'error')
					{
						$('#load-submit').button('reset');
						//$('#errormsg').html(data.msg)
						swal("Error", data.msg, "error");
						//$('#errormsg').removeClass('hide')
						
					}
					else
					{
						auth.saveToken(data.token);
						var token = auth.getToken()
						var payload = jwt_decode(token);					
						window.location = 'https://alxproject.virilesoftware.com/eportal/'+payload.username						
					}
					
					   
				});
				
				
				
			}
			
			});
		
		
	});
	
})