function trimdata(name){
	if(!isNaN(name) == false){
		name = name.trim();
		var ref = name.replace(/ +(?= )/g,'');
		return ref;
	}
	else{
		return ''
	}
}


$(document).ready(function(){
	var guardian = 0
	var student_info = []
	if(auth.isLoggedIn())
	{
		
		var token = auth.getToken();
		var href = 'https://alxproject.virilesoftware.com/api/academicstudent';
		$.ajax({
			type: 'GET',
			data: null,
			url: href,
			dataType:'JSON',
			beforeSend : function(req) {
				req.setRequestHeader('Authorization', 'Bearer '+token);
			}
		}).done(function(datas){
			console.log(datas)
			student_info = datas
			for(var i = 0; i < datas.length; i++)
			{
				$('#student_class').append('<option value="'+datas[i].student_class_id+'">'+datas[i].student_class+'</option>')
				
			}
			var stud = datas[0].student
			for(var i = 0; i < stud.length; i++){
				$('#student').append('<option value="'+stud[i].student_id+'">'+stud[i].name+'</option>')
			}
		});
		
		
		
	}
	else
	{
		window.location = 'https://alxproject.virilesoftware.com/eportal/login'
	}
	
	$(document).on('change', '#student_class', function (event) {
		var ref_id = $('#student_class').val()
		$('#student').html('')
		for(var s = 0; s < student_info.length; s++)
		{
			if(ref_id == student_info[s].student_class_id){
				var stud = student_info[s].student
				for(var i = 0; i < stud.length; i++){
					$('#student').append('<option value="'+stud[i].student_id+'">'+stud[i].name+'</option>')
				}
				break
			}
		}
	})

	
	
	$(document).on('click', '#load-submit', function (event) {
		event.stopImmediatePropagation()
		event.stopPropagation()
		$('#sessionform').validate({

            submitHandler: function () {
                event.preventDefault()
				var token = auth.getToken();
                $('#load-submit').addClass('d-none');
				$('#processing-btn').removeClass('d-none');
                var amount = $('input[name=amount]').val()
                amount = new Number(amount.replace(/,/g, ''));
				
				
                var passd = {
                    amount:amount,
					student:$('#student').select2('data')[0].id,
					student_class:$('#student_class').select2('data')[0].id,
					offer:$('input[name=offer_name]').val()
                }
                var href = 'https://alxproject.virilesoftware.com/api/specialoffer';
                $.ajax({
                    type: 'POST',
                    data: passd,
                    url: href,
                    dataType: 'JSON',
                    beforeSend: function (req) {
                        req.setRequestHeader('Authorization', 'Bearer ' + token);
                    }
                }).done(function (data) {
                    if (data.status == 'ok') {
						var branch = $('#student_class_form').select2('data')
						var payload = jwt_decode(token);
						toastr.success(data.msg,{"closeButton": true, timeOut: 9500 })
						window.location.reload()
						$('#load-submit').removeClass('d-none');
                        $('#processing-btn').addClass('d-none');
						
						
                    } else {
                        toastr.warning(data.msg,{"closeButton": true, timeOut: 9500 })
                        $('#load-submit').removeClass('d-none');
                        $('#processing-btn').addClass('d-none');
                    }

                });
            }
        })

    });
	
});