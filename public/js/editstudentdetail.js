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
	var token = auth.getToken();
	if(auth.isLoggedIn())
	{
		
		var payload = jwt_decode(token);
		var ref_id = $('head').attr('id')
		var href = 'https://alxproject.virilesoftware.com/api/studentdetail/'+ref_id;
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
			if(datas.status == 'ok'){
				var info = datas.data
				//$("input[name=avatar-1]")[0].files[0];
				$('input[name=surname]').val(info.surname);
				$('input[name=firstname]').val(info.firstname);
				$('input[name=middlename]').val(info.middlename);
				$('input[name=admission_no]').val(info.admission_no);
				$('input[name=admission_year]').val(moment(info.admission_date).format('DD/MM/YYYY'));
				$('#gender').val(info.gender);
				$('input[name=dob]').val(moment(info.dob).format('DD/MM/YYYY'));
				$('input[name=religion]').val(info.religion);
				$('#nationality').val(info.nationality);
				$('input[name=address]').val(info.address);
				$('input[name=city]').val(info.city);
				$('input[name=state]').val(info.state);
				$('#country').val(info.country);
				$('input[name=hobbies]').val(info.hobbies);
				$('input[name=ailment]').val(info.ailment);
				$('input[name=disability]').val(info.disability);
				if(info.passport == '')
				{
					$("#avatar-1").fileinput({
						overwriteInitial: true,
						maxFileSize: 10000,
						showClose: false,
						showCaption: false,
						showBrowse: false,
						browseOnZoneClick: true,
						removeLabel: "",
						showUpload: false,
						allowedFileTypes: ["image"],
						removeIcon: '<i class="glyphicon glyphicon-remove"></i>',
						removeTitle: "Cancel or reset changes",
						elErrorContainer: "#kv-avatar-errors-2",
						msgErrorClass: "alert alert-block alert-danger",
						defaultPreviewContent:'<h6 class="text-muted">Click here to choose file</h6>'
					});
				}
				else
				{
					$("#avatar-1").fileinput({
					overwriteInitial: true,
					maxFileSize: 10000,
					showClose: false,
					showCaption: false,
					showBrowse: false,
					browseOnZoneClick: true,
					removeLabel: "remove",
					showUpload: false,
					allowedFileTypes: ["image"],
					removeIcon: '<i class="glyphicon glyphicon-remove"></i>',
					removeTitle: "Cancel or reset changes",
					elErrorContainer: "#kv-avatar-errors-2",
					msgErrorClass: "alert alert-block alert-danger",
					defaultPreviewContent:
					  '<img src="'+info.passport+'" alt=""><h6 class="text-muted">Click here to change picture</h6>'
				  });
			  }
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
				m_data.append('address', $('input[name=address]').val());
				m_data.append('city', $('input[name=city]').val());
				m_data.append('state', $('input[name=state]').val());
				m_data.append('country', $('#country').val());
				m_data.append('hobbies', $('input[name=hobbies]').val());
				m_data.append('ailment', $('input[name=ailment]').val());
				m_data.append('disability', $('input[name=disability]').val());
				var ref_id = $('head').attr('id')
				var href = 'https://alxproject.virilesoftware.com/api/student/'+ref_id;
                $.ajax({
                    type: 'PUT',
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
						window.location = 'https://alxproject.virilesoftware.com/eportal/'+payload.username+'/studentdetail/'+ref_id
						
						
						
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
	
	
});