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
        
		var ref = $('head').attr('id')
		var href = 'https://alxproject.virilesoftware.com/api/session/'+ref;
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
			var payload = jwt_decode(token);
			if(data.status == 'ok'){
				$('#session_name').val(data.data.name);
				$('#session_name').trigger('change');
				first_start = moment(data.data.first_start)
				first_end = moment(data.data.first_end);
				second_start = moment(data.data.second_start)
				second_end = moment(data.data.second_end);
				third_start = moment(data.data.third_start)
				third_end = moment(data.data.third_end);
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
			}
			else{
				alert(data.msg)
				window.location = 'https://alxproject.virilesoftware.com/eportal/'+payload.username+'/session'
			}
			
		});
		
		
		
	}
	else
	{
		window.location = 'https://alxproject.virilesoftware.com/eportal/login'
	}
	
	
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
                var ref = $('head').attr('id')
				var href = 'https://alxproject.virilesoftware.com/api/session/'+ref;
                $.ajax({
                    type: 'PUT',
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
                        window.location = 'https://alxproject.virilesoftware.com/eportal/'+payload.username+'/session'
						
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