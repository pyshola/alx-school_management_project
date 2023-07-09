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
		
		var href = 'https://alxproject.virilesoftware.com/api/feesanalysis';
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
			if(datas.status == 'ok'){
				var home = '<div class="card card-dash-one mg-t-20">\
          <div class="row no-gutters">\
            <div class="col-lg-3 col-sm-6">\
              <div class="dash-content">\
                <label class="tx-primary">Total Amount</label>\
                <h2>'+new Number(datas.amount).toLocaleString('en')+'</h2>\
              </div><!-- dash-content -->\
            </div><!-- col-3 -->\
            <div class="col-lg-3 col-sm-6">\
              <div class="dash-content">\
                <label class="tx-success">Total Payment</label>\
                <h2>'+new Number(datas.payment).toLocaleString('en')+'</h2>\
              </div><!-- dash-content -->\
            </div><!-- col-3 -->\
            <div class="col-lg-3 col-sm-6">\
              <div class="dash-content">\
                <label class="tx-danger">Total Balance</label>\
                <h2>'+new Number(datas.balance).toLocaleString('en')+'</h2>\
              </div><!-- dash-content -->\
            </div><!-- col-3 -->\
            <div class="col-lg-3 col-sm-6">\
              <div class="dash-content">\
                <label class="tx-purple">% Recover</label>\
                <h2>'+datas.percentage+'</h2>\
              </div><!-- dash-content -->\
            </div><!-- col-3 -->\
          </div><!-- row -->\
        </div><!-- card -->'
		
		$('#homepage').html(home)
		var htmls = ''
		var info = JSON.parse(datas.preprimary)
		for(var i = 0; i < info.length; i++)
		{
			var data = info[i]
			htmls += '<tr>\
                  <th scope="row">'+data.sch_class+'</th>\
                  <td>'+new Number(data.total).toLocaleString('en')+'</td>\
                  <td>'+new Number(data.payment).toLocaleString('en')+'</td>\
                  <td>'+new Number(data.balance).toLocaleString('en')+'</td>\
			<td>'+data.percentage+'</td>\
                </tr>'
		}
		var info = JSON.parse(datas.primary)
		for(var i = 0; i < info.length; i++)
		{
			var data = info[i]
			htmls += '<tr>\
                  <th scope="row">'+data.sch_class+'</th>\
                  <td>'+new Number(data.total).toLocaleString('en')+'</td>\
                  <td>'+new Number(data.payment).toLocaleString('en')+'</td>\
                  <td>'+new Number(data.balance).toLocaleString('en')+'</td>\
			<td>'+data.percentage+'</td>\
                </tr>'
		}
		var info = JSON.parse(datas.secondary)
		for(var i = 0; i < info.length; i++)
		{
			var data = info[i]
			htmls += '<tr>\
                  <th scope="row">'+data.sch_class+'</th>\
                  <td>'+new Number(data.total).toLocaleString('en')+'</td>\
                  <td>'+new Number(data.payment).toLocaleString('en')+'</td>\
                  <td>'+new Number(data.balance).toLocaleString('en')+'</td>\
			<td>'+data.percentage+'</td>\
                </tr>'
		}
		var info = JSON.parse(datas.other)
		for(var i = 0; i < info.length; i++)
		{
			var data = info[i]
			htmls += '<tr>\
                  <th scope="row">'+data.sch_class+'</th>\
                  <td>'+new Number(data.total).toLocaleString('en')+'</td>\
                  <td>'+new Number(data.payment).toLocaleString('en')+'</td>\
                  <td>'+new Number(data.balance).toLocaleString('en')+'</td>\
			<td>'+data.percentage+'</td>\
                </tr>'
		}
		if(home_table == null){}
		else{
			home_table.destroy();
		}
		$('#hometable').html(htmls)
		home_table = $('#hometabledata').DataTable({
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
		
			}
			
		})
		
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
		var href = 'https://alxproject.virilesoftware.com/api/feesanalysis';
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
			if(datas.status == 'ok'){
				var home = '<div class="card card-dash-one mg-t-20">\
          <div class="row no-gutters">\
            <div class="col-lg-3 col-sm-6">\
              <div class="dash-content">\
                <label class="tx-primary">Total Amount</label>\
                <h2>'+new Number(datas.amount).toLocaleString('en')+'</h2>\
              </div><!-- dash-content -->\
            </div><!-- col-3 -->\
            <div class="col-lg-3 col-sm-6">\
              <div class="dash-content">\
                <label class="tx-success">Total Payment</label>\
                <h2>'+new Number(datas.payment).toLocaleString('en')+'</h2>\
              </div><!-- dash-content -->\
            </div><!-- col-3 -->\
            <div class="col-lg-3 col-sm-6">\
              <div class="dash-content">\
                <label class="tx-danger">Total Balance</label>\
                <h2>'+new Number(datas.balance).toLocaleString('en')+'</h2>\
              </div><!-- dash-content -->\
            </div><!-- col-3 -->\
            <div class="col-lg-3 col-sm-6">\
              <div class="dash-content">\
                <label class="tx-purple">% Recover</label>\
                <h2>'+datas.percentage+'</h2>\
              </div><!-- dash-content -->\
            </div><!-- col-3 -->\
          </div><!-- row -->\
        </div><!-- card -->'
		
		$('#homepage').html(home)
		var htmls = ''
		var info = JSON.parse(datas.preprimary)
		for(var i = 0; i < info.length; i++)
		{
			var data = info[i]
			htmls += '<tr>\
                  <th scope="row">'+data.sch_class+'</th>\
                  <td>'+new Number(data.total).toLocaleString('en')+'</td>\
                  <td>'+new Number(data.payment).toLocaleString('en')+'</td>\
                  <td>'+new Number(data.balance).toLocaleString('en')+'</td>\
			<td>'+data.percentage+'</td>\
                </tr>'
		}
		var info = JSON.parse(datas.primary)
		for(var i = 0; i < info.length; i++)
		{
			var data = info[i]
			htmls += '<tr>\
                  <th scope="row">'+data.sch_class+'</th>\
                  <td>'+new Number(data.total).toLocaleString('en')+'</td>\
                  <td>'+new Number(data.payment).toLocaleString('en')+'</td>\
                  <td>'+new Number(data.balance).toLocaleString('en')+'</td>\
			<td>'+data.percentage+'</td>\
                </tr>'
		}
		var info = JSON.parse(datas.secondary)
		for(var i = 0; i < info.length; i++)
		{
			var data = info[i]
			htmls += '<tr>\
                  <th scope="row">'+data.sch_class+'</th>\
                  <td>'+new Number(data.total).toLocaleString('en')+'</td>\
                  <td>'+new Number(data.payment).toLocaleString('en')+'</td>\
                  <td>'+new Number(data.balance).toLocaleString('en')+'</td>\
			<td>'+data.percentage+'</td>\
                </tr>'
		}
		var info = JSON.parse(datas.other)
		for(var i = 0; i < info.length; i++)
		{
			var data = info[i]
			htmls += '<tr>\
                  <th scope="row">'+data.sch_class+'</th>\
                  <td>'+new Number(data.total).toLocaleString('en')+'</td>\
                  <td>'+new Number(data.payment).toLocaleString('en')+'</td>\
                  <td>'+new Number(data.balance).toLocaleString('en')+'</td>\
			<td>'+data.percentage+'</td>\
                </tr>'
		}
		if(home_table == null){}
		else{
			home_table.destroy();
		}
		$('#hometable').html(htmls)
		home_table = $('#hometabledata').DataTable({
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
		
			}
			
		})
		
	})
	$(document).on('click', '#filter_search', function (event) {
		var dt = {
			category:$('#category').val(),
			academic_session:$('#academic_session').select2('data')[0].id,
			session_term:$('#session_term').select2('data')[0].id,
			student_class:$('#student_class').select2('data')[0].id,
		}
				
        var payload = jwt_decode(token);
		var href = 'https://alxproject.virilesoftware.com/api/studentfees';
		$.ajax({
			type: 'GET',
			data: dt,
			url: href,
			dataType:'JSON',
			beforeSend : function(req) {
				req.setRequestHeader('Authorization', 'Bearer '+token);
			}
		}).done(function(datas){
            if(table == null){}
			else{
				table.destroy();
			}
			var payload = jwt_decode(token);
			var thtmls = ''
			if(datas.edit == true){
				var edit = ''
			}
			else{
				var edit = 'd-none'
			}
			if(datas.view == true){
				var view = ''
			}
			else{
				var view = 'd-none'
			}
			if(datas.add == true){
				var add = ''
			}
			else{
				var add = 'd-none'
			}
			var datat = datas.data
			var sn = 0
			var amount = 0
			var weaver  = 0
			var fine = 0
			var payment = 0
			var balance = 0
			for(var i = 0; i < datat.length; i++){
				var data = datat[i]
				sn += 1
				amount = math.chain(data.amount).add(amount).done()
				weaver = math.chain(weaver).add(data.weaver).done()
				fine = math.chain(fine).add(data.fine).done()
				payment = math.chain(payment).add(data.payment).done()
				balance = math.chain(balance).add(data.balance).done()
				thtmls +=
					 '<tr id="row'+data.ref_id+'" class="tx-16"><td>'+ sn + '</td>\
					<td><a href="https://alxproject.virilesoftware.com/eportal/'+payload.username+'/studentdetail/'+data.student_id+'" target="_black" class="tx-16">'+ data.name+ '</a></td>\
					<td>'+ data.student_class + '</td>\
					<td>'+ new Number(data.amount).toLocaleString()+ '</td>\
					<td>'+ new Number(data.weaver).toLocaleString()+ '</td>\
					<td>'+ new Number(data.fine).toLocaleString()+ '</td>\
					<td>'+ new Number(data.payment).toLocaleString()+ '</td>\
					<td>'+ new Number(data.balance).toLocaleString() + '</td>\
					<td><div class="user-btn-wrapper">\
					<a href="https://alxproject.virilesoftware.com/eportal/'+payload.username+'/studentbillpayment/'+data.ref_id+'" target="_black" class="btn btn-outline-warning btn-icon '+add+'"\
				 data-toggle="tooltip-success" data-placement="top" title="Make Payment">\
					<div class="tx-20"><i class="fa fa-money"></i></div>\
					</a>\
					<a href="https://alxproject.virilesoftware.com/eportal/'+payload.username+'/studentbill/'+data.ref_id+'"  target="_black" class="btn btn-outline-warning btn-icon '+view+'"\
				 data-toggle="tooltip-success" data-placement="top" title="View Bill">\
					<div class="tx-20"><i class="fa fa-info"></i></div>\
					</a>\
				<a href="https://alxproject.virilesoftware.com/eportal/'+payload.username+'/editstudentbill/'+data.ref_id+'" target="_black" class="btn btn-outline-warning btn-icon '+edit+'"\
				 data-toggle="tooltip-success" data-placement="top" title="Edit Bill">\
					<div class="tx-20"><i class="fa fa-edit"></i></div>\
					</a>\
				</div></td>\
					</tr>';				  
							
			}
			thtmls +=
					 '<tr id="row00" class="tx-16"><td>Total</td>\
					<td></td>\
					<td></td>\
					<td>'+ new Number(amount).toLocaleString()+ '</td>\
					<td>'+ new Number(weaver).toLocaleString()+ '</td>\
					<td>'+ new Number(fine).toLocaleString()+ '</td>\
					<td>'+ new Number(payment).toLocaleString()+ '</td>\
					<td>'+ new Number(balance).toLocaleString() + '</td>\
					<td></td>\
					</tr>';	
			$('[data-toggle="tooltip-success"]').tooltip({
			  template: '<div class="tooltip tooltip-success" role="tooltip"><div class="arrow"></div><div class="tooltip-inner"></div></div>'
			});
			$('#tablebody').html(thtmls)
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
	
	
	
});