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
	
	if(auth.isLoggedIn())
	{
		
		var token = auth.getToken();
		var href = 'https://alxproject.virilesoftware.com/api/session';
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
			for(var i = 0; i < datas.length; i++)
			{
				$('#academic_session').append('<option value="'+datas[i].ref_id+'">'+datas[i].name+'</option>')
				
			}
		});
		
		var href = 'https://alxproject.virilesoftware.com/api/classarm';
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
			for(var i = 0; i < datas.length; i++)
			{
				$('#student_class').append('<option value="'+datas[i].ref_id+'">'+datas[i].name+'</option>')
				
			}
		});
		
		
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
				$('.load-submit_save').addClass('d-none');
				$('#processing-btn').removeClass('d-none');
                
               var m_data = new FormData(); 
				
				m_data.append("passport", $("input[name=avatar-1]")[0].files[0]);
				m_data.append('surname', trimdata($('input[name=surname]').val()));
				m_data.append('firstname', trimdata($('input[name=firstname]').val()));
				m_data.append('middlename', trimdata($('input[name=middlename]').val()));
				m_data.append('admission_no', trimdata($('input[name=admission_no]').val()));
				m_data.append('admission_year', $('input[name=admission_year]').val());
				m_data.append('gender', $('#gender').val());
				m_data.append('dob', $('input[name=dob]').val());
				m_data.append('religion', trimdata($('input[name=religion]').val()));
				m_data.append('nationality', $('#nationality').val());
				m_data.append('academic_session', $('#academic_session').select2('data')[0].id);
				m_data.append('session_term',$('#session_term').val());
				m_data.append('student_class', $('#student_class').select2('data')[0].id);
				m_data.append('address', $('input[name=address]').val());
				m_data.append('city', $('input[name=city]').val());
				m_data.append('state', $('input[name=state]').val());
				m_data.append('country', $('#country').val());
				m_data.append('hobbies', $('input[name=hobbies]').val());
				m_data.append('ailment', $('input[name=ailment]').val());
				m_data.append('disability', $('input[name=disability]').val());
				m_data.append('guardian', guardian);
				m_data.append('password', $('input[name=password]').val());
				var href = 'https://alxproject.virilesoftware.com/api/student';
                $.ajax({
                    type: 'POST',
                    data: m_data,
					contentType: false,
					processData: false,
                    url: href,
                    dataType: 'JSON',
                    beforeSend: function (req) {
                        req.setRequestHeader('Authorization', 'Bearer ' + token);
                    }
                }).done(function (data) {
					//console.log(data)
					var payload = jwt_decode(token);
                    if (data.status == 'ok') {
						toastr.success(data.msg, {"closeButton": true, timeOut: 9500 })
						var atr = $('.load-submit').attr('data-page')
						window.location.reload()
						
						$('#load-submit').removeClass('d-none');
                        $('#processing-btn').addClass('d-none');
						
						
                    } else {
                        toastr.warning(data.msg,{"closeButton": true, timeOut: 9500 })
                        $('#load-submit').removeClass('d-none');
						$('.load-submit_save').removeClass('d-none');
                        $('#processing-btn').addClass('d-none');
                    }

                });
            }
        })

    });
	
	$(document).on('click', '.load-submit_save', function (event) {
		event.stopImmediatePropagation()
		event.stopPropagation()
		$('#processorderform').validate({

            submitHandler: function () {
                event.preventDefault()
				var token = auth.getToken();
                $('.load-submit').addClass('d-none');
				$('.load-submit_save').addClass('d-none');
				$('#processing-btn').removeClass('d-none');
                
               var m_data = new FormData(); 
				
				m_data.append("passport", $("input[name=avatar-1]")[0].files[0]);
				m_data.append('surname', trimdata($('input[name=surname]').val()));
				m_data.append('firstname', trimdata($('input[name=firstname]').val()));
				m_data.append('middlename', trimdata($('input[name=middlename]').val()));
				m_data.append('admission_no', trimdata($('input[name=admission_no]').val()));
				m_data.append('admission_year', $('input[name=admission_year]').val());
				m_data.append('gender', $('#gender').val());
				m_data.append('dob', $('input[name=dob]').val());
				m_data.append('religion', trimdata($('input[name=religion]').val()));
				m_data.append('nationality', $('#nationality').val());
				m_data.append('academic_session', $('#academic_session').select2('data')[0].id);
				m_data.append('session_term',$('#session_term').val());
				m_data.append('student_class', $('#student_class').select2('data')[0].id);
				m_data.append('address', $('input[name=address]').val());
				m_data.append('city', $('input[name=city]').val());
				m_data.append('state', $('input[name=state]').val());
				m_data.append('country', $('#country').val());
				m_data.append('hobbies', $('input[name=hobbies]').val());
				m_data.append('ailment', $('input[name=ailment]').val());
				m_data.append('disability', $('input[name=disability]').val());
				m_data.append('guardian', guardian);
				m_data.append('password', $('input[name=password]').val());
				var href = 'https://alxproject.virilesoftware.com/api/student';
                $.ajax({
                    type: 'POST',
                    data: m_data,
					contentType: false,
					processData: false,
                    url: href,
                    dataType: 'JSON',
                    beforeSend: function (req) {
                        req.setRequestHeader('Authorization', 'Bearer ' + token);
                    }
                }).done(function (data) {
					//console.log(data)
					var payload = jwt_decode(token);
                    if (data.status == 'ok') {
						toastr.success(data.msg,{"closeButton": true, timeOut: 9500 })
						var atr = $('.load-submit').attr('data-page')
						window.location = 'https://alxproject.virilesoftware.com/eportal/'+payload.username+'/students'
						
						$('#load-submit').removeClass('d-none');
                        $('#processing-btn').addClass('d-none');
						
						
                    } else {
                        toastr.warning(data.msg,{"closeButton": true, timeOut: 9500 })
                        $('#load-submit').removeClass('d-none');
						$('.load-submit_save').removeClass('d-none');
                        $('#processing-btn').addClass('d-none');
                    }

                });
            }
        })

    });
	
	
	$(document).on('click', '#create_guardian', function (event) {
		event.stopImmediatePropagation()
		event.stopPropagation()
		event.preventDefault()
				var token = auth.getToken();
                //$('#load-submit').addClass('d-none');
				//$('#processing-btn').removeClass('d-none');
         var phone = $('input[name=guardian_phone]').val()
		phone = phone.trim()
		var m_data = new FormData(); 
				
				m_data.append("passport", $("input[name=avatar-2]")[0].files[0]);
				m_data.append('name', trimdata($('input[name=guardian_name]').val()));
				m_data.append('phone', phone);
				m_data.append('email', trimdata($('input[name=guardian_email]').val()));
				m_data.append('occupation', $('input[name=guardian_occupation]').val());
				m_data.append('relationship', $('input[name=guardian_relationship]').val());
				m_data.append('address', $('input[name=guardian_address]').val());
				m_data.append('password', $('input[name=p_password]').val());
				var href = 'https://alxproject.virilesoftware.com/api/guardian';
                $.ajax({
                    type: 'POST',
                    data: m_data,
					contentType: false,
					processData: false,
                    url: href,
                    dataType: 'JSON',
                    beforeSend: function (req) {
                        req.setRequestHeader('Authorization', 'Bearer ' + token);
                    }
                }).done(function (data) {
					//console.log(data)
					var payload = jwt_decode(token);
                    if (data.status == 'ok') {
						guardian = data.ref_id
						$('input[name=guardian_input]').val(data.guardian)
						$('#new_parent').modal('hide');
						$('#guardianpanel').addClass('d-none')
						$('#create_guardian').removeClass('d-none');
                        $('#processing-btn').addClass('d-none');
						
						
                    } else {
                        toastr.warning(data.msg, {"closeButton": true, timeOut: 9500 })
                        $('#create_guardian').removeClass('d-none');
                        $('#processing-btn').addClass('d-none');
                    }

                });
		$('#processguardianform').validate({

            submitHandler: function () {
                
               
            }
        })

    });
	
	$(document).on('click', '.search_guardian_btn', function (event) {
		var g = $('input[name=guardian_search]').val()
		if(g == ''){}
		else{
			var href = 'https://alxproject.virilesoftware.com/api/searchguardian';
			$.ajax({
				type: 'GET',
				data: {info:g},
				url: href,
				dataType: 'JSON',
				beforeSend: function (req) {
					req.setRequestHeader('Authorization', 'Bearer ' + token);
				}
			}).done(function (data) {
				//console.log(data)
				var htmls = ''
				for(var i = 0; i < data.length; i++){
					htmls += '<div class="card mg-b-10"><div class="card-body">\
                  <h5 class="card-title tx-dark tx-medium mg-b-10">'+data[i].name+'</h5>\
                  <p class="card-subtitle tx-normal mg-b-15"><strong>'+data[i].phone+' </strong> '+data[i].email+'</p>\
                  <p class="card-text">'+data[i].occupation+' <br><span class="text-success">'+data[i].relationship+'</span></p>\
                  <a href="javascript:void(0)" class="card-link btn btn-primary assign_guardian" data-id="'+data[i].ref_id+'" data-name="'+data[i].name+'">Assign</a>\
                  \
                </div>\
              </div><!-- card -->'
					
				}
				
				$('#guardian_search_result').html(htmls)
					
			})
		}
	})
	$(document).on('click', '.assign_guardian', function (event) {
		guardian = $(this).attr('data-id')
		var name = $(this).attr('data-name')
		$('input[name=guardian_input]').val(name)
		$('#select_parent').modal('hide');
	})
	
});