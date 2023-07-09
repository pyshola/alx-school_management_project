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
	var first_start = moment().startOf('month'); 
	var first_end = moment();
	var second_start = moment().startOf('month'); 
	var second_end = moment();
	var third_start = moment().startOf('month');
	var third_end = moment();
        // Datepicker
        
        $('#first_term').daterangepicker({
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
        $('#second_term').daterangepicker({
            startDate: second_start,
            endDate: second_end,
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
        $('#third_term').daterangepicker({
            startDate: third_start,
            endDate: third_end,
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
		var href = 'https://alxproject.virilesoftware.com/api/sessionname';
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
				$('#session_name').append('<option value="'+datas[i].name+'">'+datas[i].name+'</option>')
				
			}
		});
		var href = 'https://alxproject.virilesoftware.com/api/sessionadmin';
		$.ajax({
			type: 'GET',
			data: null,
			url: href,
			dataType:'JSON',
			beforeSend : function(req) {
				req.setRequestHeader('Authorization', 'Bearer '+token);
			}
		}).done(function(datas){
			//console.log(data)
			var htmls = ''
			var data = datas.data
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
			var payload = jwt_decode(token);
			for(i = 0; i < data.length; i++)
			{
				table_index += 1
				
					htmls +=
				'<tr id="row'+data[i].ref_id+'">\
					  <td style="padding-top:20px">'+ data[i].name + '</td>\
						<td style="padding-top:20px">'+ data[i].first_term + '</td>\
						<td style="padding-top:20px">'+ data[i].second_term + '</td>\
						<td style="padding-top:20px">'+ data[i].third_term + '</td>\
					  <td><div class="user-btn-wrapper">\
                    <a href="https://alxproject.virilesoftware.com/eportal/'+payload.username+'/editsession/'+data[i].ref_id+'" class="btn btn-outline-warning btn-icon '+edit+'">\
                      <div class="tx-20"><i class="fa fa-edit"></i></div>\
                    </a>\
                  <a href="#" class="btn btn-outline-danger btn-icon removeschoolclass '+del+'" id="' +data[i].ref_id + '"  data-name ="' + data[i].name + '" >\
                      <div class="tx-20"><i class="fa fa-trash"></i></div>\
                    </a>\
                    </div></td>\
				   </tr>';
					 
				  
					
			}
			$('#tablebody').html(htmls)
			
		});
        
		
	}
	else
	{
		window.location = 'https://alxproject.virilesoftware.com/eportal/login'
	}
	
	$(document).on('click', '#add_session', function (event) {
		$('#sessionformpanel').removeClass('d-none')
	})
	$(document).on('click', '#cancel_session_form', function (event) {
		$('#sessionformpanel').addClass('d-none')
	})
	$('#first_term').on('apply.daterangepicker', function(ev, picker) {
		  //do something, like clearing an input
		first_start = moment(picker.startDate)
		first_end = moment(picker.endDate)
	})
	$('#second_term').on('apply.daterangepicker', function(ev, picker) {
		  //do something, like clearing an input
		second_start = moment(picker.startDate)
		second_end = moment(picker.endDate)
	})
	$('#third_term').on('apply.daterangepicker', function(ev, picker) {
		  //do something, like clearing an input
		third_start = moment(picker.startDate)
		third_end = moment(picker.endDate)
	})
    
    $(document).on('click', '.removeschoolclass', function (event) {
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
                url: 'https://alxproject.virilesoftware.com/api/session/' + ref_id,
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
                var name = $('#session_name').val();
                var passd = {
                    'name': name,
					first_start:first_start.format(), first_end:first_end.format(),
					second_start:second_start.format(), second_end:second_end.format(),
					third_start:third_start.format(), third_end:third_end.format()
                }
                var href = 'https://alxproject.virilesoftware.com/api/session';
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
						var payload = jwt_decode(token);
						alert(data.msg)
                        var table = document.getElementById("tabledata");
						var tbl = $('table#tabledata  tr:last').index() + 1
						var thtmls =
					  '<tr id="row'+data.ref_id+'">\
					  <td style="padding-top:20px">'+ data.name + '</td>\
						<td style="padding-top:20px">'+ data.first_term + '</td>\
						<td style="padding-top:20px">'+ data.second_term + '</td>\
						<td style="padding-top:20px">'+ data.third_term + '</td>\
					  <td><div class="user-btn-wrapper">\
                    <a href="https://alxproject.virilesoftware.com/eportal/'+payload.username+'/editsession/'+data.ref_id+'" class="btn btn-outline-warning btn-icon">\
                      <div class="tx-12"><i class="fa fa-edit"></i></div>\
                    </a>\
                  <a href="#" class="btn btn-outline-danger btn-icon removeschoolclass" id="' +data.ref_id + '"  data-name ="' + data.name + '" >\
                      <div class="tx-12"><i class="fa fa-trash"></i></div>\
                    </a>\
                    </div></td>\
				   </tr>';
						var row = table.insertRow(tbl).outerHTML = thtmls;
						$('#load-submit').removeClass('d-none');
                        $('#processing-btn').addClass('d-none');
						$('#sessionformpanel').addClass('d-none')
						$('input[name=session_name]').val('');
						
                    } else {
                        alert(data.msg)
                        $('#load-submit').removeClass('d-none');
                        $('#processing-btn').addClass('d-none');
                    }

                });
            }
        })

    });
	
	
	
});