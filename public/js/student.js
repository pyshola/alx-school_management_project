$(document).ready(function(){
	var rows = []
	var staff = []
	var z = 0
	var total_amount = 0
	var table = null
	var token = auth.getToken();
	var constraints = {
         sch_class: {
             presence: true,
          },
	};
	var table_index = 0
	
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
		
        var payload = jwt_decode(token);
		
	}
	else
	{
		window.location = 'https://alxproject.virilesoftware.com/eportal/login'
	}
	
	$(document).on('click', '#filter_search', function (event) {
		var dt = {
			academic_session:$('#academic_session').select2('data')[0].id,
			student_type:$('#session_term').select2('data')[0].id,
			student_class:$('#student_class').select2('data')[0].id,
		}
				
        var payload = jwt_decode(token);
		var href = 'https://alxproject.virilesoftware.com/api/student';
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
			if(table == null){}
			else{
				table.destroy();
			}
			var htmls = ''
			for(var i = 0; i < data.length; i++)
			{
				var s = 1 + i
				htmls  +='<tr>\
					<td>'+s+'</td>\
					<td><a href="https://alxproject.virilesoftware.com/eportal/'+payload.username+'/studentdetail/'+data[i].student_id+'" class="">'+ data[i].name+'</a></td>\
					<td>'+ data[i].admission_no+'</td>\
					<td>'+ data[i].student_class+'</td>\
					<td>'+ data[i].gender+'</td>\
					<td>'+ data[i].admission_date+'</td>\
					<td>'+ data[i].login_id+'</td>\
					<td>'+ data[i].password+'</td>\
					</tr>'
					
			}
			
			$('#tablebody').html(htmls)
			table = $('#tabledata').DataTable({
                retrieve:true,
                sorting:false,
				ordering:false,
                "aLengthMenu": [
                    [10, 30, 50, -1],
                    [10, 30, 50, "All"]
                ],
                "iDisplayLength": 50,
                dom: 'Bfrtip',
				buttons: [
					'csv', 'excel','pdf', 'print'
				],
                "language": {
                    search: ""
                }
                });
                $('#tabledata').each(function() {
                var datatable = $(this);
                // SEARCH - Add the placeholder for Search and Turn this into in-line form control
                var search_input = datatable.closest('.dataTables_wrapper').find('div[id$=_filter] input');
                search_input.attr('placeholder', 'Search');
                search_input.removeClass('form-control-sm');
                // LENGTH - Inline-Form control
                var length_sel = datatable.closest('.dataTables_wrapper').find('div[id$=_length] select');
                length_sel.removeClass('form-control-sm');
                
            });
            
		})
		
	})
	
	$(document).on('click', '#generate_login', function (event) {
		var dt = {
			academic_session:$('#academic_session').select2('data')[0].id,
			student_type:$('#session_term').select2('data')[0].id,
			student_class:$('#student_class').select2('data')[0].id,
		}
				
        var payload = jwt_decode(token);
		var href = 'https://alxproject.virilesoftware.com/api/generatelogin';
		$.ajax({
			type: 'GET',
			data: dt,
			url: href,
			dataType:'JSON',
			beforeSend : function(req) {
				req.setRequestHeader('Authorization', 'Bearer '+token);
			}
		}).done(function(data){
			if(data.status == 'ok')
			{
				alert('Login id created successful')
			}
		})

	})
});