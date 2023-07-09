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
	var first_start = moment();
	var first_end = moment();
	$('#payment_date').daterangepicker({
            startDate: first_start,
            endDate: first_end,
            locale: {
              format: 'MMM D, YYYY'
            },
            ranges: {
               'Today': [moment(), moment()],
               'Yesterday': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
               'Last 7 Days': [moment().subtract(6, 'days'), moment()],
               'Last 30 Days': [moment().subtract(29, 'days'), moment()],
               'This Month': [moment().startOf('month'), moment().endOf('month')],
               'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
            }
           
        });
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
			console.log(datas)
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
		
		
		
	}
	else
	{
		window.location = 'https://alxproject.virilesoftware.com/eportal/login'
	}
	$('#payment_date').on('apply.daterangepicker', function(ev, picker) {
		  //do something, like clearing an input
		first_start = moment(picker.startDate)
		first_end = moment(picker.endDate)
	})
	$(document).on('click', '#filter_search', function (event) {
		var dt = {
			first_start:first_start.format(), first_end:first_end.format(),
			academic_session:$('#academic_session').select2('data')[0].id,
			session_term:$('#session_term').select2('data')[0].id,
			student_class:$('#student_class').select2('data')[0].id,
		}
				
        var payload = jwt_decode(token);
		var href = 'https://alxproject.virilesoftware.com/api/paymenthistory';
		$.ajax({
			type: 'GET',
			data: dt,
			url: href,
			dataType:'JSON',
			beforeSend : function(req) {
				req.setRequestHeader('Authorization', 'Bearer '+token);
			}
		}).done(function(fees){
			if(table == null){}
			else{
				table.destroy();
			}
			if(fees.length == 0){
				alert('No transaction found!')
				$('#billpayment_info').html('')
			}
			else{
				var payload = jwt_decode(token);
				var html_fees = ''
				var payment = 0
				var due = 0
				var balance = 0
				for(var i = 0; i < fees.length; i++){
				var sn = i + 1
					html_fees += '<tr id="'+fees[i].ref_id+'">\
					<td>'+sn+'</td>\
					<td>'+moment(fees[i].trans_date).format('DD/MM/YYYY')+'</td>\
					<td><a href="https://alxproject.virilesoftware.com/eportal/'+payload.username+'/studentdetail/'+fees[i].student_id+'">'+fees[i].name+'</a></td>\
					<td>'+fees[i].student_class+'</td>\
					<td>'+fees[i].academic+'</td>\
					<td>'+fees[i].receipt+'</td>\
					<td>'+fees[i].payment_method+'</td>\
					  <td>'+new Number(fees[i].due).toLocaleString('en')+'</td>\
					  <td>'+new Number(fees[i].payment).toLocaleString('en')+'</td>\
					  <td>'+new Number(fees[i].balance).toLocaleString('en')+'</td>\
				<td><div class="user-btn-wrapper">\
					<a href="https://alxproject.virilesoftware.com/eportal/'+payload.username+'/studentbillinvoice/'+fees[i].ref_id+'" class="btn btn-oblong btn-sm btn-outline-primary btn-icon"\
				 data-toggle="tooltip-success" data-placement="top" title="View Bill">View Invoice</a>\
				</div></td>\
					</tr>'
					payment = math.chain(payment).add(fees[i].payment).done()
					due = math.chain(due).add(fees[i].due).done()
					balance = math.chain(balance).add(fees[i].balance).done()
				}
				html_fees += '<tr id="0">\
					<td></td>\
					<td>Total</td>\
					<td<td><td<td>\
					<td></td>\
					  <td></td><td></td>\
					  <td></td><td></td>\
					  <td>'+new Number(due).toLocaleString('en')+'</td>\
					  <td>'+new Number(payment).toLocaleString('en')+'</td>\
					  <td>'+new Number(balance).toLocaleString('en')+'</td>\
				<td></td>\
					</tr>'
				$('#billpayment_info').html(html_fees)
				$('[data-toggle="tooltip-success"]').tooltip({
			  template: '<div class="tooltip tooltip-success" role="tooltip"><div class="arrow"></div><div class="tooltip-inner"></div></div>'
			});
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
			}
		})
            
		
	})
	
	
	
});