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

				
        var payload = jwt_decode(token);
		var href = 'https://alxproject.virilesoftware.com/api/schoolsubject';
		$.ajax({
			type: 'GET',
			data: dt,
			url: href,
			dataType:'JSON',
			beforeSend : function(req) {
				req.setRequestHeader('Authorization', 'Bearer '+token);
			}
		}).done(function(data){
			console.log(data)
            var payload = jwt_decode(token);
			var htmls = ''
			for(var i = 0; i < data.length; i++){
				htmls += '<tr>\
                  <th scope="row"><a href="https://alxproject.virilesoftware.com/eportal/'+payload.username+'/subjectdetail/'+data[i].ref_id+'?session='+encodeURIComponent(data[i].academic_session)+'&cls='+encodeURIComponent(data[i].student_class)+'&subject='+encodeURIComponent(data[i].name)+'" class="">'+data[i].name+'</a></th>\
                  <td>'+data[i].text_book+'</td>\
                  <td>'+data[i].teacher+'</td>\
                  <td>'+data[i].student+'</td>\
				</tr>'
			}
			
			if(table == null){}
			else{
				table.destroy();
			}
			$('#hometable').html(htmls)
			table = $('#hometabledata').DataTable({
                retrieve:true,
                
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
	
	
	
});