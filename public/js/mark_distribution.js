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
	var remarktable = null
	if(auth.isLoggedIn())
	{
		
		var href = 'https://alxproject.virilesoftware.com/api/schoolclass';
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
			$('#student_class_form').append('<option value="pre-primary">All Pre-Primary Class</option>')
			$('#student_class_form').append('<option value="primary">All Primary Class</option>')
			$('#student_class_form').append('<option value="secondary">All Secondary Class</option>')
			
			$('#edit_student_class_form').append('<option value="primary">All Pre-Primary Class</option>')
			$('#edit_student_class_form').append('<option value="primary">All Primary Class</option>')
			$('#edit_student_class_form').append('<option value="secondary">All Secondary Class</option>')
			for(var i = 0; i < datas.length; i++)
			{
				$('#student_class_form').append('<option value="'+datas[i].ref_id+'">'+datas[i].name+'</option>')
				$('#edit_student_class_form').append('<option value="'+datas[i].ref_id+'">'+datas[i].name+'</option>')
				$('#remark_student_class_form').append('<option value="'+datas[i].ref_id+'">'+datas[i].name+'</option>')
			}
		});
		
		
				
        var payload = jwt_decode(token);
		var href = 'https://alxproject.virilesoftware.com/api/reportcardsetting';
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
			var thtmls = ''
			if(table == null){}
			else{
				table.destroy();
			}
			var datat = datas.data
			if(datas.add == true){
				$('#add_session').removeClass('d-none')
				$('#add_remark').removeClass('d-none')
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
			for(var i = 0; i < datat.length; i++){
				var data = datat[i]
				thtmls +=
					 '<tr id="row'+data.ref_id+'">\
					<td style="padding-top:20px">'+ data.school_class+ '</td>\
					<td style="padding-top:20px">'+ data.name + '</td>\
					<td style="padding-top:20px">'+ data.abbr + '</td>\
					<td style="padding-top:20px">'+ data.point+ '</td>\
					<td><div class="user-btn-wrapper">\
					<a href="#" class="btn btn-outline-danger btn-icon removeschoolclass '+del+'" id="' +data.ref_id + '">\
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
		

		var href = 'https://alxproject.virilesoftware.com/api/remarksetting';
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
			var thtmls = ''
			if(remarktable == null){}
			else{
				remarktable.destroy();
			}
			var datat = datas.data
			if(datas.add == true){
				$('#add_session').removeClass('d-none')
				$('#add_remark').removeClass('d-none')
			}
			
			if(datas.delete == true){
				var del = ''
			}
			else{
				var del = 'd-none'
			}
			for(var i = 0; i < datat.length; i++){
				var data = datat[i]
				thtmls +=
					 '<tr id="row'+data.ref_id+'">\
					<td style="padding-top:20px">'+ data.school_class+ '</td>\
					<td><div class="user-btn-wrapper">\
					<a href="#" class="btn btn-outline-danger btn-icon removeremarkschoolclass '+del+'" id="' +data.ref_id + '">\
					<div class="tx-20"><i class="fa fa-trash"></i></div>\
					</a>\
					</div></td>\
					</tr>';				  
							
			}
			$('#remarktablebody').html(thtmls)
			$('[data-toggle="tooltip-success"]').tooltip({
			  template: '<div class="tooltip tooltip-success" role="tooltip"><div class="arrow"></div><div class="tooltip-inner"></div></div>'
			});
			remarktable = $('#remarktabledata').DataTable({
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
                $('#remarktabledata').each(function() {
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
		
	}
	else
	{
		window.location = 'https://alxproject.virilesoftware.com/eportal/login'
	}
	
	
	$(document).on('click', '#add_session', function (event) {
		$('#sessionformpanel').removeClass('d-none')
		$('#remarkformpanel').addClass('d-none')
	})
	$(document).on('click', '#cancel_session_form', function (event) {
		$('#sessionformpanel').addClass('d-none')

	})


	$(document).on('click', '#add_remark', function (event) {
		$('#sessionformpanel').addClass('d-none')
		$('#remarkformpanel').removeClass('d-none')
	})
	$(document).on('click', '#remark_cancel_session_form', function (event) {
		$('#remarkformpanel').addClass('d-none')
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
		
        // var con = confirm('You are about to delete \n Fees: ' + sn +'\n Session: '+session +'\n Term: '+term+'\n Class: '+cls)
        // if (con == true) {
        //     $.ajax({
        //         type: 'DELETE',
        //         data: null,
        //         url: 'https://alxproject.virilesoftware.com/api/fees_registrar/' + ref_id,
        //         dataType: 'JSON',
        //         beforeSend: function (req) {
        //             req.setRequestHeader('Authorization', 'Bearer ' + token);
        //         }
        //     }).done(function (data) {
        //         if (data.status == 'ok') {
        //             alert(data.msg)
        //             document.getElementById("row"+ref_id+"").outerHTML=""
        //         } else {
        //             alert(data.msg)
        //         }

        //     });
        // } else {
        //     return false;
        // }
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
                //$('#load-submit').addClass('d-none');
				//$('#processing-btn').removeClass('d-none');
                
				var branch = $('#student_class_form').select2('data')
				var b = []
				for(var i = 0; i < branch.length; i++){
					b.push(branch[i].id)
				}
                var passd = {
                    point:$('input[name=point]').val(),
					name:$('input[name=name]').val(),
					abbr:$('input[name=abbr]').val(),
					student_class:JSON.stringify(b)
					
                }
                var href = 'https://alxproject.virilesoftware.com/api/reportcardsetting';
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
						window.location.reload()
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

	$(document).on('click', '#remark_load-submit', function (event) {
		event.stopImmediatePropagation()
		event.stopPropagation()
		$('#remarkform').validate({

            submitHandler: function () {
                event.preventDefault()
				var token = auth.getToken();
                //$('#load-submit').addClass('d-none');
				//$('#processing-btn').removeClass('d-none');
                
				var branch = $('#remark_student_class_form').select2('data')
				var b = []
				for(var i = 0; i < branch.length; i++){
					b.push(branch[i].id)
				}
                var passd = {
                    
					student_class:JSON.stringify(b)
					
                }
                var href = 'https://alxproject.virilesoftware.com/api/remarksetting';
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
						window.location.reload()
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