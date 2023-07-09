$(document).ready(function(){
	var guardian = 0
	
	if(auth.isLoggedIn())
	{
		
		var token = auth.getToken();
	}
	else
	{
		window.location = 'https://alxproject.virilesoftware.com/eportal/login'
	}
	
	
    
	
	
	
    $(document).on('click', '.load-submit', function (event) {
		event.stopImmediatePropagation()
		event.stopPropagation()
		$('#processorderform').validate({

            submitHandler: function () {
                event.preventDefault()
				var token = auth.getToken();
                $('.load-submit').addClass('d-none');
				$('#processing-btn').removeClass('d-none');
				var href = 'https://alxproject.virilesoftware.com/api/password';
                $.ajax({
                    type: 'PUT',
                    data: {'password':$('input[name=password]').val(), current_password:$('input[name=current_password]').val()},
					url: href,
                    dataType: 'JSON',
                    beforeSend: function (req) {
                        req.setRequestHeader('Authorization', 'Bearer ' + token);
                    }
                }).done(function (data) {
					//console.log(data)
					var payload = jwt_decode(token);
                    if (data.status == 'ok') {
						alert(data.msg)
						window.location.reload()
						
						
                    } else {
                        alert(data.msg)
                        toastr.warning(data.msg,{"closeButton": true, timeOut: 9500 })
                        $('#processing-btn').addClass('d-none');
                        $('#load-submit').removeClass('d-none');
                    }

                });
            }
        })

    });
	
	
});