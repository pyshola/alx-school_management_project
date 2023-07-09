$(document).ready(function(){
	var rows = []
	var staff = []
	var z = 0
	var total_amount = 0
	var token = auth.getToken();
	var constraints = {
         sch_class: {
             presence: true,
          },
	};
	var table_index = 0
	
	if(auth.isLoggedIn())
	{
		var href = 'https://alxproject.virilesoftware.com/api/staff';
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
			var htmls = ''
			var payload = jwt_decode(token);
			if(datas.status == 'error'){
				alert(datas.message)
			}
			else{
				if(datas.add == true){
					$('#add-supplier').removeClass('d-none')
				}
				else{
					$('#add-supplier').addClass('d-none')
				}
				var data = datas.data
				for(i = 0; i < data.length; i++)
				{
					if(datas.delete == false){
						var del = ''
					}
					else{
						if(data[i].status == 'Active' || data[i].status == '' || data[i].status == null)
						{
							
							var del = '<a class="btn btn-warning btn-sm disableaccount" href="javascript:;"\
							id="'+data[i].ref_id+'" data-name="'+data[i].name+'">Disable Account</a>\
							<a class="btn btn-danger btn-sm deleteaccount" href="javascript:;"\
						 id="'+data[i].ref_id+'"  data-name="'+data[i].name+'">Delete Account</a>'
							
						}
						else
						{
							var del = '<a class="btn btn-success btn-sm enableaccount" href="javascript:;"\
							 id="'+data[i].ref_id+'" data-name="'+data[i].name+'">Enable Account</a>\
							<a class="btn btn-danger btn-sm deleteaccount" href="javascript:;"\
						 id="'+data[i].ref_id+'"  data-name="'+data[i].name+'">Delete Account</a>'
						}
					}
					if(datas.role == false){
						var role = ''
					}
					else{
						var role = '<a class="btn btn-info btn-sm editfish" href="https://alxproject.virilesoftware.com/eportal/'+payload.username+'/staffrole/'+data[i].ref_id+'"\
							data-name="'+data[i].name+'">Manage Roles and Permissions</a>'
					}
					if(datas.password == false){
						var pass = ''
					}
					else{
						var pass = '<a class="btn btn-primary btn-sm changepassword" href="javascript:;"\
							 id="'+data[i].ref_id+'"  data-name="'+data[i].name+'">Change Password</a>'
					}
					if(datas.edit == false){
						var dis = ''
					}
					else{
						var dis = '<a class="btn btn-primary btn-sm editfish" href="https://alxproject.virilesoftware.com/eportal/'+payload.username+'/editstaff/'+data[i].ref_id+'" id="'+data[i].ref_id+'"\
							data-name="'+data[i].name+'" data-phone="'+data[i].phone+'" >Edit</a>'
					}
					if(data[i].position == 'Owner'){
						htmls +='<tr>\
							<td>'+data[i].firstname+' '+data[i].lastname+'</td>\
							<td>'+data[i].username+'</td>\
							<td>'+data[i].email+'</td>\
							<td>'+data[i].phone+'</td>\
							<td></td>\
							<td></td>\
							<td><a class="btn btn-primary btn-sm changepassword" href="javascript:;"\
							 id="'+data[i].ref_id+'"  data-name="'+data[i].name+'">Change Password</a></td>\
						</tr>'

					}
					else{
						htmls +='<tr>\
							<td>'+data[i].firstname+' '+data[i].lastname+'</td>\
							<td>'+data[i].username+'</td>\
							<td>'+data[i].email+'</td>\
							<td>'+data[i].phone+'</td>\
							<td> '+data[i].status+' </td>\
							<td>'+role+'</td>\
							<td>\
						'+dis+'\
						'+del+'\
						'+pass+'</td>\
						</tr>'

					}
					
				}
				$('#pondbody').html(htmls)
			}
			
		});
		
	}
	else
	{
		window.location = 'https://alxproject.virilesoftware.com/eportal/login'
	}
	
	
	$(document).on('click', '#add_session', function (event) {
		$('#sessionformpanel').removeClass('d-none')
	})
	$(document).on('click', '#cancel_session_form', function (event) {
		$('#sessionformpanel').addClass('d-none')
	})
	
    
    
	
	$(document).on('click', '.editschoolclass', function (event) {
		event.preventDefault()
		var ref_id = this.id
		table_index = this.parentNode.parentNode.rowIndex;
		$('#edit_sch_class').val($(this).attr('data-name'))
		$('#updateclassarm_modal').attr('data-ref', ref_id) 
		$('#updateclassarm_modal').modal('show'); 
        
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
                
				var token = auth.getToken();
				var m_data = new FormData(); 
				m_data.append('firstname', $('input[name=firstname]').val());
				m_data.append('lastname', $('input[name=lastname]').val());
				m_data.append('phone', $('input[name=phone]').val());
				m_data.append('address', $('input[name=address]').val());
				m_data.append('email', $('input[name=email]').val());
				m_data.append('gender', $('#gender').val());
				m_data.append('password', $('input[name=password]').val());
                
                var href = 'https://alxproject.virilesoftware.com/api/staff';
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
                    if (data.status == 'ok') {
						window.location.reload()
						
                    } else {
                        toastr.warning(data.msg,{"closeButton": true, timeOut: 9500 })
                        $('#load-submit').removeClass('d-none');
                        $('#processing-btn').addClass('d-none');
                    }

                });
            }
        })

    });
	
	$(document).on('click', '.changepassword', function (event) {
		event.preventDefault()
		var ref_id = this.id
		$('#myModalPassword').attr('data-ref', ref_id) 
		$('#myModalPassword').modal('show'); 
		
		//alert(ref_id)
	})
	
	$(document).on('click', '.disableaccount', function (event) {
		event.preventDefault()
		var ref_id = this.id
		var name = $(this).attr('data-name')
		var res = confirm('You are to disable "'+name+'" account information, Do you want to continue?')
		if(res == false)
		{
			return false;
		}
		else{
		var token = auth.getToken();
		$.ajax({
			type: 'PUT',
			data: {status:'Block'},
			url: 'https://alxproject.virilesoftware.com/api/staffhand/'+ref_id,
			dataType:'JSON',
			beforeSend : function(req) {
				req.setRequestHeader('Authorization', 'Bearer '+token);
			}
		}).done(function(data){
			if(data.status == 'ok')
			{
				window.location.reload()
			}
			else
			{
				alert(data.message)
			}
			
		});
		}
	})
	$(document).on('click', '.enableaccount', function (event) {
		event.preventDefault()
		var ref_id = this.id
		var token = auth.getToken();
		$.ajax({
			type: 'PUT',
			data: {status:'Active'},
			url: 'https://alxproject.virilesoftware.com/api/staffhand/'+ref_id,
			dataType:'JSON',
			beforeSend : function(req) {
				req.setRequestHeader('Authorization', 'Bearer '+token);
			}
		}).done(function(data){
			if(data.status == 'ok')
			{
				window.location.reload()
			}
			else
			{
				alert(data.message)
			}
			
		});
	})
	
	$(document).on('click', '.deleteaccount', function (event) {
		event.stopPropagation()
		event.preventDefault()
		var ref_id = this.id
		var token = auth.getToken();
		var name = $(this).attr('data-name')
		var res = confirm('You are to delete "'+name+'" account information, Do you want to continue?')
		if(res == false)
		{
			return false;
		}
		else{
		$.ajax({
			type: 'PUT',
			data: {status:'Deleted'},
			url: 'https://alxproject.virilesoftware.com/api/staffhand/'+ref_id,
			dataType:'JSON',
			beforeSend : function(req) {
				req.setRequestHeader('Authorization', 'Bearer '+token);
			}
		}).done(function(data){
			if(data.status == 'ok')
			{
				window.location.reload()
			}
			else
			{
				alert(data.message)
			}
			
		});
		}
	})
	
	$(document).on('click', '#savepassword', function (event) {
		event.stopImmediatePropagation()
		event.stopPropagation()
		$('#updatestaffpassword').validate({
			
			submitHandler: function() {
				event.preventDefault()
				$('#errormsg').addClass('hide')
				var password = $('input[name=edit_password]').val();
				var passd = {'password':password}
				var ref_id = $('#myModalPassword').attr('data-ref') 
				 var href = 'https://alxproject.virilesoftware.com/api/staffhandpassword/'+ref_id;
				$.ajax({
					type: 'PUT',
					data: passd,
					url: href,
					dataType:'JSON',
					beforeSend : function(req) {
					req.setRequestHeader('Authorization', 'Bearer '+token);
					}
				}).done(function(data){
					if(data.status == 'ok')
					{
						alert(data.message)
						window.location.reload()
					}
					else
					{
						alert(data.message)
					}
									   
				});
				
				
				
			}
			
			});
		
		
	});	
	
	
});