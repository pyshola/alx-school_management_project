$(document).ready(function(){
	
	var token = auth.getToken();
	var student_cls = []
	var current_session = 0
	
	if(auth.isLoggedIn())
	{
		
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
				$('#session').append('<option value="'+datas[i].ref_id+'">'+datas[i].name+'</option>')
			}
			var href = 'https://alxproject.virilesoftware.com/api/academicsession';
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
                current_session = data.session_id
				$('#session').val(data.session_id)
				$('#session').trigger('change')
			});
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
            student_cls = datas
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
	
	
	
	
	$(document).on('click', '#filter_search', function (event) {
		var dt = {
			session:$('#session').select2('data')[0].id,
			student_class:$('#student_class').select2('data')[0].id,
		}
        current_session = $('#session').select2('data')[0].id
		$('#promote_student').addClass('d-none')	
        var payload = jwt_decode(token);
		var href = 'https://alxproject.virilesoftware.com/api/studenttopromote';
		$.ajax({
			type: 'GET',
			data: dt,
			url: href,
			dataType:'JSON',
			beforeSend : function(req) {
				req.setRequestHeader('Authorization', 'Bearer '+token);
			}
		}).done(function(data){
			//console.log(data)
            const student = data.student
            var htmls = ''
            var datas = student_cls
            var cls = '<option value="0">Skip</option>'
            for(var s = 0; s < datas.length; s++)
			{
				 cls += '<option value="'+datas[s].ref_id+'">'+datas[s].name+'</option>'
			}
            if(student.length > 0){

                for(let i = 0; i < student.length; i++){
                    htmls += '<tr data-ref = "'+student[i].id+'">\
                      <td><a href="https://alxproject.virilesoftware.com/eportal/'+payload.username+'/studentdetail/'+student[i].id+'" class="">'+student[i].name+'</td>\
                      <td>'+data.current_class+'</td>\
                      <td><select class="form-control select2-show-search promoted_class" data-placeholder="Class" id="option'+student[i].id+'">\
                      '+cls+'</select></td>\
                    </tr>'
                   
                }
                $('#hometable').html(htmls)
                $('.select2-show-search').select2({
                    minimumResultsForSearch: ''
                });
                for(let i = 0; i < student.length; i++){
                    $('#option'+student[i].id).val(data.promote_class)
                    $('#option'+student[i].id).trigger('change')
                }
                $('#promote_student').removeClass('d-none')	
                //$('#filter_search').addClass('d-none')
            }
            else{
                alert('No student found')
                $('#promote_student').addClass('d-none')	
                $('#filter_search').removeClass('d-none')
            }
		})
		
	})
	
	$(document).on('click', '#promote_student', function (event) {
        $('#filter_search').addClass('d-none')
        var file = {session:current_session}
        var closestParent = $('#hometable').find('tr')
		var len = closestParent.length
        var student_data = []
        for(var i = 0; i < len; i++){
			var data = {}
			var id = closestParent[i].attributes['data-ref'].value
            var c_class = $('#option'+id).select2('data')[0].id
            student_data.push({student_id:id, promoted_class:c_class})
		}
        file.detail = JSON.stringify(student_data)
        console.log(file)
        var res = confirm('You want promote student, Please note that this action cannot be reverse or recover, Do you want to continue?')
		if(res)
		{
			var payload = jwt_decode(token);
            var href = 'https://alxproject.virilesoftware.com/api/promote';
            $.ajax({
                type: 'POST',
                data: file,
                url: href,
                dataType:'JSON',
                beforeSend : function(req) {
                    req.setRequestHeader('Authorization', 'Bearer '+token);
                }
            }).done(function(data){
                if(data.status == 'ok'){
                    alert(data.message)
                    window.location.reload()
                }
                else{
                    alert(data.message)
                    $('#promote_student').addClass('d-none')	
                    $('#filter_search').removeClass('d-none')
                }
            })
		}
		return false
    })
	
});