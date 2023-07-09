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
		

	}
	else
	{
		window.location = 'https://alxproject.virilesoftware.com/eportal/login'
	}
	$(document).on('click', '#filter_search_home', function (event) {
		var dt = {
			session:$('#academic_session_home').select2('data')[0].id,
			term:$('#session_term_home').select2('data')[0].id,
		}
		var href = 'https://alxproject.virilesoftware.com/api/reportcardclass';
		$.ajax({
			type: 'GET',
			data: dt,
			url: href,
			dataType:'JSON',
			beforeSend : function(req) {
				req.setRequestHeader('Authorization', 'Bearer '+token);
			}
		}).done(function(data){
			var htmls = ''
			var payload = jwt_decode(token);
			for(let i = 0; i < data.length; i++){
				if(data[i].publish == true){
					htmls += '<tr><td>'+ data[i].name+ '</td>\
				<td>'+data[i].academic_session+'</td><td>'+data[i].term+'</td>\
				<td><a href="https://alxproject.virilesoftware.com/eportal/'+payload.username+'/student_result_access?class='+encodeURIComponent(data[i].ref_id)+'&session='+encodeURIComponent(data[i].academic_session)+'&term='+encodeURIComponent(data[i].term)+'" \
				class="btn btn-warning btn-sm" >Update</a></td>\
				<td><div class="toggle-btn active">\
				<input type="checkbox" checked class="publish-value" id="publish'+data[i].ref_id+'" data-id="'+data[i].ref_id+'" data-term="'+dt.term+'" data-session="'+dt.session+'"/>\
				<span class="round-btn"></span>\
			  </div></td>\
				<td><a href="#" id="download_result'+data[i].ref_id+'" class="btn btn-success btn-sm download_result" data-id="'+data[i].ref_id+'" data-term="'+dt.term+'" data-session="'+dt.session+'">Download Result</a>\
                <div class="d-none" id="loading'+data[i].ref_id+'"><div class="d-flex bg-gray-200 ht-40 pos-relative align-items-center " >\
                <div class="sk-wave">\
                  <div class="sk-rect sk-rect1 bg-gray-800"></div>\
                  <div class="sk-rect sk-rect2 bg-gray-800"></div>\
                  <div class="sk-rect sk-rect3 bg-gray-800"></div>\
                  <div class="sk-rect sk-rect4 bg-gray-800"></div>\
                  <div class="sk-rect sk-rect5 bg-gray-800"></div>\
                </div>\
              </div></div></td></tr>'
			  
				}
				else{
					htmls += '<tr><td>'+ data[i].name+ '</td>\
				<td>'+data[i].academic_session+'</td><td>'+data[i].term+'</td>\
				<td><a href="https://alxproject.virilesoftware.com/eportal/'+payload.username+'/student_result_access?class='+encodeURIComponent(data[i].ref_id)+'&session='+encodeURIComponent(data[i].academic_session)+'&term='+encodeURIComponent(data[i].term)+'" \
				class="btn btn-warning btn-sm" >Update</a></td>\
				<td><div class="toggle-btn">\
				<input type="checkbox" class="publish-value" data-id="'+data[i].ref_id+'" data-term="'+dt.term+'" data-session="'+dt.session+'"/>\
				<span class="round-btn"></span>\
			  </div></td>\
				<td><a href="#" id="download_result'+data[i].ref_id+'" class="btn btn-success btn-sm download_result" data-id="'+data[i].ref_id+'" data-term="'+dt.term+'" data-session="'+dt.session+'">Download Result</a>\
                <div class="d-none" id="loading'+data[i].ref_id+'"><div class="d-flex bg-gray-200 ht-40 pos-relative align-items-center " >\
                <div class="sk-wave">\
                  <div class="sk-rect sk-rect1 bg-gray-800"></div>\
                  <div class="sk-rect sk-rect2 bg-gray-800"></div>\
                  <div class="sk-rect sk-rect3 bg-gray-800"></div>\
                  <div class="sk-rect sk-rect4 bg-gray-800"></div>\
                  <div class="sk-rect sk-rect5 bg-gray-800"></div>\
                </div>\
              </div></div></td></tr>'
					
				}
				
				

			}
			
			$('#tablebody').html(htmls)

		})
	})

	$(document).on('click', '.publish-value', function (event) {
		let ref_ids = $(this).attr('data-id')
        let term = $(this).attr('data-term')
        let session = $(this).attr('data-session')
		var mainParent = $(this).parent('.toggle-btn');
		if($(mainParent).find('input.publish-value').is(':checked')) {
			$(mainParent).addClass('active');
			var href = 'https://alxproject.virilesoftware.com/api/publishresult';
			$.ajax({
				type: 'POST',
				data: {class_arm_id:ref_ids, session:session,term:term, publish:'publish'},
				url: href,
				dataType:'JSON',
				beforeSend : function(req) {
					req.setRequestHeader('Authorization', 'Bearer '+token);
				}
			}).done(function(datas){
				if(datas.status == 'ok'){
					$(mainParent).addClass('active');
				}
				else{
					$(mainParent).removeClass('active');
				}
				

			})
		  $(mainParent).addClass('active');
		} else {
		  $(mainParent).removeClass('active');
		  var href = 'https://alxproject.virilesoftware.com/api/publishresult';
			$.ajax({
				type: 'POST',
				data: {class_arm_id:ref_ids, session:session,term:term, publish:'uppublish'},
				url: href,
				dataType:'JSON',
				beforeSend : function(req) {
					req.setRequestHeader('Authorization', 'Bearer '+token);
				}
			}).done(function(datas){
				if(datas.status == 'ok'){
					$(mainParent).removeClass('active');
				}
				else{
					$(mainParent).addClass('active');
				}
				

			})
		}
	  
	  })
	
});