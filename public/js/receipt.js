$(document).ready(function(){
	var rows = []
	var staff = []
	var z = 0
	var total_amount = 0
	var table = null
	var token = auth.getToken();
	var constraints = {
         sch_class: {
             presence: true,
          },
	};
	var table_index = 0
	
	if(auth.isLoggedIn())
	{
		
		var ref_id = $('head').attr('id')
		
		var href = 'https://alxproject.virilesoftware.com/api/studentfeesinvoice/'+ref_id;
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
				$('#invoice_no').html(data.receipt)
				$('#receipt_date').html(moment(data.trans_date).format('MMMM DD, YYYY'))
				$('#student_name').html(data.name)
				$('#student_class').html(data.student_class)
				$('#session').html(data.academic)
				$('#fees_balance').html(new Number(data.balance).toLocaleString('en'))
				var info = JSON.parse(data.bill_info)
				var ht = ''
				for(var i = 0; i < info.length; i++){
					if(parseInt(info[i].payment) == 0 && parseInt(info[i].balance) == 0)
					{}
					else{
					ht += '<div class="card"><div class="container"><div class="row"><div class="column"><div class="fees_type"><span>'+info[i].fees+'</span></div>\
	<div class="amount"><span>'+new Number(info[i].due).toLocaleString('en')+'</span></div></div><div class="column"><div class="paid"><span>Paid</span></div>\
		<div class="n_0000"><span>'+new Number(info[i].payment).toLocaleString('en')+'</span></div></div><div class="column"><div class="paid"><span>Balance</span>\
		</div><div class="n_0000"><span>'+new Number(info[i].balance).toLocaleString('en')+'</span></div></div></div></div></div>'
					}
				}
				$('#bot').html(ht)
				$('.card_total').html('<div class="column"><div id="Total_Amount_"><span>Total Paid </span></div></div><div class="column"><div id="n_0000_p">\
		<span>'+new Number(data.paid).toLocaleString('en')+'</span></div></div>\
				<p style="font-weight:400; margin-top:15px;padding-top:30px;font-size:14px">Payment Method: <span>'+data.payment_method+'</span></p>')
			}
			
		});
		
        
		
	}
	else
	{
		window.location = 'https://alxproject.virilesoftware.com/eportal/login'
	}
	
	
	
});