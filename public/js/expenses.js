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
			//console.log(datas)
			for(var i = 0; i < datas.length; i++)
			{
				$('#academic_session').append('<option value="'+datas[i].ref_id+'">'+datas[i].name+'</option>')
				
			}
			
		});
		
		var href = 'https://alxproject.virilesoftware.com/api/expensestype';
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
			if(datas.status == 'ok'){
				var data = datas.data
				for(var i = 0; i < data.length; i++)
				{
					$('#expenses_type').append('<option value="'+data[i].ref_id+'">'+data[i].name+'</option>')
					$('#expenses_type_form').append('<option value="'+data[i].ref_id+'">'+data[i].name+'</option>')
				}
			}
		})
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
			expenses_type:$('#expenses_type').select2('data')[0].id,
			academic_session:$('#academic_session').select2('data')[0].id,
			session_term:$('#session_term').select2('data')[0].id,
			first_start:first_start.format(), first_end:first_end.format(),
		}
				
        var payload = jwt_decode(token);
		var href = 'https://alxproject.virilesoftware.com/api/expenses';
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
			if(datas.access == true){
					var del = ''
			}
			else{
					var del = 'd-none'
			}
            var fees = datas.data
			if(fees.length == 0){
				alert('No transaction found!')
				$('#tablebody').html('')
			}
			else{
				var payload = jwt_decode(token);
				var html_fees = ''
				var amount = 0
				
				for(var i = 0; i < fees.length; i++){
				var sn = i + 1
					html_fees += '<tr id="'+fees[i].ref_id+'">\
					<td>'+sn+'</td>\
					<td>'+fees[i].trans_date+'</td>\
					<td>'+fees[i].title+'</td>\
					<td>'+fees[i].category+'</td>\
					<td>'+new Number(fees[i].amount).toLocaleString('en')+'</td>\
					<td>'+fees[i].description+'</td>\
					<td><div class="user-btn-wrapper">\
					<a href="#" class="btn btn-outline-danger btn-icon removeschoolclass '+del+'" id="' +fees[i].ref_id + '"  data-name ="' + fees[i].title + '"\
					data-amount ="' + fees[i].amount + '" data-sn ="' + sn + '"  >\
					<div class="tx-20"><i class="fa fa-trash"></i></div>\
					</a>\
					</div></td>\
					</tr>'
					amount = math.chain(amount).add(fees[i].amount).done()
				}
				html_fees += '<tr id="0">\
					<td></td>\
						<td>Total</td>\
						<td></td>\
					  <td></td>\
					  <td>'+new Number(amount).toLocaleString('en')+'</td>\
					  <td></td><td></td>\
					</tr>'
				$('#tablebody').html(html_fees)
				
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
	$(document).on('click', '#add_session', function (event) {
		$('#sessionformpanel').removeClass('d-none')
	})
	$(document).on('click', '#cancel_session_form', function (event) {
		$('#sessionformpanel').addClass('d-none')
	})
	
    
    $(document).on('click', '.removeschoolclass', function (event) {
		event.stopImmediatePropagation()
		event.stopPropagation()
        event.preventDefault()
        var ref_id = this.id
        var sn = $(this).attr('data-sn')
		var name = $(this).attr('data-name')
		
        var con = confirm('You are about to delete '+name+' information with S/N ' + sn)
        if (con == true) {
            $.ajax({
                type: 'DELETE',
                data: null,
                url: 'https://alxproject.virilesoftware.com/api/expenses/' + ref_id,
                dataType: 'JSON',
                beforeSend: function (req) {
                    req.setRequestHeader('Authorization', 'Bearer ' + token);
                }
            }).done(function (data) {
                if (data.status == 'ok') {
                    alert(data.msg)
                    window.location.reload()
                } else {
                    alert(data.msg)
                }

            });
        } else {
            return false;
        }
    })
	
	
	$(document).on('click', '.editschoolclass', function (event) {
		event.preventDefault()
		var ref_id = this.id
		table_index = this.parentNode.parentNode.rowIndex;
		$('#edit_sch_class').val($(this).attr('data-name'))
		$('#updateclassarm_modal').attr('data-ref', ref_id) 
		$('#updateclassarm_modal').modal('show'); 
        
    })
	
	
	
	
	
    $(document).on('click', '#load-submit', function (event) {
		event.stopImmediatePropagation()
		event.stopPropagation()
		$('#sessionform').validate({

            submitHandler: function () {
                event.preventDefault()
				var token = auth.getToken();
                $('#load-submit').addClass('d-none');
				$('#processing-btn').removeClass('d-none');
                var amount = $('input[name=amount]').val()
                amount = new Number(amount.replace(/,/g, ''));
				
                var passd = {
                    amount:amount,
					expenses_type:$('#expenses_type_form').select2('data')[0].id,
					title:$('input[name=title]').val(),
					description:$('textarea[name=description]').val()
					
                }
                var href = 'https://alxproject.virilesoftware.com/api/expenses';
                $.ajax({
                    type: 'POST',
                    data: passd,
                    url: href,
                    dataType: 'JSON',
                    beforeSend: function (req) {
                        req.setRequestHeader('Authorization', 'Bearer ' + token);
                    }
                }).done(function (data) {
                    if (data.status == 'ok') {
						alert(data.msg)
						window.location.reload()
						$('#load-submit').removeClass('d-none');
                        $('#processing-btn').addClass('d-none');
						$('#sessionformpanel').addClass('d-none')
                    } else {
                        toastr.warning(data.msg,{"closeButton": true, timeOut: 9500 })
                        $('#load-submit').removeClass('d-none');
                        $('#processing-btn').addClass('d-none');
                    }

                });
            }
        })

    });
	
	
	
});