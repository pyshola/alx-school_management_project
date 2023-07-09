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
				$('#fees_type_form').append('<option value="'+datas[i].ref_id+'">'+datas[i].name+'</option>')
				$('#edit_fees_type_form').append('<option value="'+datas[i].ref_id+'">'+datas[i].name+'</option>')
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
				$('#academic_session_form').append('<option value="'+datas[i].ref_id+'">'+datas[i].name+'</option>')
				$('#edit_academic_session_form').append('<option value="'+datas[i].ref_id+'">'+datas[i].name+'</option>')
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
				console.log(data)
				$('#academic_session').val(data.session_id)
				$('#academic_session_form').trigger('change')
				$('#session_term_form').val(data.term)
				$('#session_term_form').trigger('change')
				
			});
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
				$('#student_class_form').append('<option value="'+datas[i].ref_id+'">'+datas[i].name+'</option>')
				$('#edit_student_class_form').append('<option value="'+datas[i].ref_id+'">'+datas[i].name+'</option>')
			}
		});
		
		var dt = {
			fees_type:$('#fees_type').select2('data')[0].id,
			academic_session:$('#academic_session').select2('data')[0].id,
			session_term:$('#session_term').select2('data')[0].id,
			student_class:$('#student_class').select2('data')[0].id,
		}
				
        var payload = jwt_decode(token);
		// var href = 'https://alxproject.virilesoftware.com/api/fees_registraradmin';
		// $.ajax({
		// 	type: 'GET',
		// 	data: dt,
		// 	url: href,
		// 	dataType:'JSON',
		// 	beforeSend : function(req) {
		// 		req.setRequestHeader('Authorization', 'Bearer '+token);
		// 	}
		// }).done(function(datas){
        //     //console.log(datas)
		// 	var thtmls = ''
		// 	if(table == null){}
		// 	else{
		// 		table.destroy();
		// 	}
		// 	var datat = datas.data
		// 	if(datas.add == true){
		// 		$('#add_session').removeClass('d-none')
		// 	}
		// 	if(datas.edit == true){
		// 			var edit = ''
		// 		}
		// 		else{
		// 			var edit = 'd-none'
		// 		}
		// 		if(datas.delete == true){
		// 			var del = ''
		// 		}
		// 		else{
		// 			var del = 'd-none'
		// 		}
		// 	for(var i = 0; i < datat.length; i++){
		// 		var data = datat[i]
		// 		thtmls +=
		// 			 '<tr id="row'+data.ref_id+'">\
		// 			<td style="padding-top:20px">'+ data.fees+ '</td>\
		// 			<td style="padding-top:20px">'+ data.session + '</td>\
		// 			<td style="padding-top:20px">'+ data.term + '</td>\
		// 			<td style="padding-top:20px">'+ data.student_class+ '</td>\
		// 			<td style="padding-top:20px">'+ new Number(data.amount).toLocaleString() + '</td>\
		// 			<td><div class="user-btn-wrapper">\
		// 			<a href="#" class="btn btn-outline-warning btn-icon editfees_registrar '+edit+'" id="' +data.ref_id + '"  data-fees ="' + data.fees_id + '"\
		// 			data-session ="' + data.session_id + '" data-term ="' + data.term + '" \
		// 			data-student_class ="' + data.student_class_id + '" data-amount ="' + data.amount + '">\
		// 			<div class="tx-20"><i class="fa fa-edit"></i></div>\
		// 			</a>\
		// 			<a href="#" class="btn btn-outline-danger btn-icon removeschoolclass '+del+'" id="' +data.ref_id + '"  data-fees ="' + data.fees + '"\
		// 			data-session ="' + data.session + '" data-term ="' + data.term + '" \
		// 			data-student_class ="' + data.student_class + '" data-amount ="' + data.amount + '"  >\
		// 			<div class="tx-20"><i class="fa fa-trash"></i></div>\
		// 			</a>\
		// 			</div></td>\
		// 			</tr>';				  
							
		// 	}
		// 	$('#tablebody').html(thtmls)
		// 	$('[data-toggle="tooltip-success"]').tooltip({
		// 	  template: '<div class="tooltip tooltip-success" role="tooltip"><div class="arrow"></div><div class="tooltip-inner"></div></div>'
		// 	});
		// 	table = $('#tabledata').DataTable({
        //         retrieve:true,
        //         sorting:false,
		// 		ordering:false,
        //         "aLengthMenu": [
        //             [10, 30, 50, -1],
        //             [10, 30, 50, "All"]
        //         ],
        //         "iDisplayLength": 50,
        //         dom: 'Bfrtip',
		// 		buttons: [
		// 			'csv', 'excel','pdf', 'print'
		// 		],
        //         "language": {
        //             search: ""
        //         }
        //         });
        //         $('#tabledata').each(function() {
        //         var datatable = $(this);
        //         // SEARCH - Add the placeholder for Search and Turn this into in-line form control
        //         var search_input = datatable.closest('.dataTables_wrapper').find('div[id$=_filter] input');
        //         search_input.attr('placeholder', 'Search');
        //         search_input.removeClass('form-control-sm');
        //         // LENGTH - Inline-Form control
        //         var length_sel = datatable.closest('.dataTables_wrapper').find('div[id$=_length] select');
        //         length_sel.removeClass('form-control-sm');
                
        //     });
            
		// })
		
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
		var href = 'https://alxproject.virilesoftware.com/api/fees_registraradmin';
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
            var datat = datas.data
			if(datas.add == true){
				$('#add_session').removeClass('d-none')
			}
			if(datas.edit == true){
					var edit = ''
				}
				else{
					var edit = 'd-none'
				}
				if(datas.delete == true){
					var del = ''
				}
				else{
					var del = 'd-none'
				}
			var thtmls = ''
			for(var i = 0; i < datat.length; i++){
				var data = datat[i]
				thtmls +=
					 '<tr id="row'+data.ref_id+'">\
					<td style="padding-top:20px">'+ data.fees+ '</td>\
					<td style="padding-top:20px">'+ data.session + '</td>\
					<td style="padding-top:20px">'+ data.term + '</td>\
					<td style="padding-top:20px">'+ data.student_class+ '</td>\
					<td style="padding-top:20px">'+ new Number(data.amount).toLocaleString() + '</td>\
					<td><div class="user-btn-wrapper">\
					<a href="#" class="btn btn-outline-warning btn-icon editfees_registrar '+edit+'" id="' +data.ref_id + '"  data-fees ="' + data.fees_id + '"\
					data-session ="' + data.session_id + '" data-term ="' + data.term + '" \
					data-student_class ="' + data.student_class_id + '" data-amount ="' + data.amount + '">\
					<div class="tx-20"><i class="fa fa-edit"></i></div>\
					</a>\
					<a href="#" class="btn btn-outline-danger btn-icon removeschoolclass '+del+'" id="' +data.ref_id + '"  data-fees ="' + data.fees + '"\
					data-session ="' + data.session + '" data-term ="' + data.term + '" \
					data-student_class ="' + data.student_class + '" data-amount ="' + data.amount + '"  >\
					<div class="tx-20"><i class="fa fa-trash"></i></div>\
					</a>\
					</div></td>\
					</tr>';				  
							
			}
			$('#tablebody').html(thtmls)
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
        var sn = $(this).attr('data-fees')
		var session =$(this).attr('data-session')
		var term =$(this).attr('data-term')
		var cls =$(this).attr('data-student_class')
		
        var con = confirm('You are about to delete \n Fees: ' + sn +'\n Session: '+session +'\n Term: '+term+'\n Class: '+cls)
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
	
	
	$(document).on('click', '.editfees_registrar', function (event) {
		event.preventDefault()
		var ref_id = this.id
		$('#edit_fees_type_form').val($(this).attr('data-fees'))
		$('#edit_fees_type_form').trigger('change')
		$('#edit_academic_session_form').val($(this).attr('data-session'))
		$('#edit_academic_session_form').trigger('change')
		$('#edit_session_term_form').val($(this).attr('data-term'))
		$('#edit_session_term_form').trigger('change')
		$('#edit_student_class_form').val($(this).attr('data-student_class'))
		$('#edit_student_class_form').trigger('change')
		$('#updateclassarm_modal').attr('data-ref', ref_id) 
		$('#updateclassarm_modal').modal('show'); 
        $('#edit_amount').val($(this).attr('data-amount'))
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
	
	$(document).on('click', '#edit_load-submit', function (event) {
		event.stopImmediatePropagation()
		event.stopPropagation()
		$('#updateschoolclassform').validate({

            submitHandler: function () {
                event.preventDefault()
				var token = auth.getToken();
                //$('#edit_load-submit').addClass('d-none');
				//$('#edit_processing-btn').removeClass('d-none');
                var amount = $('input[name=edit_amount]').val()
                amount = new Number(amount.replace(/,/g, ''));
				
                var passd = {
                    amount:amount,
					fees_type:$('#edit_fees_type_form').select2('data')[0].id,
					academic_session:$('#edit_academic_session_form').select2('data')[0].id,
					session_term:$('#edit_session_term_form').select2('data')[0].id,
					student_class:$('#edit_student_class_form').select2('data')[0].id,
					
                }
				var ref_id = $('#updateclassarm_modal').attr('data-ref') 
                var href = 'https://alxproject.virilesoftware.com/api/fees_registrar/'+ref_id;
                $.ajax({
                    type: 'PUT',
                    data: passd,
                    url: href,
                    dataType: 'JSON',
                    beforeSend: function (req) {
                        req.setRequestHeader('Authorization', 'Bearer ' + token);
                    }
                }).done(function (data) {
					console.log(data)
                    if (data.status == 'ok') {
						alert(data.msg)
						 window.location.reload()
						
                    } else {
                        toastr.warning(data.msg,{"closeButton": true, timeOut: 9500 })
                        $('#edit_load-submit').removeClass('d-none');
                        $('#edit_processing-btn').addClass('d-none');
                    }

                });
            }
        })

    });
	
});