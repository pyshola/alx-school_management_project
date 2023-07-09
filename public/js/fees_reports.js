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
	if(auth.isLoggedIn())
	{
		
		
		var href = 'https://alxproject.virilesoftware.com/api/feestype';
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
				$('#fees_type').append('<option value="'+datas[i].ref_id+'">'+datas[i].name+'</option>')
				
			}
		});
		
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
		
		var href = 'https://alxproject.virilesoftware.com/api/studentclass';
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
			fees_type:$('#fees_type').select2('data')[0].id,
			academic_session:$('#academic_session').select2('data')[0].id,
			session_term:$('#session_term').select2('data')[0].id,
			student_class:$('#student_class').select2('data')[0].id,
		}
				
        var payload = jwt_decode(token);
		var href = 'https://alxproject.virilesoftware.com/api/feesreports';
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
				$('#tablebody').html('')
			}
			else{
				var payload = jwt_decode(token);
				var html_fees = ''
				var payment = 0
				var amount = 0
				var balance = 0
				var weaver = 0
				var fine = 0
				for(var i = 0; i < fees.length; i++){
				var sn = i + 1
					html_fees += '<tr id="'+fees[i].ref_id+'">\
					<td>'+sn+'</td>\
					<td><a href="https://alxproject.virilesoftware.com/eportal/'+payload.username+'/studentdetail/'+fees[i].student_id+'">'+fees[i].name+'</a></td>\
					<td>'+fees[i].student_class+'</td>\
					<td>'+fees[i].academic+'</td>\
					<td>'+new Number(fees[i].amount).toLocaleString('en')+'</td>\
					  <td>'+new Number(fees[i].weaver).toLocaleString('en')+'</td>\
					<td>'+new Number(fees[i].fine).toLocaleString('en')+'</td>\
					  <td>'+new Number(fees[i].payment).toLocaleString('en')+'</td>\
					  <td>'+new Number(fees[i].balance).toLocaleString('en')+'</td>\
				</tr>'
					payment = math.chain(payment).add(fees[i].payment).done()
					amount = math.chain(amount).add(fees[i].amount).done()
					weaver = math.chain(weaver).add(fees[i].weaver).done()
					fine = math.chain(fine).add(fees[i].fine).done()
					balance = math.chain(balance).add(fees[i].balance).done()
				}
				html_fees += '<tr id="0">\
					<td></td>\
					<td>Total</td>\
						<td></td>\
					  <td></td>\
					  <td>'+new Number(amount).toLocaleString('en')+'</td>\
					  <td>'+new Number(weaver).toLocaleString('en')+'</td>\
					  <td>'+new Number(fine).toLocaleString('en')+'</td>\
					  <td>'+new Number(payment).toLocaleString('en')+'</td>\
					  <td>'+new Number(balance).toLocaleString('en')+'</td>\
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
			//$('#tablebody').html(thtmls)
            
		})
		
	})
	$(document).on('click', '#add_session', function (event) {
		$('#sessionformpanel').removeClass('d-none')
	})
	$(document).on('click', '#cancel_session_form', function (event) {
		$('#sessionformpanel').addClass('d-none')
	})
	
    
    $(document).on('click', '.removeschoolclasss', function (event) {
		event.stopImmediatePropagation()
		event.stopPropagation()
        event.preventDefault()
        var ref_id = this.id
        var sn = $(this).attr('data-name')
		
        var con = confirm('You are about to delete session: ' + sn)
        if (con == true) {
            $.ajax({
                type: 'DELETE',
                data: null,
                url: 'https://alxproject.virilesoftware.com/api/fees_registrar/' + ref_id,
                dataType: 'JSON',
                beforeSend: function (req) {
                    req.setRequestHeader('Authorization', 'Bearer ' + token);
                }
            }).done(function (data) {
                if (data.status == 'ok') {
                    alert(data.msg)
                    document.getElementById("row"+ref_id+"").outerHTML=""
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
				var branch = $('#student_class_form').select2('data')
				var b = []
				for(var i = 0; i < branch.length; i++){
					b.push(parseInt(branch[i].id))
				}
                var passd = {
                    amount:amount,
					fees_type:$('#fees_type_form').select2('data')[0].id,
					academic_session:$('#academic_session_form').select2('data')[0].id,
					session_term:$('#session_term_form').select2('data')[0].id,
					student_class:JSON.stringify(b)
					
                }
                var href = 'https://alxproject.virilesoftware.com/api/fees_registrar';
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
						var branch = $('#student_class_form').select2('data')
						var payload = jwt_decode(token);
						toastr.success(data.msg,{"closeButton": true, timeOut: 9500 })
						for(var i = 0; i < branch.length; i++){
							console.log(branch[i].text)
							var ref_id = JSON.parse(data.ref_id)
							for(var s = 0; s < ref_id.length; s++){
								if(ref_id[s].cls == branch[i].id){
									var table = document.getElementById("tabledata");
									var tbl = $('table#tabledata  tr:last').index() + 1
									var thtmls =
									  '<tr id="row'+ref_id[s].ref_id+'" style="background-color:white; color:black;">\
									  <td style="background-color:white; color:black;padding-top:20px;">'+ $('#fees_type_form').select2('data')[0].text + '</td>\
										<td style="background-color:white; color:black;padding-top:20px;">'+ $('#academic_session_form').select2('data')[0].text + '</td>\
										<td style="background-color:white; color:black;padding-top:20px;">'+ $('#session_term_form').select2('data')[0].text + '</td>\
										<td style="background-color:white; color:black;padding-top:20px;">'+ branch[i].text + '</td>\
										<td style="background-color:white; color:black;padding-top:20px;">'+ $('input[name=amount]').val() + '</td>\
									  <td style="background-color:white; color:black;"><div class="user-btn-wrapper">\
									<a href="https://alxproject.virilesoftware.com/eportal/'+payload.username+'/editfees_registrar/'+ref_id[s].ref_id+'" class="btn btn-outline-warning btn-icon">\
									  <div class="tx-20"><i class="fa fa-edit"></i></div>\
									</a>\
								  <a href="#" class="btn btn-outline-danger btn-icon removeschoolclass" id="' +ref_id[s].ref_id + '"  data-fees ="' + $('#fees_type_form').select2('data')[0].text + '"\
										data-session ="' + $('#academic_session_form').select2('data')[0].text + '" data-term ="' + $('#session_term_form').select2('data')[0].text + '" \
											data-student_class ="' + branch[i].text + '" data-amount ="' + amount + '"  >\
									  <div class="tx-20"><i class="fa fa-trash"></i></div>\
									</a>\
									</div></td>\
								   </tr>';
								   var row = table.insertRow(tbl).outerHTML = thtmls;
									break
								}
							}
							
						}
						
						
						$('#load-submit').removeClass('d-none');
                        $('#processing-btn').addClass('d-none');
						$('#sessionformpanel').addClass('d-none')
						$('input[name=session_name]').val('');
						
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