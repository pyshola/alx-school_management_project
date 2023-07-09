function handleChange(event)
{
	var checkbox = event.target;
	if(checkbox.checked){
		console.log('add')
		var closestParent = $('#jstrees').find('input')
		var len = closestParent.length
		var roles = []
		 for(var i = 0; i < len; i++){
			var data = {}
			var id = closestParent[i].attributes['id'].value
			$('#'+id).prop("checked", true)
		}
			
	}
	else{
		console.log('remove')
		var closestParent = $('#jstrees').find('input')
		var len = closestParent.length
		var roles = []
		 for(var i = 0; i < len; i++){
			var id = closestParent[i].attributes['id'].value
			$('#'+id).prop("checked", false)
			
		}
	}
}

function handleSelectionChange(event)
{
	var checkbox = event.target;
	if(checkbox.checked){}
	else{
		$('#select_all').prop("checked", false)
	}
}

$(document).ready(function(){
	var rows = []
	var staff = []
	var z = 0
	var total_amount = 0
	var table = null
	var token = auth.getToken();
	var fees = []
	var data_info = []
	var student_cls = 0
	var student_session = 0
	var student_id = []
	var constraints = {
         sch_class: {
             presence: true,
          },
	};
	var table_index = 0
	
	if(auth.isLoggedIn())
	{
		
		var href = ' /api/session';
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
				$('#session').append('<option value="'+datas[i].ref_id+'">'+datas[i].name+'</option>')
			}
			var href = ' /api/academicsession';
			$.ajax({
				type: 'GET',
				data: null,
				url: href,
				dataType:'JSON',
				beforeSend : function(req) {
					req.setRequestHeader('Authorization', 'Bearer '+token);
				}
			}).done(function(data){
				//console.log(data)
				$('#session').val(data.session_id)
				$('#session').trigger('change')
			});
		});
		
		var href = ' /api/classarm';
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
		window.location = ' /eportal/login'
	}
	
	
	
	
	$(document).on('click', '#filter_search', function (event) {
		$('#student_panel').addClass('d-none')
		student_cls = $('#student_class').select2('data')[0].id
		student_session = $('#session').select2('data')[0].id
		var dt = {
			session:$('#session').select2('data')[0].id,
			student_class:$('#student_class').select2('data')[0].id,
		}
				
        var payload = jwt_decode(token);
		var href = ' /api/allocatesubject';
		$.ajax({
			type: 'GET',
			data: dt,
			url: href,
			dataType:'JSON',
			beforeSend : function(req) {
				req.setRequestHeader('Authorization', 'Bearer '+token);
			}
		}).done(function(data){
            var payload = jwt_decode(token);
			
			if(data.status == 'ok'){
				var student = JSON.parse(data.student)
				if(student.length == 0){
					toastr.success('No student found!', {"closeButton": true, timeOut: 9500 })
					//alert('No student found!')
				}
				else{
					var subject = JSON.parse(data.subject)
					$('#student').html('<option value="All">All Student in Class</option>')
					for(var i = 0; i < student.length; i++)
					{
						$('#student').append('<option value="'+student[i].ref_id+'">'+student[i].name+'</option>')
					}
					var th = ''
					for(var i = 0; i < subject.length; i++){
					   
						th += '<label class="ckbox tx-18">\
						<input type="checkbox" id="'+subject[i].ref_id+'" onchange="handleSelectionChange(event)"><span>'+subject[i].name+'</span>\
					  </label>'
					}
					$('#jstrees').html(th)
					$('#student_panel').removeClass('d-none')
				}
			}
			
			else{
				$('#student_panel').addClass('d-none')
			}
			
		})
		
	})
	
	$(document).on('click', '#select_all', function (event) {
		event.preventDefault()
		var checks= $('#select_all').prop("checked")
		if(checks == true){
			console.log('add')
		}
		else{
			console.log('remove')
		}
		console.log(checks)
		var closestParent = $('#jstrees').find('input')
		var len = closestParent.length
		var roles = []
		 for(var i = 0; i < len; i++){
			var data = {}
			var id = closestParent[i].attributes['id'].value
			$('#'+id).prop("checked", true)
			roles.push(id)
		}
		console.log(roles)
		return false
		
	})
	$(document).on('click', '#submit_btn', function (event) {
		event.stopImmediatePropagation()
		event.stopPropagation()
		event.preventDefault()
		var closestParent = $('#jstrees').find('input')
		var len = closestParent.length
		var roles = []
		 for(var i = 0; i < len; i++){
			var data = {}
			var id = closestParent[i].attributes['id'].value
			var check = $('#'+id).prop("checked")
			if(check == true)
			{
				if(id == 'select_all'){}
				else{
				roles.push(id)
				}
			}
		}
		var dt = {
			student:$('#student').select2('data')[0].id,
			subject:JSON.stringify(roles),
			student_cls:student_cls,
			session:student_session
		}
		$('#submit_btn').addClass('d-none');
		$('#processing-btn').removeClass('d-none');
		var href = ' /api/allocatesubject';
		$.ajax({
			type: 'POST',
			data: dt,
			url: href,
			dataType:'JSON',
			beforeSend : function(req) {
				req.setRequestHeader('Authorization', 'Bearer '+token);
			}
		}).done(function(data){
			if(data.status == 'ok')
			{
				toastr.success(data.msg, { timeOut: 9500 })
				var payload = jwt_decode(token);
				window.location.reload()
			}
			else{
				toastr.warning(data.msg, { timeOut: 9500 })
				$('#submit_btn').removeClass('d-none');
				$('#processing-btn').addClass('d-none');
			}
		})
	})
	
	$(document).on('click', '#cancel_btn', function (event) {
		$('#student_panel').addClass('d-none')
		
	})
	
});