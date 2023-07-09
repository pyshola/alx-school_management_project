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
	var table = null
	var home_table = null
	var query = {}
	
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
				$('#academic_session_home').append('<option value="'+datas[i].ref_id+'">'+datas[i].name+'</option>')
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
				$('#academic_session').val(data.session_id)
				$('#academic_session').trigger('change')
				$('#session_term').val(data.term)
				$('#session_term').trigger('change')
				
				$('#academic_session_home').val(data.session_id)
				$('#academic_session_home').trigger('change')
				$('#session_term_home').val(data.term)
				$('#session_term_home').trigger('change')
				
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
	
	$(document).on('change', '#student_class', function (event) {
		var ref = $('#student_class').select2('data')[0].text
		$('#student_subject').html('')
		$('#load_box').addClass('d-none')
		$.ajax({
			type: 'GET',
			data: {student_class:ref},
			url: 'https://alxproject.virilesoftware.com/api/subjectbyclass',
			dataType:'JSON',
			beforeSend : function(req) {
				req.setRequestHeader('Authorization', 'Bearer '+token);
			}
		}).done(function(datas){
            for(var i = 0; i < datas.length; i++)
			{
				$('#student_subject').append('<option value="'+datas[i].ref_id+'">'+datas[i].name+'</option>')
			}
			$('#subject_box').removeClass('d-none')
			$('#load_box').removeClass('d-none')
            
		})
	});
	
	
	$(document).on('click', '#filter_search', function (event) {
		var dt = {
			academic_session:$('#academic_session').select2('data')[0].id,
			session_term:$('#session_term').select2('data')[0].id,
			student_class:$('#student_class').select2('data')[0].id,
			student_subject:$('#student_subject').select2('data')[0].id,
		}
		query = dt
        var payload = jwt_decode(token);
		var href = 'https://alxproject.virilesoftware.com/api/scorebysubject';
		$.ajax({
			type: 'GET',
			data: dt,
			url: href,
			dataType:'JSON',
			beforeSend : function(req) {
				req.setRequestHeader('Authorization', 'Bearer '+token);
			}
		}).done(function(datas){
            //console.log(datas)
			if(datas.status == 200){
				var column = [{title:"Admission No", field:"admission_no"},{title:"Name", field:"name"}]
				var mark = datas.mark
				for(var i = 0; i < mark.length; i++)
				{
					column.push({title:mark[i].abbr, field:mark[i].abbr, align:"center",editor:"input", validator:["numeric", "min:0", "max:"+mark[i].point]})
				}
				//console.log(column)
				var fors  = []
				var data = datas.data
				for(var i = 0; i < data.length; i++){
					var sn = i + 1
					var files = {}
					files.id = data[i].ref_id
					files.admission_no = data[i].admission_no
					files.name = data[i].student_name
					var sc = JSON.parse(data[i].score)
					var array_sc = []
					var info = {}
					for(var s = 0; s < sc.length; s++){
						
						info[sc[s].abbr] = sc[s].value
						//var info = {sc[s].abbr:sc[s].value}
						//array_sc.push(info)
					}
					var fl = {...files, ...info}
					fors.push(fl)
				}
				console.log(fors)
				table = new Tabulator("#example-table", {
					height:"100%",
					//height:320, // set height of table (in CSS or here), this enables the Virtual DOM and improves render speed dramatically (can be any valid css height value)
					data:fors, //assign data to table
					layout:"fitColumns", //fit columns to width of table (optional)
					columns:column,
					rowClick:function(e, row){ //trigger an alert message when the row is clicked
						//alert("Row " + row.getData().id + " Clicked!!!!");
					},
					cellEditing:function(cell){
						//console.log(cell)
						
					},
					cellEdited:function(cell){},
					validationFailed:function(cell, value, validators){
						
					//cell - cell component for the edited cell
					//value - the value that failed validation
					//validatiors - an array of validator objects that failed
					},
			   });
			   $('#processtransaction').removeClass('d-none')
				
			}
            
		})
		
	})
	
	
	
	$(document).on('click', '#processtransaction', function (event) {
		event.stopImmediatePropagation()
		event.stopPropagation()
		var data = table.getData()
		//console.log(data)
		//console.log(query)
		$('#processtransaction').addClass('d-none');
		$('#processing-btn').removeClass('d-none');
		var href = 'https://alxproject.virilesoftware.com/api/scorebysubject';
		$.ajax({
			type: 'POST',
			data: {info:JSON.stringify(table.getData()), ...query},
			url: href,
			dataType:'JSON',
			beforeSend : function(req) {
				req.setRequestHeader('Authorization', 'Bearer '+token);
			}
		}).done(function(data){
			if(data.status == 200){
				alert(data.message)
				window.location.reload()
			}
			else
			{
				alert(data.message)
				$('#processtransaction').removeClass('d-none');
				$('#processing-btn').addClass('d-none');
			}
							
		});
		
		
	})
	
});