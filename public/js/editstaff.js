$(document).ready(function(){
	
	if(auth.isLoggedIn())
	{
		var token = auth.getToken();
		var href = 'https://192.168.1.192:3000/api/branches';
		$.ajax({
			type: 'GET',
			data: null,
			url: href,
			dataType:'JSON',
			beforeSend : function(req) {
				req.setRequestHeader('Authorization', 'Bearer '+token);
			}
		}).done(function(datas){
			var htmls = []
			var ht = ''
			for(i = 0; i < datas.length; i++)
			{
				var sn = {id:datas[i].ref_id, text:datas[i].name}
				htmls.push(sn)
				$('#branches').append('<option value="'+datas[i].ref_id+'">'+datas[i].name+'</option>')
				$('#payroll').append('<option value="'+datas[i].ref_id+'">'+datas[i].name+'</option>')
				
			}			
			$("#branch").select2();
        });
		
		var ref = $('body').attr('id')
		var href = 'https://192.168.1.192:3000/api/staff/'+ref;
		$.ajax({
			type: 'GET',
			data: null,
			url: href,
			dataType:'JSON',
			beforeSend : function(req) {
				req.setRequestHeader('Authorization', 'Bearer '+token);
			}
		}).done(function(data){
			var htmls = ''
			var payload = jwt_decode(token);
			//console.log(data)
			$('input[name=name]').val(data.name);
			$('input[name=phone]').val(data.phone);
			$('input[name=email]').val(data.email);
			$('input[name=address]').val(data.address);
			$('#gender').val(data.gender)
			$('#position').val(data.position).trigger('change');
			$('#payroll').val(data.payroll).trigger('change');
			$('#branches').val(data.branch);
			$('#branches').trigger('change');
			if(data.image == '')
			{
				$("#avatar-1").fileinput({
					overwriteInitial: true,
					maxFileSize: 2500,
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
				maxFileSize: 2500,
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
				defaultPreviewContent:
				  '<img src="'+data.image+'" alt="Your Avatar"><h6 class="text-muted">Click here to change logo</h6>'
			  });
		  }
		});
	}
	else
	{
		window.location = 'https://192.168.1.192:3000/login'
	}
	
	
	
	
	$(document).on('click', '#savesupplier', function (event) {
		event.stopImmediatePropagation()
		event.stopPropagation()
        $('#supplierform').validate({
			
			submitHandler: function() {
				event.preventDefault()
				var token = auth.getToken();
				var name = $('input[name=name]').val();
				var branch = $('#branches').select2('data')
				var b = []
				for(var i = 0; i < branch.length; i++){
					b.push(parseInt(branch[i].id))
				}
				var ref_id = $('body').attr('id')
				var m_data = new FormData(); 
				m_data.append("image", $("input[name=avatar-1]")[0].files[0]);
				m_data.append('name', $('input[name=name]').val());
				m_data.append('phone', $('input[name=phone]').val());
				m_data.append('address', $('input[name=address]').val());
				m_data.append('email', $('input[name=email]').val());
				m_data.append('branch', JSON.stringify(b));
				m_data.append('gender', $('#gender').val());
				m_data.append('position', $('#position').select2('data')[0].id);
				m_data.append('payroll', $('#payroll').select2('data')[0].id);
				
				var passd = {'name':name}
				var href = 'https://192.168.1.192:3000/api/staff/'+ref_id;
				$.ajax({
					type: 'PUT',
					data: m_data,
					contentType: false,
					processData: false,
					url: href,
					dataType:'JSON',
					beforeSend : function(req) {
						req.setRequestHeader('Authorization', 'Bearer '+token);
					}
				}).done(function(data){
					if(data.status == 'ok')
					{
						var payload = jwt_decode(token);
						window.location = 'https://192.168.1.192:3000/'+payload.username+'/staff'		
					}
					else
					{
						alert(data.message)
					}
					
				});
			}
		})
		
	});
	
	

});