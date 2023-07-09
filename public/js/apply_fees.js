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
	
	var student_id = []
	var constraints = {
         sch_class: {
             presence: true,
          },
	};
	var table_index = 0
	
	if(auth.isLoggedIn())
	{
		
		var href = 'https://alxproject.virilesoftware.com/api/schoolbill';
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
			data_info = datas
			for(var i = 0; i < datas.length; i++)
			{
				$('#student_class').append('<option value="'+datas[i].class_id+'" data-class_type="'+datas[i].class_type+'">'+datas[i].name+'</option>')
			}
			if(datas.length > 0){
				fees = datas[0].fees
				for(var s = 0; s < fees.length; s++)
				{
					$('#fees_types').append('<option value="'+fees[s].ref_id+'">'+fees[s].fees+'</option>')
				}
				$('#amount').val(new Number(fees[0].amount).toLocaleString('en'))
			}
		});
		
		
		
	}
	else
	{
		window.location = 'https://alxproject.virilesoftware.com/eportal/login'
	}
	
	$(document).on('change', '#student_class', function (event) {
		var ref_id = $('#student_class').val()
		$('#fees_types').html('')
		$('#amount').val('')
		for(var s = 0; s < data_info.length; s++)
		{
			if(ref_id == data_info[s].class_id){
				fees = data_info[s].fees
				for(var i = 0; i < fees.length; i++){
					$('#fees_types').append('<option value="'+fees[i].ref_id+'">'+fees[i].fees+'</option>')
				}
				$('#amount').val(new Number(fees[0].amount).toLocaleString('en'))
				break
			}
		}
	})
	$(document).on('change', '#fees_types', function (event) {
		var ref_id = $('#fees_types').select2('data')[0].id
		$('#amount').val('')
		for(var s = 0; s < fees.length; s++)
		{
			if(ref_id == fees[s].ref_id){
				$('#amount').val(new Number(fees[s].amount).toLocaleString('en'))
				break
			}
		}
	})
	
	
	
	
	
	$(document).on('click', '#filter_search', function (event) {
		var c_t = $('#student_class').select2('data')[0].element.attributes['data-class_type'].nodeValue
		console.log(c_t)
		
		var dt = {
			fees_type:$('#fees_types').select2('data')[0].id,
			student_class:$('#student_class').select2('data')[0].id,
			amount:$('#amount').val(),
			class_type:c_t
		}
				
        var payload = jwt_decode(token);
		var href = 'https://alxproject.virilesoftware.com/api/studentschoolbill';
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
			//console.log(data)
			
			var htmls = '<h5 class="text-success">'+$('#fees_types').select2('data')[0].text+'</h5><h5 class="text-waring">'+$('#student_class').select2('data')[0].text+'</h5><h5>'+$('#amount').val()+'</h5>'
			$('#fees_info').html(htmls)
			if(data.length == 0){
				alert('No student found')
			}
			else{
				var th = '<label class="ckbox tx-18">\
					<input type="checkbox" id="select_all" onchange="handleChange(event)"><span>Select All</span>\
				  </label>'
				
				for(var i = 0; i < data.length; i++){
				   
					th += '<label class="ckbox tx-18">\
					<input type="checkbox" id="'+data[i].student_id+'" onchange="handleSelectionChange(event)"><span>'+data[i].name+'</span>\
				  </label>'
				}
				$('#jstrees').html(th)
				
				
				$('#student_panel').removeClass('d-none')
				$('#fees_panel').addClass('d-none')
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
		var amount = $('#amount').val()
		amount = new Number(amount.replace(/,/g, ''));
		var dt = {
			fees_type:$('#fees_types').select2('data')[0].id,
			student_class:$('#student_class').select2('data')[0].id,
			amount:amount,
			student:JSON.stringify(roles)
		}
		$('#submit_btn').addClass('d-none');
		$('#processing-btn').removeClass('d-none');
		var href = 'https://alxproject.virilesoftware.com/api/studentschoolbill';
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
				toastr.success(data.msg,{"closeButton": true, timeOut: 9500 })
				var payload = jwt_decode(token);
				window.location.reload()
				//window.location = ' /eportal/'+payload.username+'/fees_management'
			}
			else{
				toastr.warning(data.msg,{"closeButton": true, timeOut: 9500 })
				$('#submit_btn').removeClass('d-none');
				$('#processing-btn').addClass('d-none');
			}
		})
	})
	
	$(document).on('click', '#cancel_btn', function (event) {
		$('#student_panel').addClass('d-none')
		$('#fees_panel').removeClass('d-none')
	})
	
});