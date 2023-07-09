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
			academic_session:$('#academic_session').select2('data')[0].id,
			session_term:$('#session_term').select2('data')[0].id,
			first_start:first_start.format(), first_end:first_end.format(),
		}
				
        var payload = jwt_decode(token);
		var href = 'https://alxproject.virilesoftware.com/api/financereport';
		$.ajax({
			type: 'GET',
			data: dt,
			url: href,
			dataType:'JSON',
			beforeSend : function(req) {
				req.setRequestHeader('Authorization', 'Bearer '+token);
			}
		}).done(function(datas){
            console.log(datas)
            if(datas.status == 200){
                var data = datas.data
                var htmls = '<thead class="thead-colored  bg-success"><tr><td></td><td>Credit</td><td>Debit</td><td></td></tr><thead><tbody id="weekbody">'
				htmls  +='<tr><td>Fees</td><td>'+new Number(data.fees).toLocaleString('en')+'</td><td></td><td></td></tr>'
				htmls  +='<tr><td>Other Income</td><td>'+new Number(data.income).toLocaleString('en')+'</td><td></td><td></td></tr>'
                var exp = data.expense_info
                for(var s = 0; s < exp.length; s++){
                    htmls  +='<tr><td>'+exp[s].name+'</td><td></td><td>'+new Number(exp[s].amount).toLocaleString('en')+'</td><td></td></tr>'
                }
				
				var total_income = math.chain(data.fees).add(data.income).done()
                var bal = math.chain(total_income).subtract(data.expense).done()
                htmls  +='<tr><td>Total</td><td>'+new Number(total_income).toLocaleString('en')+'</td>\
                <td>'+new Number(data.expense).toLocaleString('en')+'</td>\
                <td>'+new Number(bal).toLocaleString('en')+'</td></tr>'

                $('#dataTableWeek').html(htmls)
                table = $('#dataTableWeek').DataTable({
                    retrieve:true,
                    searching:false,
                    paging:false,
                    sorting:false,
                    bInfo:false,
                    bFilter:false,
                    ordering:false,
                    dom: 'Bfrtip',
                    buttons: [
                        'csv', 'excel','pdf', 'print'
                    ],
                    
                    });
            }
			
		})
		
	})
	
    
	
});